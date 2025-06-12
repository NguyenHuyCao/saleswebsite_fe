"use client";
import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const WebsiteTrafficTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // 1. Lấy visitorId (FingerprintJS)
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        // 2. Lấy địa chỉ IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ipAddress = ipData.ip;

        // 3. Lấy userId từ localStorage (từ key "user")
        const userRaw = localStorage.getItem("user");
        const userId = userRaw ? JSON.parse(userRaw).id : null;

        // 4. Gửi dữ liệu lên backend
        await fetch("http://localhost:8080/api/v1/website_traffic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: visitorId,
            userId: userId,
            ipAddress: ipAddress,
          }),
        });
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu tracking:", error);
      }
    };

    trackVisitor();
  }, []);

  return null;
};

export default WebsiteTrafficTracker;
