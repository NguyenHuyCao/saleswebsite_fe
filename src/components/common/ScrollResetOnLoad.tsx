"use client";

import { useEffect } from "react";

const ScrollPositionManager = () => {
  useEffect(() => {
    // Tắt phục hồi mặc định của trình duyệt
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const savedScroll = sessionStorage.getItem("scroll-position");
    if (savedScroll) {
      const { x, y } = JSON.parse(savedScroll);
      setTimeout(() => {
        window.scrollTo(x, y);
      }, 0); // delay nhỏ để đợi render xong
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(
        "scroll-position",
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default ScrollPositionManager;
