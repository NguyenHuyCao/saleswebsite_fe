"use client";

import {
  Box,
  Fab,
  Tooltip,
  Zoom,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

// Định nghĩa kiểu chuẩn cho mỗi button
type ButtonItem = {
  title: string;
  src?: string;
  color: string;
  hover: string;
  route?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  showOnlyOnScroll?: boolean;
};

const WarrantyAndFAQButtons = ({ hidden = false }: { hidden?: boolean }) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const size = isMobile ? 43 : isTablet ? 46 : 52;
  const iconSize = isMobile ? 24 : 30;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setVisible(scrollTop > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buttons: ButtonItem[] = useMemo(() => {
    const baseButtons: ButtonItem[] = [
      {
        title: "Câu hỏi thường gặp",
        src: "https://img.icons8.com/ios-filled/50/ffffff/help--v1.png",
        color: "#9c27b0",
        hover: "#6d1b7b",
        route: "/question",
      },
      {
        title: "Chế độ bảo hành",
        src: "https://img.icons8.com/ios-filled/50/ffffff/verified-account.png",
        color: "#1976d2",
        hover: "#115293",
        route: "/warranty",
      },
    ];

    if (!isMobile) {
      baseButtons.unshift({
        title: "Lên đầu trang",
        icon: <KeyboardArrowUpIcon />,
        color: "#ffb700",
        hover: "#e6a500",
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        showOnlyOnScroll: true,
      });
    }

    return baseButtons;
  }, [isMobile]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 76 : 90,
          right: isMobile ? 10 : 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 1.5 : 1.2,
          zIndex: 9999,
          animation: "fadeInUp 0.8s ease-in-out",
          opacity: hidden ? 0 : 1,
          transform: hidden ? "scale(0.85) translateY(8px)" : "scale(1) translateY(0)",
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {buttons.map((btn, index) => {
          const content = (
            <Tooltip title={btn.title} placement="left" key={index}>
              <Box sx={{ position: "relative", width: size, height: size }}>
                {!btn.showOnlyOnScroll && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      animation: "pulseRing 2.4s infinite",
                      animationDelay: `${index * 0.3}s`,
                      zIndex: 0,
                    }}
                  />
                )}
                <Fab
                  onClick={() =>
                    btn.onClick ? btn.onClick() : router.push(btn.route!)
                  }
                  size="medium"
                  sx={{
                    bgcolor: btn.color,
                    color: "#fff",
                    position: "relative",
                    zIndex: 1,
                    width: size,
                    height: size,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: btn.showOnlyOnScroll
                      ? "none"
                      : `bellShake 2.2s infinite ease-in-out`,
                    animationDelay: `${index * 0.3}s`,
                    "&:hover": {
                      bgcolor: btn.hover,
                      transform: "scale(1.1)",
                      animation: "none",
                    },
                  }}
                >
                  {btn.icon ? (
                    btn.icon
                  ) : (
                    <Image
                      src={btn.src!}
                      alt={btn.title}
                      width={iconSize}
                      height={iconSize}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </Fab>
              </Box>
            </Tooltip>
          );

          return btn.showOnlyOnScroll ? (
            <Zoom in={visible} key={index}>
              <Box>{content}</Box>
            </Zoom>
          ) : (
            <Box key={index}>{content}</Box>
          );
        })}
      </Box>

      <style jsx global>{`
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.5;
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
          0%,
          100% {
            transform: rotate(0);
          }
          15% {
            transform: rotate(10deg);
          }
          30% {
            transform: rotate(-8deg);
          }
          45% {
            transform: rotate(6deg);
          }
          60% {
            transform: rotate(-4deg);
          }
          75% {
            transform: rotate(2deg);
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
