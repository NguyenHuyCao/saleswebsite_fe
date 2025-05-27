"use client";

import { Fab, Zoom, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: typeof window !== "undefined" ? window.innerHeight : 300,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
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
