"use client";

import { useEffect } from "react";

const FreezeScrollOnReload = () => {
  useEffect(() => {
    // Tắt hành vi tự động của trình duyệt
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem("scroll-position");
    const html = document.documentElement;
    const body = document.body;

    // Nếu có scroll được lưu, đặt ngay scrollTop và ngăn layout shift
    if (saved) {
      const { x, y } = JSON.parse(saved);
      html.style.scrollBehavior = "auto"; // tắt animation scroll
      body.style.overflow = "hidden"; // ngăn nhảy
      html.style.overflow = "hidden";

      window.scrollTo(x, y);

      // Khi DOM render xong, khôi phục scroll và overflow
      requestAnimationFrame(() => {
        html.style.scrollBehavior = "";
        body.style.overflow = "";
        html.style.overflow = "";
      });
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

export default FreezeScrollOnReload;
