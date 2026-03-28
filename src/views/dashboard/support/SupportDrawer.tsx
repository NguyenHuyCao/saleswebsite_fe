"use client";

import {
  Alert,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";
import SupportChatPanel from "./SupportChatPanel";
import { useSocket } from "@/lib/socket/SocketContext";

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
  open: boolean;
  onClose: () => void;
  onCountChange?: () => void;
}

const STATUS_TABS = ["PENDING", "IN_PROGRESS", "RESOLVED"] as const;
type StatusTab = typeof STATUS_TABS[number];

const STATUS_LABELS: Record<StatusTab, string> = {
  PENDING: "Chờ xử lý",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xong",
};

const STATUS_COLORS: Record<StatusTab, "warning" | "info" | "success"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

export default function SupportDrawer({ open, onClose, onCountChange }: Props) {
  const [tab, setTab] = useState<StatusTab>("PENDING");
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SupportRequest | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  // IDs of requests with unread customer messages (shown as dot indicator in list)
  const [unreadRequestIds, setUnreadRequestIds] = useState<Set<number>>(new Set());
  const { notifications, supportSocketMsgs, clearSupportUnread } = useSocket();

  const loadRequests = async (status: StatusTab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ result: SupportRequest[]; meta: { total: number } }>(
        `/api/v1/admin/support?status=${status}&size=50`
      );
      setRequests(res?.result ?? []);
    } catch (err: unknown) {
      logIfNotCanceled(err, "Load support requests error:");
      const httpStatus = (err as { status?: number })?.status;
      if (httpStatus === 403) {
        setError("Không có quyền truy cập. Vui lòng khởi động lại server để cấp quyền.");
      } else {
        setError("Không thể tải danh sách. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCount = async () => {
    try {
      const res = await api.get<{ count: number }>("/api/v1/admin/support/pending-count");
      setPendingCount(res?.count ?? 0);
    } catch {}
  };

  useEffect(() => {
    if (open) {
      loadRequests(tab);
      loadPendingCount();
      clearSupportUnread();
    }
  }, [open, tab, clearSupportUnread]);

  // Direct socket path: mark request as having unread messages instantly
  useEffect(() => {
    if (!supportSocketMsgs.length) return;
    supportSocketMsgs.forEach((msg) => {
      if (msg.role !== "user") return;
      if (!msg.requestId) return;
      // Don't mark as unread if this request is currently open in chat panel
      if (selected?.id === msg.requestId) return;
      setUnreadRequestIds((prev) => {
        if (prev.has(msg.requestId!)) return prev;
        const next = new Set(prev);
        next.add(msg.requestId!);
        return next;
      });
    });
  }, [supportSocketMsgs, selected]);

  // React to support-related socket notifications
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    notifications.forEach((n) => {
      if (n.read) return;
      if (n.type === "SUPPORT_ESCALATED") {
        // New escalation: refresh pending count + list
        loadPendingCount();
        if (tab === "PENDING") loadRequests("PENDING");
        onCountChange?.();
      }
      if (n.type === "SUPPORT_CUSTOMER_MESSAGE") {
        // Customer sent a message: mark that request as having unread messages
        try {
          const meta = JSON.parse(n.metadataJson || "{}");
          if (meta.requestId) {
            setUnreadRequestIds((prev) => {
              if (prev.has(meta.requestId)) return prev;
              const next = new Set(prev);
              next.add(meta.requestId);
              return next;
            });
          }
        } catch {}
        // Also ensure the request appears in the list if we're on the right tab
        if (tab === "IN_PROGRESS" || tab === "PENDING") loadRequests(tab);
      }
      if (n.type === "SUPPORT_RESOLVED") {
        loadPendingCount();
        onCountChange?.();
        if (tab === "IN_PROGRESS" || tab === "PENDING") loadRequests(tab);
      }
    });
  }, [notifications]); // intentionally omit deps (functions not memoized)

  const handleClaimed = (updated: SupportRequest) => {
    // If we're on the PENDING tab, remove the item (it moved to IN_PROGRESS)
    if (tab === "PENDING") {
      setRequests((prev) => prev.filter((r) => r.id !== updated.id));
    } else {
      setRequests((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    }
    if (selected?.id === updated.id) setSelected(updated);
    loadPendingCount();
    onCountChange?.();
  };

  const handleResolved = (updated: SupportRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== updated.id));
    setSelected(null);
    loadPendingCount();
    onCountChange?.();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100vw", sm: 420 }, display: "flex", flexDirection: "column" } }}
    >
      {/* Drawer header */}
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        {selected ? (
          <IconButton size="small" onClick={() => setSelected(null)}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        ) : (
          <HeadsetMicIcon color="primary" />
        )}
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
          {selected ? "Chi tiết hội thoại" : "Hỗ trợ & Trò chuyện"}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {selected ? (
        // Chat detail view
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <SupportChatPanel
            request={selected}
            onClaimed={handleClaimed}
            onResolved={handleResolved}
          />
        </Box>
      ) : (
        // Request list view
        <>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}
          >
            {STATUS_TABS.map((s) => (
              <Tab
                key={s}
                value={s}
                label={
                  s === "PENDING" && pendingCount > 0 ? (
                    <Badge badgeContent={pendingCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10 } }}>
                      {STATUS_LABELS[s]}
                    </Badge>
                  ) : STATUS_LABELS[s]
                }
              />
            ))}
          </Tabs>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {error && (
              <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress size={32} />
              </Box>
            ) : !error && requests.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 6, px: 3 }}>
                <HeadsetMicIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                <Typography color="text.secondary">Không có yêu cầu nào</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {requests.map((req, i) => {
                  const hasUnread = unreadRequestIds.has(req.id);
                  return (
                  <Box key={req.id}>
                    {i > 0 && <Divider />}
                    <ListItemButton
                      onClick={() => {
                        setSelected(req);
                        // Clear unread indicator when opening this chat
                        setUnreadRequestIds((prev) => {
                          if (!prev.has(req.id)) return prev;
                          const next = new Set(prev);
                          next.delete(req.id);
                          return next;
                        });
                      }}
                      sx={{ py: 1.5, px: 2, bgcolor: hasUnread ? "action.hover" : undefined }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack direction="row" alignItems="center" gap={0.75} sx={{ flex: 1, mr: 1, minWidth: 0 }}>
                            {hasUnread && (
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main", flexShrink: 0 }} />
                            )}
                            <Typography variant="subtitle2" fontWeight={hasUnread ? 700 : 600} noWrap>
                              {req.customerName || req.customerEmail || "Khách ẩn danh"}
                            </Typography>
                          </Stack>
                          <Chip
                            label={STATUS_LABELS[req.status as StatusTab] || req.status}
                            color={STATUS_COLORS[req.status as StatusTab] || "default"}
                            size="small"
                            sx={{ fontSize: 10, height: 20 }}
                          />
                        </Stack>
                        {req.customerEmail && (
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {req.customerEmail}
                          </Typography>
                        )}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                          {req.claimedBy ? (
                            <Typography variant="caption" color="text.disabled">
                              NV: {req.claimedBy}
                            </Typography>
                          ) : <span />}
                          <Typography variant="caption" color={hasUnread ? "error.main" : "text.disabled"} fontWeight={hasUnread ? 600 : 400}>
                            {hasUnread ? "Tin nhắn mới" : formatRelative(req.createdAt)}
                          </Typography>
                        </Stack>
                      </Box>
                    </ListItemButton>
                  </Box>
                  );
                })}
              </List>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
