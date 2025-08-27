"use client";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api/http";

export default function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || typeof window === "undefined") return;
    sent.current = true;

    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/page_view`;
    const body = JSON.stringify({ pageUrl: window.location.href });

    // 1) sendBeacon nếu có
    const ok = navigator.sendBeacon?.(
      endpoint,
      new Blob([body], { type: "application/json" })
    );
    if (ok) return;

    // 2) Fallback: requestIdleCallback -> api.post
    const send = async () => {
      try {
        await api.post<void, { pageUrl: string }>("/api/v1/page_view", {
          pageUrl: window.location.href,
        });
      } catch {
        // nuốt lỗi, không chặn UI
      }
    };
    (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(send)
      : setTimeout(send, 0);
  }, []);

  return null;
}
