"use client";

import Image from "next/image";
import { Box, Zoom, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";

const FloatingContactButtons = ({ hidden = false }: { hidden?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const size = isMobile ? 42 : isTablet ? 48 : 56;

  const buttons = useMemo(
    () => [
      {
        href: "https://www.facebook.com/messages/e2ee/t/9200105130025225",
        title: "Chat Facebook",
        src: "/images/icons/messenger1.png",
        alt: "Messenger",
        animation: false,
      },
      {
        href: "https://zalo.me/0367164126",
        title: "Chat Zalo",
        src: "/images/icons/Logo-Zalo-Arc.webp",
        alt: "Zalo",
        animation: false,
      },
      {
        href: "tel:0367164126",
        title: "Gọi điện thoại",
        src: "/images/icons/phone-call.png",
        alt: "Gọi ngay",
        animation: true,
      },
    ],
    [],
  );

  return (
    <Zoom in>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 76 : 40,
          left: isMobile ? 12 : 32,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 1.2 : 2,
          zIndex: 9999,
          opacity: hidden ? 0 : 1,
          transform: hidden ? "scale(0.85) translateY(8px)" : "scale(1) translateY(0)",
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {buttons.map((item, index) => (
          <Tooltip title={item.title} placement="right" key={index}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.alt}
            >
              <Box
                sx={{
                  position: "relative",
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  animation: `fadeInUp 0.2s ease ${index * 0.2}s both, ${
                    item.animation
                      ? "bellShake 1s infinite ease-in-out"
                      : "none"
                  }`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.12)",
                    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.2)",
                    animation: "none",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(38, 132, 255, 0.15)",
                    animation: "pulseRing 2.5s infinite ease-out",
                    zIndex: 0,
                  },
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={`${size}px`}
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </a>
          </Tooltip>
        ))}

        <style jsx global>{`
          @keyframes pulseRing {
            0% {
              transform: scale(1);
              opacity: 0.4;
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
              transform: rotate(0deg);
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
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Box>
    </Zoom>
  );
};

export default FloatingContactButtons;
