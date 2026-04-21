"use client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StopIcon from "@mui/icons-material/Stop";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";
import { useSocket } from "@/lib/socket/SocketContext";
import { api } from "@/lib/api/http";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant" | "admin" | "system";
  content: string;
  streaming?: boolean;
  ts: number;
  isError?: boolean;
  /** Track which notification id generated this message (dedup guard) */
  notifId?: number;
}

type SupportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

interface ProductLink {
  name: string;
  slug: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/$/, "");

const WELCOME: Message = {
  role: "assistant",
  content:
    "Xin chào! Tôi là trợ lý AI của **Máy 2 Thì**.\n\nTôi có thể giúp bạn:\n- Tư vấn chọn máy phù hợp nhu cầu\n- Tra cứu giá & thông tin sản phẩm\n- Hướng dẫn bảo hành, đổi trả\n- Hỗ trợ đặt hàng online\n\nBạn cần hỗ trợ gì?",
  ts: 0,
};

const QUICK_REPLIES = [
  "Tư vấn máy cưa xích phù hợp",
  "Chính sách bảo hành như thế nào?",
  "Máy cắt cỏ Honda giá bao nhiêu?",
  "So sánh Husqvarna và Stihl",
  "Cách pha nhớt 2 thì đúng tỉ lệ",
];

const ESCALATION_PHRASES = [
  "chưa có thông tin",
  "nhân viên hỗ trợ",
  "liên hệ trực tiếp",
  "không có thông tin chính xác",
  "vui lòng liên hệ",
  "mình sẽ nhờ nhân viên",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("ai_session_id");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ai_session_id", sid);
  }
  return sid;
}

function extractProductLinks(text: string): ProductLink[] {
  const regex = /\/product\?name=([\w-]+)/g;
  const seen = new Set<string>();
  const links: ProductLink[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    const slug = m[1];
    if (!seen.has(slug)) {
      seen.add(slug);
      links.push({ name: slug.replace(/-/g, " "), slug });
    }
  }
  return links;
}

function getSuggestions(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("máy cưa") || t.includes("chainsaw"))
    return ["Phụ tùng máy cưa có sẵn không?", "Cách bảo dưỡng máy cưa xích", "So sánh Honda vs Husqvarna"];
  if (t.includes("bảo hành") || t.includes("đổi trả"))
    return ["Quy trình bảo hành cụ thể?", "Thời gian xử lý bảo hành?", "Bảo hành tại chỗ hay gửi đi?"];
  if (t.includes("máy cắt cỏ") || t.includes("trimmer"))
    return ["Máy phù hợp diện tích bao nhiêu?", "So sánh các dòng máy cắt cỏ", "Cách pha xăng 2 thì"];
  if (t.includes("giá") || t.includes("mua") || t.includes("đặt hàng"))
    return ["Có chương trình khuyến mãi không?", "Phương thức thanh toán nào?", "Thời gian giao hàng bao lâu?"];
  if (t.includes("pha nhớt") || t.includes("nhiên liệu") || t.includes("xăng"))
    return ["Tỉ lệ pha nhớt từng loại máy?", "Mua nhớt 2T ở đây không?", "Bảo dưỡng định kỳ thế nào?"];
  if (t.includes("máy bơm") || t.includes("máy phát điện"))
    return ["Công suất phù hợp cho gia đình?", "Bảo trì máy phát điện?", "Xem thêm sản phẩm"];
  return [];
}

function checkEscalation(text: string): boolean {
  const t = text.toLowerCase();
  return ESCALATION_PHRASES.some((p) => t.includes(p));
}

function formatTime(ts: number) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

/** Render inline: **bold** — safe with special chars */
function renderInline(text: string) {
  const parts = text.split(/\*\*([\s\S]+?)\*\*/g);
  return parts.map((p, pi) =>
    pi % 2 === 1 ? <strong key={pi}>{p}</strong> : <span key={pi}>{p}</span>
  );
}

/** Render markdown: **bold**, - + • bullets, 1. numbered, \n newline */
function renderMarkdown(text: string, isStreaming?: boolean) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const isBullet = /^[-+•]\s/.test(line);
    const numberedMatch = /^(\d+)\.\s(.*)/.exec(line);

    if (isBullet) {
      const content = line.replace(/^[-+•]\s/, "");
      nodes.push(
        <Box key={li} sx={{ display: "flex", gap: 0.75, alignItems: "flex-start", mt: li > 0 ? 0.4 : 0 }}>
          <Box component="span" sx={{ mt: "5px", color: "#f25c05", fontSize: 8, flexShrink: 0, lineHeight: 1 }}>●</Box>
          <Box component="span" sx={{ flex: 1 }}>
            {renderInline(content)}
            {isStreaming && li === lines.length - 1 && <StreamingCursor />}
          </Box>
        </Box>
      );
    } else if (numberedMatch) {
      nodes.push(
        <Box key={li} sx={{ display: "flex", gap: 0.75, alignItems: "flex-start", mt: li > 0 ? 0.4 : 0 }}>
          <Box component="span" sx={{ color: "#f25c05", fontWeight: 700, fontSize: 12, flexShrink: 0, minWidth: 16 }}>
            {numberedMatch[1]}.
          </Box>
          <Box component="span" sx={{ flex: 1 }}>
            {renderInline(numberedMatch[2])}
            {isStreaming && li === lines.length - 1 && <StreamingCursor />}
          </Box>
        </Box>
      );
    } else if (line === "") {
      nodes.push(<Box key={li} sx={{ height: 5 }} />);
    } else {
      nodes.push(
        <Box key={li} component="span" sx={{ display: "block", mt: li > 0 ? 0.1 : 0 }}>
          {renderInline(line)}
          {isStreaming && li === lines.length - 1 && <StreamingCursor />}
        </Box>
      );
    }
  }
  return nodes;
}

