"use client";
import { useEffect, useRef } from "react";

const PageViewTracker = () => {
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;

    const sendPageView = async () => {
      const currentUrl = window.location.href;
      await fetch("http://localhost:8080/api/v1/page_view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageUrl: currentUrl }),
      });
    };

    sendPageView();
  }, []);

  return null;
};

export default PageViewTracker;
