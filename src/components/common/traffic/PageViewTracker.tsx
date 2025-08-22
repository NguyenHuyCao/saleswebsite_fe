"use client";
import { useEffect, useRef } from "react";

const PageViewTracker = () => {
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current || typeof window === "undefined") return;
    hasSent.current = true;

    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/page_view`;
    const payload = JSON.stringify({ pageUrl: window.location.href });

    // Ưu tiên sendBeacon
    const ok = navigator.sendBeacon?.(
      endpoint,
      new Blob([payload], { type: "application/json" })
    );
    if (ok) return;

    // Fallback: requestIdleCallback hoặc setTimeout
    const send = () =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {});
    (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(send)
      : setTimeout(send, 0);
  }, []);

  return null;
};

export default PageViewTracker;
