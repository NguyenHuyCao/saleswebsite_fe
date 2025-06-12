"use client";

import { useEffect, useRef } from "react";

const PageViewTracker = () => {
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;

    const sendPageView = async () => {
      if (typeof window === "undefined") return;

      try {
        const pageUrl = window.location.href;

        // Gửi khi idle để tránh blocking main thread
        window.requestIdleCallback?.(() => {
          fetch("http://localhost:8080/api/v1/page_view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pageUrl }),
          })
            .then((res) => {
              if (!res.ok) {
                console.warn("Page view tracking failed:", res.status);
              } else {
                console.debug("Page view tracked:", pageUrl);
              }
            })
            .catch((err) => {
              console.error("Tracking error:", err);
            });
        });
      } catch (err) {
        console.error("Unexpected error in PageViewTracker:", err);
      }
    };

    sendPageView();
  }, []);

  return null;
};

export default PageViewTracker;
