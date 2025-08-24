"use client";
import { useCallback } from "react";

export function useCtaTracking() {
  return useCallback((name: string) => {
    if (typeof window === "undefined") return;
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cta_click`;
    const body = JSON.stringify({
      name,
      pageUrl: window.location.href,
      ts: Date.now(),
    });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(endpoint, blob)) return;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  }, []);
}
