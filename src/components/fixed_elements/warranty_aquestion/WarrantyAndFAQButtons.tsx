"use client";

import {
  Box,
  Fab,
  Tooltip,
  Zoom,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import QuizIcon from "@mui/icons-material/Quiz";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WarrantyAndFAQButtons = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buttons = [
    {
      title: "Lên đầu trang",
      icon: <KeyboardArrowUpIcon />,
      color: "#ffb700",
      hover: "#e6a500",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      showOnlyOnScroll: true,
    },
    {
      title: "Câu hỏi thường gặp",
      icon: <QuizIcon />,
      color: "#9c27b0",
      hover: "#6d1b7b",
      route: "/question",
    },
    {
      title: "Chế độ bảo hành",
      icon: <GppGoodIcon />,
      color: "#1976d2",
      hover: "#115293",
      route: "/warranty",
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 75 : 32,
          right: isMobile ? 8 : 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 1 : 1.2,
          zIndex: 9998,
          animation: "fadeInUp 1s ease-in-out",
        }}
      >
        {buttons.map((btn, index) => {
          const content = (
            <Tooltip title={btn.title} placement="left" key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: isMobile ? 48 : 56,
                  height: isMobile ? 48 : 56,
                }}
              >
                {btn.showOnlyOnScroll ? null : (
                  <Box
                    sx={{
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.15)",
                      animation: isMobile ? "none" : "pulseRing 2s infinite",
                      zIndex: 0,
                    }}
                  />
                )}
                <Fab
                  onClick={() =>
                    btn.onClick ? btn.onClick() : router.push(btn.route)
                  }
                  size="medium"
                  sx={{
                    bgcolor: btn.color,
                    color: "#fff",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0px 8px 16px rgba(0,0,0,0.3)",
                    transition: "transform 0.3s ease",
                    animation:
                      btn.showOnlyOnScroll || isMobile
                        ? "none"
                        : "bellShake 1.2s infinite ease-in-out",
                    "&:hover": {
                      bgcolor: btn.hover,
                    },
                  }}
                >
                  {btn.icon}
                </Fab>
              </Box>
            </Tooltip>
          );

          return btn.showOnlyOnScroll ? (
            <Zoom in={visible} key={index}>
              <Box>{content}</Box>
            </Zoom>
          ) : (
            content
          );
        })}
      </Box>

      <style jsx global>{`
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          70% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes bellShake {
          0% {
            transform: rotate(0);
          }
          10% {
            transform: rotate(-18deg);
          }
          20% {
            transform: rotate(18deg);
          }
          30% {
            transform: rotate(-15deg);
          }
          40% {
            transform: rotate(15deg);
          }
          50% {
            transform: rotate(-15deg);
          }
          60% {
            transform: rotate(15deg);
          }
          70% {
            transform: rotate(-10deg);
          }
          80% {
            transform: rotate(10deg);
          }
          90% {
            transform: rotate(-5deg);
          }
          100% {
            transform: rotate(0);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default WarrantyAndFAQButtons;
