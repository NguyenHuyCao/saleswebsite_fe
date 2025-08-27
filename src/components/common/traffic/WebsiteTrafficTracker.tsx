"use client";
import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "@/lib/api/http";

export default function WebsiteTrafficTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const run = async () => {
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();

        // IP: không bắt buộc – có thể fail
        const ip = await fetch("https://api.ipify.org?format=json")
          .then((r) => r.json())
          .then((d) => d?.ip)
          .catch(() => null);

        const userId = (() => {
          try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw)?.id ?? null : null;
          } catch {
            return null;
          }
        })();

        const payload = { requestId: visitorId, ipAddress: ip, userId };

        // Ưu tiên beacon
        const beaconOk = navigator.sendBeacon?.(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/website_traffic`,
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );

        if (!beaconOk) {
          await api.post<void, typeof payload>(
            "/api/v1/website_traffic",
            payload
          );
        }
      } catch {
        // bỏ qua
      }
    };

    "requestIdleCallback" in window
      ? (window as any).requestIdleCallback(run)
      : setTimeout(run, 300);
  }, []);

  return null;
}
