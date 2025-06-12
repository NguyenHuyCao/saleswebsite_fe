"use client";

import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const WebsiteTrafficTracker = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const track = async () => {
      try {
        // 1. Load FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        // 2. Lấy IP
        const ip = await fetch("https://api.ipify.org?format=json")
          .then((res) => res.json())
          .then((data) => data.ip)
          .catch(() => null);

        // 3. Lấy userId từ localStorage
        const userRaw = localStorage.getItem("user");
        const userId = userRaw ? JSON.parse(userRaw)?.id : null;

        // 4. Gửi dữ liệu
        await fetch("http://localhost:8080/api/v1/website_traffic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: visitorId,
            ipAddress: ip,
            userId,
          }),
        });

        console.debug("Website traffic tracked:", { visitorId, userId, ip });
      } catch (err) {
        console.warn("Không thể gửi dữ liệu traffic:", err);
      }
    };

    // Thực hiện khi trình duyệt rảnh
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(track);
    } else {
      setTimeout(track, 300); // fallback
    }
  }, []);

  return null;
};

export default WebsiteTrafficTracker;