function StreamingCursor() {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "2px",
        height: "14px",
        bgcolor: "#f25c05",
        ml: "2px",
        verticalAlign: "middle",
        borderRadius: "1px",
        animation: "blink 0.9s step-end infinite",
        "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } },
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AiChatWidget({ onChatOpenChange }: { onChatOpenChange?: (open: boolean) => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  useEffect(() => { onChatOpenChange?.(open); }, [open, onChatOpenChange]);

  // External trigger: CompareDialog fires "aiChatTrigger" with a pre-filled message
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<{ message: string }>).detail?.message;
      if (!msg) return;
      setOpen(true);
      // Small delay to let the widget open before sending
      setTimeout(() => sendMessageRef.current(msg), 400);
    };
    window.addEventListener("aiChatTrigger", handler);
    return () => window.removeEventListener("aiChatTrigger", handler);
  }, []);

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [aiOffline, setAiOffline] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  // Per-last-message state
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);
  const [needsEscalation, setNeedsEscalation] = useState(false);
  // Live support state
  const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null);
  const [supportRequestId, setSupportRequestId] = useState<number | null>(null);
  const [escalating, setEscalating] = useState(false);
  const { notifications, supportSocketMsgs, supportResolvedEvents } = useSocket();
  const currentUser = useSelector((state: AppState) => state.auth.user);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [newMsgCount, setNewMsgCount] = useState(0);

  const sessionId = useRef<string>("");
  // Only process socket messages/events that arrive AFTER this component mounts.
  const socketStartIdxRef = useRef(supportSocketMsgs.length);
  const resolvedStartIdxRef = useRef(supportResolvedEvents.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Accumulate streaming tokens in a ref to avoid React batching drops
  const streamingBufRef = useRef<string>("");
  const rafRef = useRef<number | null>(null);
  // Track whether the user is near the bottom of the chat
  const isAtBottomRef = useRef(true);
  const prevMsgCountRef = useRef(0);
  // Track the highest DB ts we've successfully received — persists across renders,
  // prevents showing a previous answer as the "new" reply for the next question.
  const lastReceivedDbTsRef = useRef<number>(0);
  // Master timeout: auto-cancel if AI doesn't respond within MASTER_TIMEOUT_MS
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to the scrollable messages container — used for direct scroll inside typewriter tick
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Message queue: buffer messages sent while a response is in-flight
  const messageQueueRef = useRef<string[]>([]);
  // Always-current ref to sendMessage — used by the queue processor effect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessageRef = useRef<(text?: string) => void>(() => {});

  // Init sessionId từ localStorage (client-only)
  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  // Persist support state vào localStorage mỗi khi thay đổi
  useEffect(() => {
    const sid = sessionId.current;
    if (!sid) return;
    if (supportStatus && supportRequestId) {
      localStorage.setItem(`supp_${sid}`, JSON.stringify({ requestId: supportRequestId, status: supportStatus }));
    } else if (!supportStatus) {
      localStorage.removeItem(`supp_${sid}`);
    }
  }, [supportStatus, supportRequestId]);

  // Notification path — fallback for when socket delivery fails or user is offline.
  // Primary delivery is via support:message / support:resolved socket events (faster).
  useEffect(() => {
    notifications.forEach((n) => {
      if (n.read) return;
      try {
        const meta = JSON.parse(n.metadataJson || "{}");
        const isMySession =
          (supportRequestId !== null && meta.requestId === supportRequestId) ||
          (sessionId.current !== "" && meta.sessionId === sessionId.current);

        if (n.type === "SUPPORT_MESSAGE" && isMySession) {
          const content: string = meta.message || n.content;
          const msgTs = new Date(n.createdAt).getTime() || Date.now();
          setMessages((prev) => {
            // Dedup by notifId (same notification re-processed)
            if (prev.some((m) => m.notifId === n.id)) return prev;
            // Dedup against message already delivered by socket path (no notifId, same content+ts)
            if (prev.some((m) => m.role === "admin" && m.content === content && Math.abs(m.ts - msgTs) < 2000)) return prev;
            // Genuine new message — mark status and increment badge here (inside updater)
            // so these side-effects only run when message is truly added
            setSupportStatus("IN_PROGRESS");
            if (!open) setUnread((u) => u + 1);
            return [...prev, { role: "admin", content, ts: msgTs, notifId: n.id }];
          });
        }

        // SUPPORT_RESOLVED notification is a fallback; primary path is support:resolved socket event.
        // Only handle here if the socket event was missed (e.g. session was closed while disconnected).
        if (n.type === "SUPPORT_RESOLVED" && isMySession) {
          setMessages((prev) => {
            if (prev.some((m) => m.notifId === n.id)) return prev;
            // Skip if already resolved by the socket path (system message already present)
            if (prev.some((m) => m.role === "system" && m.content.includes("kết thúc"))) return prev;
            setSupportStatus("RESOLVED");
            localStorage.removeItem(`supp_${sessionId.current}`);
            return [...prev, { role: "system", content: "Phiên hỗ trợ đã kết thúc. Cảm ơn bạn đã liên hệ!", ts: Date.now(), notifId: n.id }];
          });
        }
      } catch {
        // ignore malformed metadataJson
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, supportRequestId]);

  // PRIMARY path: direct socket support messages (instant, no notification system latency).
  // Only processes messages received AFTER this component mounted (socketStartIdxRef).
  useEffect(() => {
    if (!supportRequestId) return;
    const newMsgs = supportSocketMsgs.slice(socketStartIdxRef.current);
    if (!newMsgs.length) return;
    newMsgs.forEach((msg) => {
      if (msg.role !== "admin") return;
      if (msg.requestId !== undefined && msg.requestId !== supportRequestId) return;
      if (msg.sessionId !== undefined && sessionId.current && msg.sessionId !== sessionId.current) return;
      setMessages((prev) => {
        // Dedup: allow ±2s tolerance for DB second-precision vs socket ms-precision ts
        if (prev.some((m) => m.role === "admin" && m.content === msg.content && Math.abs(m.ts - msg.ts) < 2000)) return prev;
        // Message is new — update status and badge inside updater to avoid double-counting
        setSupportStatus("IN_PROGRESS");
        if (!open) setUnread((u) => u + 1);
        return [...prev, { role: "admin", content: msg.content, ts: msg.ts }];
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportSocketMsgs, supportRequestId]);

  // PRIMARY path: support:resolved socket event — instant session closure notification.
  // Fallback: SUPPORT_RESOLVED notification (handled in the notification effect above).
  useEffect(() => {
    if (!supportRequestId) return;
    const newEvts = supportResolvedEvents.slice(resolvedStartIdxRef.current);
    if (!newEvts.length) return;
    newEvts.forEach((evt) => {
      if (evt.requestId !== supportRequestId) return;
      setMessages((prev) => {
        // Dedup: if a "kết thúc" system message already exists, skip
        if (prev.some((m) => m.role === "system" && m.content.includes("kết thúc"))) return prev;
        setSupportStatus("RESOLVED");
        localStorage.removeItem(`supp_${sessionId.current}`);
        return [
          ...prev,
          { role: "system", content: "Phiên hỗ trợ đã kết thúc. Cảm ơn bạn đã liên hệ!", ts: evt.ts || Date.now() },
        ];
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportResolvedEvents, supportRequestId]);

  // Scroll-to-bottom helpers
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = scrollContainerRef.current;
    if (el) {
      if (behavior === "instant") {
        el.scrollTop = el.scrollHeight;
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior });
      }
    }
    isAtBottomRef.current = true;
    setShowScrollBtn(false);
    setNewMsgCount(0);
  };

  const handleMessagesScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    isAtBottomRef.current = atBottom;
    if (atBottom) {
      setShowScrollBtn(false);
      setNewMsgCount(0);
    }
  };

  // Scroll on open: jump to bottom immediately after DOM mounts
  useEffect(() => {
    if (!open) {
      setShowScrollBtn(false);
      setNewMsgCount(0);
      isAtBottomRef.current = true;
      return;
    }
    // Use rAF + small delay to let the framer-motion animation attach the DOM node
    const timer = setTimeout(() => scrollToBottom("instant"), 60);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-scroll or show "new message" button on message changes.
  // NOTE: must NOT call setState unconditionally here — messages changes every rAF tick
  // during typewriter animation and would exceed React's update depth limit.
  // showScrollBtn/newMsgCount resets are handled by scrollToBottom + handleMessagesScroll.
  useEffect(() => {
    if (streaming) return;
    const msgCount = messages.length;
    const added = msgCount > prevMsgCountRef.current;
    prevMsgCountRef.current = msgCount;

    if (isAtBottomRef.current) {
      // Already at bottom — scroll to reveal any new content
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (added) {
      const last = messages[messages.length - 1];
      // Only count incoming messages (admin / AI), not user's own sent messages
      if (last && last.role !== "user") {
        setNewMsgCount((c) => c + 1);
        setShowScrollBtn(true);
      }
    }
  }, [messages, followUps, streaming]);

  // Khi mở widget: load lịch sử từ BE (chỉ lần đầu)
  useEffect(() => {
    if (!open || historyLoaded || !sessionId.current) return;

    setLoadingHistory(true);

    // Chạy song song: load history + ping AI
    const historyPromise = fetch(
      `${BASE_URL}/api/v1/ai/sessions/${sessionId.current}/messages`,
      {
        credentials: "include",
      },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        const arr: Array<{ role: string; content: string; ts: number }> =
          Array.isArray(raw) ? raw : (raw?.data ?? raw?.result ?? []);
        if (arr.length > 0) {
          const restored = arr
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
              ts: m.ts || Date.now(),
            }));
          // Seed the high-water mark with the latest assistant ts from history.
          const maxHistoryTs = Math.max(
            0,
            ...restored.filter((m) => m.role === "assistant").map((m) => m.ts),
          );
          if (maxHistoryTs > lastReceivedDbTsRef.current)
            lastReceivedDbTsRef.current = maxHistoryTs;
          setMessages([WELCOME, ...restored]);
        }
      })
      .catch(() => {});

    const pingPromise = fetch(`${BASE_URL}/api/v1/ai/ping-ai`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok === false) setAiOffline(true);
      })
      .catch(() => setAiOffline(true));

    // Restore support state từ localStorage + verify với BE + load admin messages
    const supportRestorePromise = (async () => {
      const sid = sessionId.current;
      const saved = localStorage.getItem(`supp_${sid}`);
      if (!saved) return;
      try {
        const req = await api.get<{ id: number; status: string }>(
          `/api/v1/support/session/${sid}`
        );
        if (req?.id) {
          setSupportRequestId(req.id);
          setSupportStatus(req.status as SupportStatus);
          if (req.status === "RESOLVED") {
            localStorage.removeItem(`supp_${sid}`);
          }
          // Load lại toàn bộ tin nhắn support (bao gồm admin/system messages)
          // để restore đúng khi user reload trang
          try {
            const supportMsgs = await api.get<Array<{ role: string; content: string; ts: number }>>(
              `/api/v1/support/${req.id}/messages`
            );
            if (Array.isArray(supportMsgs) && supportMsgs.length > 0) {
              setMessages((prev) => {
                // Giữ nguyên user/assistant từ AI history, thêm admin/system từ support
                const extras = supportMsgs
                  .filter((m) => m.role === "admin" || m.role === "system")
                  .map((m) => ({
                    role: m.role as "admin" | "system",
                    content: m.content,
                    ts: m.ts,
                  }));
                if (extras.length === 0) return prev;
                // Merge + sort theo thời gian
                const merged = [...prev, ...extras].sort((a, b) => (a.ts || 0) - (b.ts || 0));
                // Remove WELCOME nếu có đủ lịch sử
                const withoutWelcome = merged.filter((m, i) => i > 0 || m.ts > 0);
                return withoutWelcome.length > 0 ? withoutWelcome : prev;
              });
            }
          } catch {
            // Non-critical — không block restore
          }
        } else {
          localStorage.removeItem(`supp_${sid}`);
        }
      } catch {
        // 404 = request không còn tồn tại → xoá local
        localStorage.removeItem(`supp_${sid}`);
      }
    })();

    Promise.all([historyPromise, pingPromise, supportRestorePromise]).finally(() => {
      setHistoryLoaded(true);
      setLoadingHistory(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    });

    setUnread(0);
  }, [open, historyLoaded]);

  // Focus input khi mở (nếu history đã loaded)
  useEffect(() => {
    if (open && historyLoaded) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, historyLoaded]);

  /**
   * Typewriter effect: reveals content char-by-char via RAF.
   * - Targets ~3s for typical responses (180 frames at 60fps).
   * - Pauses briefly at sentence-ending punctuation (. ! ? :) for natural reading rhythm.
   * - Scrolls the chat container directly each tick for smooth following.
   */
  const runTypewriter = (content: string) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    let pos = 0;
    let pauseFrames = 0;
    // ~3s for short/medium text; scale step for very long replies (max ~5s)
    const STEP = Math.max(1, Math.ceil(content.length / 180));

    const tick = () => {
      // Sentence-ending pause — hold for a few frames so the eye can catch up
      if (pauseFrames > 0) {
        pauseFrames--;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (abortRef.current?.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.streaming ? { ...m, content, streaming: false } : m,
          ),
        );
        setStreaming(false);
        rafRef.current = null;
        return;
      }

      pos = Math.min(pos + STEP, content.length);
      const isDone = pos >= content.length;

      // Pause after sentence-ending punctuation for a natural reading rhythm
      if (!isDone) {
        const ch = content[pos - 1];
        if (ch === "." || ch === "!" || ch === "?")
          pauseFrames = 10; // ~167ms
        else if (ch === "," || ch === ":" || ch === ";") pauseFrames = 4; // ~67ms
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.streaming
            ? { ...m, content: content.slice(0, pos), streaming: !isDone }
            : m,
        ),
      );

      // Scroll the container to follow the growing text — done here (not in useEffect)
      // so we get one smooth scroll per frame instead of a React re-render scroll.
      if (isAtBottomRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }

      if (isDone) {
        setStreaming(false);
        setFollowUps(getSuggestions(content));
        setProductLinks(extractProductLinks(content));
        setNeedsEscalation(checkEscalation(content));
        if (!open) setUnread((n) => n + 1);
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    // Support mode: route to admin chat instead of AI
    if (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS") {
      await sendSupportUserMessage(msg);
      return;
    }

    // If the last message is an error, allow sending even if streaming state is stale.
    // This recovers from any stuck state after a failed/timed-out question.
    const lastIsError = messages[messages.length - 1]?.isError === true;
    if (streaming && !lastIsError) {
      // Queue the message — it will be auto-sent once the current response finishes
      messageQueueRef.current.push(msg);
      setQueueCount(messageQueueRef.current.length);
      setInput("");
      return;
    }

    // Cleanup any stale state from a previous failed request
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;

    // Cancel any pending typewriter animation and finalize the frozen message
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setMessages((prev) =>
        prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
      );
    }

    setInput("");
    setFollowUps([]);
    setProductLinks([]);
    setNeedsEscalation(false);
    // Always snap to bottom when user sends a message
    isAtBottomRef.current = true;
    setShowScrollBtn(false);
    setNewMsgCount(0);

    // Use the high-water mark ref — always reflects the highest DB ts received so far.
    // This correctly advances after every answered question, preventing a previous answer
    // from being mistaken as "new" for the next question.
    const latestKnownAssistantTs = lastReceivedDbTsRef.current;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg, ts: Date.now() },
      { role: "assistant", content: "", streaming: true, ts: Date.now() },
    ]);
    setStreaming(true);

    // Scroll immediately so the user sees their question + typing indicator below it
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Step 1: Trigger BE — returns immediately with {status:"processing"}
      const res = await fetch(`${BASE_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: msg,
          keyword: msg,
        }),
        signal: controller.signal,
        credentials: "include",
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Lỗi server ${res.status}`);
      }

      // Master timeout: auto-cancel if AI doesn't respond within 30s
      const MASTER_TIMEOUT_MS = 30_000;
      pollTimeoutRef.current = setTimeout(() => {
        controller.abort();
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        lastReceivedDbTsRef.current = Date.now(); // fence: prevent Q1's late response polluting Q2
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.streaming
              ? {
                  ...m,
                  content: "AI không phản hồi. Vui lòng thử lại.",
                  streaming: false,
                  isError: true,
                }
              : m,
          ),
        );
        setStreaming(false);
        pollTimeoutRef.current = null;
      }, MASTER_TIMEOUT_MS);

      // Step 2: Poll DB every 500ms until new assistant message appears (max 60s backup)
      await new Promise<void>((resolve, reject) => {
        let polls = 0;
        const MAX = 120; // 60s backup (master timeout at 30s always fires first)

        const poll = async () => {
          if (controller.signal.aborted) {
            resolve();
            return;
          }
          if (polls++ >= MAX) {
            reject(new Error("Hết thời gian chờ. Vui lòng thử lại."));
            return;
          }

          try {
            const r = await fetch(
              `${BASE_URL}/api/v1/ai/sessions/${sessionId.current}/messages`,
              { credentials: "include", signal: controller.signal },
            );
            if (r.ok) {
              const raw = await r.json();
              const data = (
                Array.isArray(raw) ? raw : (raw?.data ?? raw?.result ?? [])
              ) as Array<{ role: string; content: string; ts: number }>;
              // Find the newest assistant message that is strictly newer than what we had before sending.
              // Timestamp-based: DB ts values are always > 0 and monotonically increasing.
              const newReply = data
                .filter(
                  (m) =>
                    m.role === "assistant" && m.ts > latestKnownAssistantTs,
                )
                .sort((a, b) => a.ts - b.ts)
                .at(-1);
              if (newReply?.content?.trim()) {
                lastReceivedDbTsRef.current = newReply.ts; // advance high-water mark
                runTypewriter(newReply.content);
                resolve();
                return;
              }
            }
          } catch (e) {
            if ((e as Error).name === "AbortError") {
              resolve();
              return;
            }
          }

          setTimeout(poll, 500);
        };

        poll();
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const errMsg =
        err instanceof Error ? err.message : "Đã có lỗi. Vui lòng thử lại.";
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content: errMsg, streaming: false, isError: true }
            : m,
        ),
      );
      setStreaming(false);
    } finally {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      abortRef.current = null;
      setStreaming(false); // always reset so next question is never blocked
    }
  };

  // Keep sendMessageRef always pointing at the latest closure
  sendMessageRef.current = sendMessage;

  // Auto-process next queued message once the current response finishes
  useEffect(() => {
    if (streaming) return;
    if (messageQueueRef.current.length === 0) return;
    const next = messageQueueRef.current.shift()!;
    setQueueCount(messageQueueRef.current.length);
    sendMessageRef.current(next);
  }, [streaming]);

  const handleStop = () => {
    messageQueueRef.current = [];
    setQueueCount(0);
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    abortRef.current?.abort();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setStreaming(false);
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.streaming ? { ...m, streaming: false } : m,
      ),
    );
  };

  const handleClose = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    abortRef.current?.abort();
    setOpen(false);
  };

  const handleClear = () => {
    messageQueueRef.current = [];
    setQueueCount(0);
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    abortRef.current?.abort();
    // Tạo session mới
    const newSid =
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ai_session_id", newSid);
    sessionId.current = newSid;
    setMessages([WELCOME]);
    setFollowUps([]);
    setProductLinks([]);
    setNeedsEscalation(false);
    setStreaming(false);
    setInput("");
    setHistoryLoaded(true); // không cần load lịch sử session mới
    // Xoá support state cũ khỏi localStorage (session mới = chat mới)
    localStorage.removeItem(`supp_${sessionId.current}`);
    setSupportStatus(null);
    setSupportRequestId(null);
  };

  // Gửi tin nhắn của khách đến admin trong phiên hỗ trợ đang mở
  const sendSupportUserMessage = async (text: string) => {
    if (!text.trim() || !supportRequestId) return;
    const trimmed = text.trim();
    // Always snap to bottom when user sends
    isAtBottomRef.current = true;
    setShowScrollBtn(false);
    setNewMsgCount(0);
    // Optimistic: hiện ngay trên UI
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, ts: Date.now() },
    ]);
    setInput("");
    try {
      await api.post(`/api/v1/support/${supportRequestId}/customer-message`, {
        message: trimmed,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Không thể gửi tin nhắn. Vui lòng thử lại.", ts: Date.now(), isError: true },
      ]);
    }
  };

  const handleEscalate = async () => {
    if (escalating || supportStatus) return;
    setEscalating(true);
    try {
      // Gửi email/name nếu Redux đã hydrate, BE sẽ tự lookup từ session nếu thiếu
      const res = await api.post<{ id: number; status: string }>("/api/v1/support/escalate", {
        sessionId: sessionId.current,
        customerEmail: currentUser?.email ?? null,
        customerName: currentUser?.name ?? null,
      });
      setSupportRequestId(res?.id ?? null);
      setSupportStatus("PENDING");
      setNeedsEscalation(false);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Yêu cầu hỗ trợ đã được gửi. Nhân viên sẽ phản hồi sớm nhất.", ts: Date.now() },
      ]);
    } catch (err: unknown) {
      const httpStatus = (err as { status?: number })?.status;
      if (httpStatus === 401) {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "Vui lòng đăng nhập để được kết nối với nhân viên hỗ trợ.", ts: Date.now(), isError: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "Không thể gửi yêu cầu. Vui lòng thử lại.", ts: Date.now(), isError: true },
        ]);
      }
    } finally {
      setEscalating(false);
    }
  };

  const isLastBotDone =
    !streaming &&
    messages[messages.length - 1]?.role === "assistant" &&
    !messages[messages.length - 1]?.streaming;

  const showQuickReplies = isLastBotDone && messages.length <= 2 && !supportStatus;

  return (
    <>
      {/* Mobile backdrop — tap để đóng bottom sheet */}
      {isMobile && open && (
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            zIndex: 1399,
          }}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={isMobile ? {
              // Mobile: bottom sheet full-width, trượt từ dưới lên
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1400,
            } : {
              // Desktop: widget cố định góc phải
              position: "fixed",
              bottom: 90,
              right: 24,
              zIndex: 1300,
              width: "min(400px, calc(100vw - 32px))",
            }}
          >
            <Paper
              elevation={12}
              sx={{
                // Mobile: bottom sheet chiều cao động, góc trên bo tròn
                height: isMobile ? "min(88vh, 620px)" : 540,
                display: "flex",
                flexDirection: "column",
                borderRadius: isMobile ? "16px 16px 0 0" : "18px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.07)",
                position: "relative",
              }}
            >
              {/* ── Header ── */}
              <Box
                sx={{
                  background: supportStatus === "IN_PROGRESS"
                    ? "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)"
                    : supportStatus === "PENDING"
                    ? "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
                    : supportStatus === "RESOLVED"
                    ? "linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)"
                    : "linear-gradient(135deg, #f25c05 0%, #e64a19 100%)",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {supportStatus ? (
                      <HeadsetMicIcon sx={{ color: "#fff", fontSize: 22 }} />
                    ) : (
                      <SmartToyIcon sx={{ color: "#fff", fontSize: 22 }} />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="#fff"
                      lineHeight={1.2}
                    >
                      {supportStatus === "IN_PROGRESS"
                        ? "Nhân viên hỗ trợ"
                        : supportStatus === "PENDING"
                        ? "Đang chờ nhân viên..."
                        : supportStatus === "RESOLVED"
                        ? "Phiên hỗ trợ đã đóng"
                        : "Trợ lý AI Máy 2 Thì"}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.2}>
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: supportStatus === "IN_PROGRESS"
                            ? "#69f0ae"
                            : supportStatus === "PENDING"
                            ? "#ffca28"
                            : supportStatus === "RESOLVED"
                            ? "#ce93d8"
                            : "#69f0ae",
                          boxShadow: supportStatus === "IN_PROGRESS"
                            ? "0 0 5px #69f0ae"
                            : "none",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.88)", fontSize: 11 }}
                      >
                        {supportStatus === "IN_PROGRESS"
                          ? "Đang kết nối với nhân viên"
                          : supportStatus === "PENDING"
                          ? "Đang chờ nhân viên tiếp nhận"
                          : supportStatus === "RESOLVED"
                          ? "Phiên hỗ trợ đã kết thúc"
                          : "Trực tuyến · Hỗ trợ 24/7"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  {/* Nút gặp nhân viên — chỉ hiện khi chưa trong support mode */}
                  {!supportStatus && (
                    <Tooltip title="Gặp nhân viên hỗ trợ">
                      <IconButton
                        size="small"
                        onClick={handleEscalate}
                        disabled={escalating}
                      >
                        <HeadsetMicIcon
                          sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Cuộc trò chuyện mới">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={streaming}
                    >
                      <DeleteOutlineIcon
                        sx={{ color: "rgba(255,255,255,0.85)", fontSize: 19 }}
                      />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </IconButton>
                </Stack>
              </Box>

              {/* ── Offline banner ── */}
              {aiOffline && (
                <Box
                  sx={{
                    bgcolor: "#fff3e0",
                    borderBottom: "1px solid #ffe0b2",
                    px: 2,
                    py: 0.75,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "#ff9800",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="#e65100"
                    fontWeight={500}
                  >
                    AI chưa kết nối được. Kiểm tra API key trong BE hoặc{" "}
                    <Box
                      component="a"
                      href="https://console.groq.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "#f25c05", fontWeight: 700 }}
                    >
                      lấy key miễn phí tại Groq
                    </Box>
                    .
                  </Typography>
                </Box>
              )}

              {/* ── Support status banners ── */}
              {supportStatus === "PENDING" && (
                <Box sx={{ bgcolor: "#e3f2fd", borderBottom: "1px solid #bbdefb", px: 2, py: 0.75, display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  <CircularProgress size={11} sx={{ color: "#1976d2" }} />
                  <Typography variant="caption" color="#1565c0" fontWeight={500}>
                    Đang chờ nhân viên hỗ trợ...
                  </Typography>
                </Box>
              )}
              {supportStatus === "IN_PROGRESS" && (
                <Box sx={{ bgcolor: "#e8f5e9", borderBottom: "1px solid #c8e6c9", px: 2, py: 0.75, display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#43a047", boxShadow: "0 0 5px #43a047", flexShrink: 0 }} />
                  <Typography variant="caption" color="#2e7d32" fontWeight={500}>
                    Đang kết nối với nhân viên hỗ trợ
                  </Typography>
                </Box>
              )}
              {supportStatus === "RESOLVED" && (
                <Box sx={{ bgcolor: "#f3e5f5", borderBottom: "1px solid #e1bee7", px: 2, py: 0.75, flexShrink: 0 }}>
                  <Typography variant="caption" color="#6a1b9a" fontWeight={500}>
                    Phiên hỗ trợ đã kết thúc. Cảm ơn bạn!
                  </Typography>
                </Box>
              )}

              {/* ── Messages ── */}
              <Box
                ref={scrollContainerRef}
                onScroll={handleMessagesScroll}
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  bgcolor: "#f7f8fc",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  position: "relative",
                  "&::-webkit-scrollbar": { width: 4 },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "#ddd",
                    borderRadius: 2,
                  },
                }}
              >
                {/* Loading history skeleton */}
                {loadingHistory && (
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {[80, 60, 90].map((w, i) => (
                      <Box
                        key={i}
                        sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}
                      >
                        <Skeleton variant="circular" width={28} height={28} />
                        <Skeleton
                          variant="rounded"
                          width={`${w}%`}
                          height={36}
                          sx={{ borderRadius: "4px 14px 14px 14px" }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}

                {!loadingHistory &&
                  messages.map((msg, idx) => {
                    // System messages: centered pill
                    if (msg.role === "system") {
                      return (
                        <Box key={idx} sx={{ display: "flex", justifyContent: "center", my: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: msg.isError ? "#ffebee" : "#eeeeee",
                              color: msg.isError ? "#c62828" : "#757575",
                              px: 1.5, py: 0.5,
                              borderRadius: 3,
                              fontSize: 11,
                              textAlign: "center",
                            }}
                          >
                            {msg.content}
                          </Typography>
                        </Box>
                      );
                    }

                    return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.role === "user" ? "flex-end" : "flex-start",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      {(msg.role === "assistant" || msg.role === "admin") && (
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: msg.role === "admin"
                              ? "linear-gradient(135deg,#1565c0,#1976d2)"
                              : "linear-gradient(135deg,#f25c05,#e64a19)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: msg.role === "admin"
                              ? "0 2px 6px rgba(25,118,210,0.3)"
                              : "0 2px 6px rgba(242,92,5,0.3)",
                          }}
                        >
                          {msg.role === "admin"
                            ? <HeadsetMicIcon sx={{ color: "#fff", fontSize: 16 }} />
                            : <SmartToyIcon sx={{ color: "#fff", fontSize: 16 }} />
                          }
                        </Box>
                      )}

                      <Box
                        sx={{
                          maxWidth: "78%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            msg.role === "user" ? "flex-end" : "flex-start",
                          gap: 0.3,
                        }}
                      >
                        {msg.role === "admin" && (
                          <Typography variant="caption" sx={{ color: "#1565c0", fontWeight: 600, fontSize: 10, px: 0.5 }}>
                            Nhân viên hỗ trợ
                          </Typography>
                        )}
                        <Box
                          sx={{
                            bgcolor: msg.role === "user" ? "#f25c05"
                              : msg.role === "admin" ? "#e3f2fd"
                              : "#fff",
                            color:
                              msg.role === "user"
                                ? "#fff"
                                : msg.role === "admin"
                                  ? "#0d47a1"
                                  : msg.isError
                                    ? "#c62828"
                                    : "#1a1a1a",
                            borderRadius:
                              msg.role === "user"
                                ? "18px 4px 18px 18px"
                                : "4px 18px 18px 18px",
                            px: 1.75,
                            py: 1,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                            fontSize: 13.5,
                            lineHeight: 1.65,
                            wordBreak: "break-word",
                            border: msg.isError ? "1px solid #ffcdd2"
                              : msg.role === "admin" ? "1px solid #bbdefb"
                              : "none",
                          }}
                        >
                          {msg.content ? (
                            msg.role === "assistant" ? (
                              renderMarkdown(msg.content, msg.streaming)
                            ) : (
                              msg.content
                            )
                          ) : msg.streaming ? (
                            // typing dots — chỉ hiện khi chưa có content
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                alignItems: "center",
                                py: 0.4,
                              }}
                            >
                              {[0, 1, 2].map((i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: "#f25c05",
                                    opacity: 0.6,
                                    animation: "dotPulse 1.2s infinite",
                                    animationDelay: `${i * 0.25}s`,
                                    "@keyframes dotPulse": {
                                      "0%,100%": {
                                        opacity: 0.3,
                                        transform: "scale(0.8)",
                                      },
                                      "50%": {
                                        opacity: 1,
                                        transform: "scale(1.2)",
                                      },
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          ) : null}
                        </Box>

                        {msg.ts > 0 && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#c0c0c0", fontSize: 10, px: 0.5 }}
                          >
                            {formatTime(msg.ts)}
                          </Typography>
                        )}
                      </Box>

                      {msg.role === "user" && (
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: "#455a64",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <PersonIcon sx={{ color: "#fff", fontSize: 16 }} />
                        </Box>
                      )}
                    </Box>
                    );
                  })}

                {/* ── Quick replies (chỉ hiện ở welcome) ── */}
                {!loadingHistory && showQuickReplies && (
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 0.5, mb: 0.75, display: "block" }}
                    >
                      Câu hỏi thường gặp:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {QUICK_REPLIES.map((q) => (
                        <Chip
                          key={q}
                          label={q}
                          size="small"
                          onClick={() => sendMessage(q)}
                          sx={{
                            fontSize: 11.5,
                            height: 26,
                            cursor: "pointer",
                            bgcolor: "#fff",
                            border: "1px solid #f25c05",
                            color: "#f25c05",
                            "&:hover": { bgcolor: "#fff3ee" },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* ── Product links ── */}
                {!loadingHistory &&
                  isLastBotDone &&
                  !supportStatus &&
                  productLinks.length > 0 && (
                    <Box sx={{ ml: 5, mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Sản phẩm liên quan:
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.75}>
                        {productLinks.map((p) => (
                          <Chip
                            key={p.slug}
                            component={Link}
                            href={`/product?name=${p.slug}`}
                            label={p.name}
                            size="small"
                            icon={
                              <OpenInNewIcon
                                sx={{ fontSize: "14px !important" }}
                              />
                            }
                            onClick={handleClose}
                            clickable
                            sx={{
                              fontSize: 11.5,
                              height: 26,
                              bgcolor: "#e8f5e9",
                              border: "1px solid #a5d6a7",
                              color: "#2e7d32",
                              textTransform: "capitalize",
                              "&:hover": { bgcolor: "#c8e6c9" },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                {/* ── Follow-up suggestions ── */}
                {!loadingHistory && isLastBotDone && !supportStatus && followUps.length > 0 && (
                  <Box sx={{ ml: 5, mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Bạn có thể hỏi thêm:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {followUps.map((q) => (
                        <Chip
                          key={q}
                          label={q}
                          size="small"
                          onClick={() => sendMessage(q)}
                          sx={{
                            fontSize: 11.5,
                            height: 26,
                            cursor: "pointer",
                            bgcolor: "#fff",
                            border: "1px solid #bdbdbd",
                            color: "#555",
                            "&:hover": {
                              bgcolor: "#f5f5f5",
                              borderColor: "#f25c05",
                              color: "#f25c05",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* ── Escalation / support card ── */}
                {!loadingHistory && isLastBotDone && !supportStatus && messages.length > 1 && (
                  <Box
                    sx={{
                      ml: 5,
                      mt: 0.5,
                      p: needsEscalation ? 1.5 : 1,
                      bgcolor: needsEscalation ? "#fff8f0" : "#f5f5f5",
                      border: needsEscalation ? "1px solid #ffe0b2" : "1px solid #e0e0e0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <HeadsetMicIcon
                      sx={{
                        color: needsEscalation ? "#f25c05" : "#757575",
                        fontSize: needsEscalation ? 22 : 18,
                        flexShrink: 0,
                      }}
                    />
                    <Box flex={1}>
                      {needsEscalation ? (
                        <>
                          <Typography variant="caption" fontWeight={600} color="#e65100" display="block">
                            Cần hỗ trợ trực tiếp?
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Nhân viên sẵn sàng hỗ trợ bạn ngay
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Muốn nói chuyện với nhân viên?
                        </Typography>
                      )}
                    </Box>
                    <Button
                      size="small"
                      variant={needsEscalation ? "contained" : "outlined"}
                      onClick={handleEscalate}
                      disabled={escalating}
                      sx={{
                        bgcolor: needsEscalation ? "#f25c05" : "transparent",
                        borderColor: "#f25c05",
                        color: needsEscalation ? "#fff" : "#f25c05",
                        "&:hover": {
                          bgcolor: needsEscalation ? "#e64a19" : "#fff8f0",
                          borderColor: "#e64a19",
                        },
                        "&.Mui-disabled": { bgcolor: "#e0e0e0", border: "none" },
                        fontSize: 11,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {escalating ? <CircularProgress size={12} sx={{ color: "inherit" }} /> : "Gặp nhân viên"}
                    </Button>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* ── Scroll-to-bottom button (overlays messages area, above input) ── */}
              {showScrollBtn && (
                <Box
                  onClick={() => scrollToBottom("smooth")}
                  sx={{
                    position: "absolute",
                    bottom: 68,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    cursor: "pointer",
                    bgcolor: "#f25c05",
                    color: "#fff",
                    borderRadius: "20px",
                    px: 1.5,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    boxShadow: "0 3px 10px rgba(242,92,5,0.35)",
                    fontSize: 12,
                    fontWeight: 600,
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#e64a19" },
                    transition: "background 0.15s",
                  }}
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                  {newMsgCount > 0 ? `${newMsgCount} tin nhắn mới` : "Tin nhắn mới nhất"}
                </Box>
              )}

              <Divider />

              {/* ── Queue indicator ── */}
              {queueCount > 0 && (
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: "#fff8f0",
                    borderBottom: "1px solid #ffe0b2",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    flexShrink: 0,
                  }}
                >
                  <CircularProgress size={11} sx={{ color: "#f25c05" }} />
                  <Typography
                    variant="caption"
                    color="#e65100"
                    fontWeight={500}
                  >
                    {queueCount} câu hỏi đang chờ — sẽ tự động gửi tiếp theo
                  </Typography>
                </Box>
              )}

              {/* ── Input ── */}
              {supportStatus === "RESOLVED" ? (
                <Box sx={{ px: 2, py: 1.25, textAlign: "center", flexShrink: 0, bgcolor: "#fff" }}>
                  <Typography variant="caption" color="text.secondary">
                    Phiên hỗ trợ đã kết thúc · Bắt đầu cuộc trò chuyện mới nếu cần thêm hỗ trợ
                  </Typography>
                </Box>
              ) : (
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <TextField
                  inputRef={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS") {
                        sendSupportUserMessage(input);
                      } else {
                        sendMessage();
                      }
                    }
                  }}
                  placeholder={
                    supportStatus === "PENDING"
                      ? "Nhắn tin trước cho nhân viên... (Enter để gửi)"
                      : supportStatus === "IN_PROGRESS"
                      ? "Nhắn tin với nhân viên... (Enter để gửi)"
                      : "Nhập câu hỏi... (Enter để gửi)"
                  }
                  multiline
                  maxRows={3}
                  fullWidth
                  size="small"
                  variant="outlined"
                  disabled={
                    (!supportStatus && streaming && !messages[messages.length - 1]?.isError) ||
                    loadingHistory
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontSize: 13.5,
                      bgcolor: "#f7f8fc",
                      "& fieldset": {
                        borderColor: (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS")
                          ? "#bbdefb" : "#e8eaf0",
                      },
                      "&:hover fieldset": {
                        borderColor: (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS")
                          ? "#1976d2" : "#f25c05",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS")
                          ? "#1976d2" : "#f25c05",
                      },
                    },
                  }}
                />

                {!supportStatus && streaming && !messages[messages.length - 1]?.isError ? (
                  <Tooltip title="Dừng">
                    <IconButton
                      onClick={handleStop}
                      sx={{
                        bgcolor: "#f44336",
                        color: "#fff",
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        "&:hover": { bgcolor: "#d32f2f" },
                      }}
                    >
                      <StopIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton
                    onClick={() => {
                      if (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS") {
                        sendSupportUserMessage(input);
                      } else {
                        sendMessage();
                      }
                    }}
                    disabled={!input.trim() || loadingHistory}
                    sx={{
                      bgcolor: (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS")
                        ? "#1976d2" : "#f25c05",
                      color: "#fff",
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                      "&:hover": {
                        bgcolor: (supportStatus === "PENDING" || supportStatus === "IN_PROGRESS")
                          ? "#1565c0" : "#e64a19",
                      },
                      "&.Mui-disabled": { bgcolor: "#f0f0f0" },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                )}
              </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <Box
        component={motion.div}
        onClick={() => (open ? handleClose() : setOpen(true))}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        sx={{
          position: "fixed",
          // Mobile: ngay trên bottom nav; desktop: vị trí cũ
          bottom: isMobile
            ? "calc(56px + env(safe-area-inset-bottom, 0px) + 16px)"
            : 24,
          right: isMobile ? 16 : 24,
          width: isMobile ? 52 : 56,
          height: isMobile ? 52 : 56,
          borderRadius: "50%",
          bgcolor: open ? "#455a64" : "#f25c05",
          // Mobile: ẩn FAB khi sheet đang mở (dùng nút X trong header)
          display: isMobile && open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: open
            ? "0 4px 14px rgba(0,0,0,0.25)"
            : "0 4px 18px rgba(242,92,5,0.45)",
          transition: "background-color 0.25s, box-shadow 0.25s",
          zIndex: 1301,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <CloseIcon sx={{ color: "#fff", fontSize: 24 }} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <SmartToyIcon sx={{ color: "#fff", fontSize: 26 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "#f44336",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {unread > 9 ? "9+" : unread}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
