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

interface SocketContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  connected: boolean;
  refresh: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  connected: false,
  refresh: () => {},
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
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Socket] Connected ✓ id=", socket.id);
        setConnected(true);
        // Fetch lại sau khi socket connect để đảm bảo đồng bộ
        refresh();
      });
      socket.on("connect_error", (err: any) => {
        console.error("[Socket] Connection error:", err?.message ?? err);
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
      value={{ notifications, unreadCount, markRead, markAllRead, connected, refresh }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
