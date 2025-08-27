"use client";

import { useCallback } from "react";
import { useTrackCta } from "../queries";

export function useCtaTracking() {
  const { mutate } = useTrackCta();

  return useCallback(
    (name: string) => {
      if (typeof window === "undefined") return;

      const payload = { name, pageUrl: window.location.href, ts: Date.now() };
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cta_click`;

      // 1) Thử sendBeacon (ổn định khi chuyển trang)
      const ok =
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon(
          endpoint,
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );

      // 2) Fallback qua axios instance chuẩn (để đồng bộ http.ts)
      if (!ok) mutate(payload);
    },
    [mutate]
  );
}
