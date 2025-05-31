"use client";

import { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    console.log("Clicked scroll to top");

    const scrollElement =
      document.scrollingElement || document.documentElement || document.body;

    scrollElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={visible}>
      <Fab
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          bgcolor: "#ffb700",
          color: "#fff",
          "&:hover": {
            bgcolor: "#e6a500",
          },
          zIndex: 9999,
        }}
        size="medium"
        aria-label="scroll back to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
