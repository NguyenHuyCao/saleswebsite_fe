"use client";

import { useEffect } from "react";

const ScrollPositionManager = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null; // Không render gì ra DOM
};

export default ScrollPositionManager;
