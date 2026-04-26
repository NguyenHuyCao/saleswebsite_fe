"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
// socket.io-client v2 — compatible with netty-socketio (Socket.IO protocol v2)
import io from "socket.io-client";
import { getAccessToken } from "@/lib/api/token";
import { api } from "@/lib/api/http";

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
  metadataJson?: string;
}

export interface SupportSocketMessage {
  role: string;
  content: string;
  requestId?: number;
  sessionId?: string;
  ts: number;
}

/** Payload of the `support:resolved` socket event sent by BE when admin closes a session */
export interface SupportResolvedEvent {
  requestId: number;
  ts: number;
}

interface SocketContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  connected: boolean;
  refresh: () => void;
  /** Real-time support messages delivered directly via socket (not via notification system) */
  supportSocketMsgs: SupportSocketMessage[];
  /** Direct socket events for session closure (faster than SUPPORT_RESOLVED notification) */
  supportResolvedEvents: SupportResolvedEvent[];
  /** Count of unread customer→admin messages received via direct socket (role="user") */
  unreadSupportMsgCount: number;
  /** Call when admin opens the support drawer to reset the unread badge */
  clearSupportUnread: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  connected: false,
  refresh: () => {},
  supportSocketMsgs: [],
  supportResolvedEvents: [],
  unreadSupportMsgCount: 0,
  clearSupportUnread: () => {},
});

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9092";

/** Lấy danh sách unread qua HTTP REST (source of truth) */
async function fetchUnread(): Promise<NotificationItem[]> {
  if (!getAccessToken()) return [];
  try {
    return await api.get<NotificationItem[]>("/api/v1/notifications/unread");
  } catch {
    return [];
  }
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [supportSocketMsgs, setSupportSocketMsgs] = useState<SupportSocketMessage[]>([]);
  const [supportResolvedEvents, setSupportResolvedEvents] = useState<SupportResolvedEvent[]>([]);
  const [unreadSupportMsgCount, setUnreadSupportMsgCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any>(null);

  /** Fetch via HTTP và cập nhật state */
  const refresh = useCallback(async () => {
    const items = await fetchUnread();
    setNotifications(items);
  }, []);

  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (socketRef.current?.connected) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let socket: any = null;

    function connect() {
      if (socket?.connected || socketRef.current?.connected) return;
      const token = getAccessToken();
      if (!token) return;

      // Fetch ngay qua HTTP để hiện thị nhanh (không chờ socket)
      refresh();

      socket = io(SOCKET_URL, {
        path: "/ws",
        transports: ["websocket", "polling"],
        query: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 10000,
        timeout: 10000,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Socket] Connected ✓ id=", socket.id);
        setConnected(true);
        // Fetch lại sau khi socket connect để đảm bảo đồng bộ
        refresh();
      });
      socket.on("connect_error", (err: any) => {
        // Log ở warn thay vì error để không làm đỏ console; chỉ log message ngắn
        console.warn("[Socket] Connection unavailable:", err?.message ?? "websocket error");
      });
      socket.on("reconnect_failed", () => {
        console.warn("[Socket] Gave up reconnecting after max attempts.");
      });
      socket.on("disconnect", (reason: any) => {
        console.warn("[Socket] Disconnected:", reason);
        setConnected(false);
      });

      // Bootstrap từ socket vẫn giữ như fallback
      socket.on("notification:bootstrap", (items: NotificationItem[]) => {
        console.log("[Socket] Bootstrap notifications:", Array.isArray(items) ? items.length : items);
        if (Array.isArray(items) && items.length > 0) {
          setNotifications(items);
        }
      });

      // Real-time push: thêm notification mới vào đầu danh sách
      socket.on("notification", (item: NotificationItem) => {
        console.log("[Socket] New notification:", item?.title);
        if (item && item.id) {
          setNotifications((prev) => {
            // Tránh duplicate nếu đã có
            if (prev.some((n) => n.id === item.id)) return prev;
            return [item, ...prev];
          });
        }
      });

      // Direct real-time support messages (bypasses notification system for instant delivery)
      // role="admin" → delivered to customer widget; role="user" → delivered to admin panel
      socket.on("support:message", (msg: SupportSocketMessage) => {
        if (msg && msg.role) {
          setSupportSocketMsgs((prev) => [...prev, { ...msg, ts: msg.ts || Date.now() }]);
          if (msg.role === "user") {
            setUnreadSupportMsgCount((c) => c + 1);
          }
        }
      });

      // Direct session-closure event — faster than SUPPORT_RESOLVED notification
      socket.on("support:resolved", (evt: SupportResolvedEvent) => {
        console.log("[Socket] support:resolved requestId=", evt?.requestId);
        if (evt && evt.requestId) {
          setSupportResolvedEvents((prev) => [
            ...prev,
            { requestId: evt.requestId, ts: evt.ts || Date.now() },
          ]);
        }
      });
    }

    function disconnect() {
      socket?.disconnect();
      socket = null;
      socketRef.current = null;
      setConnected(false);
      setNotifications([]);
    }

    connect();

    window.addEventListener("login", connect);
    window.addEventListener("logout", disconnect);

    return () => {
      window.removeEventListener("login", connect);
      window.removeEventListener("logout", disconnect);
      disconnect();
    };
  }, [refresh]);

  // Clear real-time support state when disconnected
  useEffect(() => {
    if (!connected) {
      setSupportSocketMsgs([]);
      setSupportResolvedEvents([]);
    }
  }, [connected]);

  const clearSupportUnread = useCallback(() => setUnreadSupportMsgCount(0), []);

  const markRead = (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Gửi qua socket nếu connected, fallback HTTP
    if (socketRef.current?.connected) {
      socketRef.current.emit("notifications:mark_read", { id });
    } else {
      api.post(`/api/v1/notifications/${id}/read`).catch(() => {});
    }
  };

  const markAllRead = () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (socketRef.current?.connected) {
      socketRef.current.emit("notifications:mark_all");
    } else {
      api.post("/api/v1/notifications/read-all").catch(() => {});
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        connected,
        refresh,
        supportSocketMsgs,
        supportResolvedEvents,
        unreadSupportMsgCount,
        clearSupportUnread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
