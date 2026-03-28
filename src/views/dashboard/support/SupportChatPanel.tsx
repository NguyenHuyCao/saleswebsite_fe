"use client";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";
import { useSocket } from "@/lib/socket/SocketContext";

interface SupportMessage {
  role: "user" | "assistant" | "admin" | "system";
  content: string;
  ts: number;
  notifId?: number;
}

interface SupportRequest {
  id: number;
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  status: string;
  claimedBy?: string;
  createdAt: string;
}

interface Props {
  request: SupportRequest;
  onClaimed: (updated: SupportRequest) => void;
  onResolved: (updated: SupportRequest) => void;
}

function formatTime(ts: number) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export default function SupportChatPanel({ request, onClaimed, onResolved }: Props) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [resolving, setResolving] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { notifications, supportSocketMsgs } = useSocket();
  // Only process socket messages that arrive AFTER this component mounts.
  // Historical messages come from the API load — replaying old socket messages causes
  // duplicates because DB ts (second-precision) ≠ socket ts (millisecond-precision).
  const socketStartIdxRef = useRef(supportSocketMsgs.length);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const data = await api.get<SupportMessage[]>(
          `/api/v1/admin/support/${request.id}/messages`,
          { signal: controller.signal }
        );
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        logIfNotCanceled(err, "Load support messages error:");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [request.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for real-time customer messages via notification system (fallback/badge path)
  useEffect(() => {
    notifications.forEach((n) => {
      if (n.read) return;
      if (n.type !== "SUPPORT_CUSTOMER_MESSAGE") return;
      try {
        const meta = JSON.parse(n.metadataJson || "{}");
        if (meta.requestId !== request.id) return;
        const content: string = meta.message || n.content;
        setMessages((prev) => {
          if (prev.some((m) => m.notifId === n.id)) return prev;
          // Also dedup against messages already shown via API load or direct socket path
          const msgTs = new Date(n.createdAt).getTime() || Date.now();
          if (prev.some((m) => m.role === "user" && m.content === content && Math.abs(m.ts - msgTs) < 2000)) return prev;
          return [...prev, {
            role: "user",
            content,
            ts: new Date(n.createdAt).getTime() || Date.now(),
            notifId: n.id,
          }];
        });
      } catch {
        // ignore malformed
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, request.id]);

  // Direct socket path — instant delivery without waiting for notification system.
  // Only processes messages received AFTER this component mounted (socketStartIdxRef).
  useEffect(() => {
    const newMsgs = supportSocketMsgs.slice(socketStartIdxRef.current);
    if (!newMsgs.length) return;
    newMsgs.forEach((msg) => {
      if (msg.role !== "user") return;
      if (msg.requestId !== undefined && msg.requestId !== request.id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.role === "user" && m.content === msg.content && Math.abs(m.ts - msg.ts) < 2000)) return prev;
        return [...prev, { role: "user", content: msg.content, ts: msg.ts }];
      });
    });
  }, [supportSocketMsgs, request.id]);

  const handleSend = async () => {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await api.post(`/api/v1/admin/support/${request.id}/reply`, { message: text });
      setMessages((prev) => [
        ...prev,
        { role: "admin", content: text, ts: Date.now() },
      ]);
      setReply("");
    } catch (err) {
      logIfNotCanceled(err, "Send reply error:");
    } finally {
      setSending(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const updated = await api.post<SupportRequest>(`/api/v1/admin/support/${request.id}/claim`);
      if (updated) onClaimed(updated);
    } catch (err) {
      logIfNotCanceled(err, "Claim error:");
    } finally {
      setClaiming(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      const updated = await api.post<SupportRequest>(`/api/v1/admin/support/${request.id}/resolve`);
      if (updated) onResolved(updated);
    } catch (err) {
      logIfNotCanceled(err, "Resolve error:");
    } finally {
      setResolving(false);
    }
  };

  const isResolved = request.status === "RESOLVED";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {request.customerName || request.customerEmail || "Khách ẩn danh"}
            </Typography>
            {request.customerEmail && (
              <Typography variant="caption" color="text.secondary">{request.customerEmail}</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            {request.status === "PENDING" && (
              <Button
                size="small"
                variant="outlined"
                startIcon={claiming ? <CircularProgress size={12} /> : <AssignmentIndIcon />}
                onClick={handleClaim}
                disabled={claiming}
              >
                Tiếp nhận
              </Button>
            )}
            {!isResolved && (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={resolving ? <CircularProgress size={12} /> : <CheckCircleOutlineIcon />}
                onClick={handleResolve}
                disabled={resolving}
              >
                Đóng phiên
              </Button>
            )}
          </Stack>
        </Stack>
        {request.claimedBy && (
          <Typography variant="caption" color="text.secondary">
            Nhân viên: {request.claimedBy}
          </Typography>
        )}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f7f8fc", display: "flex", flexDirection: "column", gap: 1, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: 2 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            Chưa có tin nhắn
          </Typography>
        ) : (
          messages.map((msg, idx) => {
            if (msg.role === "system") {
              return (
                <Box key={idx} sx={{ display: "flex", justifyContent: "center", my: 0.5 }}>
                  <Typography variant="caption" sx={{ bgcolor: "#eeeeee", color: "#757575", px: 1.5, py: 0.5, borderRadius: 3, fontSize: 11 }}>
                    {msg.content}
                  </Typography>
                </Box>
              );
            }

            const isRight = msg.role === "admin";
            return (
              <Box key={idx} sx={{ display: "flex", justifyContent: isRight ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 1 }}>
                {!isRight && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: msg.role === "assistant" ? "#f25c05" : "#455a64", flexShrink: 0 }}>
                    {msg.role === "assistant"
                      ? <SmartToyIcon sx={{ fontSize: 14 }} />
                      : <PersonIcon sx={{ fontSize: 14 }} />
                    }
                  </Avatar>
                )}
                <Box sx={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isRight ? "flex-end" : "flex-start", gap: 0.3 }}>
                  {isRight && (
                    <Typography variant="caption" sx={{ color: "#1565c0", fontWeight: 600, fontSize: 10, px: 0.5 }}>Bạn</Typography>
                  )}
                  <Box sx={{
                    bgcolor: isRight ? "#1976d2" : msg.role === "assistant" ? "#fff" : "#fff",
                    color: isRight ? "#fff" : "#1a1a1a",
                    borderRadius: isRight ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    px: 1.75, py: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                    fontSize: 13.5, lineHeight: 1.65, wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </Box>
                  {msg.ts > 0 && (
                    <Typography variant="caption" sx={{ color: "#c0c0c0", fontSize: 10, px: 0.5 }}>
                      {formatTime(msg.ts)}
                    </Typography>
                  )}
                </Box>
                {isRight && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#1976d2", flexShrink: 0 }}>
                    <HeadsetMicIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Divider />
      {isResolved ? (
        <Box sx={{ px: 2, py: 1.5, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">Phiên hỗ trợ đã kết thúc</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 1.5, py: 1, bgcolor: "#fff", display: "flex", alignItems: "flex-end", gap: 1, flexShrink: 0 }}>
          <TextField
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Nhập phản hồi... (Enter để gửi)"
            multiline
            maxRows={3}
            fullWidth
            size="small"
            variant="outlined"
            disabled={sending}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: 13.5, bgcolor: "#f7f8fc", "& fieldset": { borderColor: "#e8eaf0" }, "&:hover fieldset": { borderColor: "#1976d2" }, "&.Mui-focused fieldset": { borderColor: "#1976d2" } } }}
          />
          <Tooltip title="Gửi (Enter)">
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                sx={{ bgcolor: "#1976d2", color: "#fff", width: 38, height: 38, flexShrink: 0, "&:hover": { bgcolor: "#1565c0" }, "&.Mui-disabled": { bgcolor: "#f0f0f0" } }}
              >
                {sending ? <CircularProgress size={16} sx={{ color: "#1976d2" }} /> : <SendIcon sx={{ fontSize: 17 }} />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
