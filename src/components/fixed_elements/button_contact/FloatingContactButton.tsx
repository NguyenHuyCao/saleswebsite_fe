"use client";

import Image from "next/image";
import { Box, Zoom, Tooltip, useMediaQuery, useTheme } from "@mui/material";

const FloatingContactButtons = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Zoom in={true}>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 80 : 40,
          left: isMobile ? 12 : 32,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 1.5 : 2,
          zIndex: 9999,
        }}
      >
        {[
          {
            href: "https://www.facebook.com/trai.xomdum/",
            title: "Chat Facebook",
            src: "/images/icons/messenger.png",
            alt: "Messenger",
          },
          {
            href: "https://zalo.me/0367164126",
            title: "Chat Zalo",
            src: "/images/icons/zalo.png",
            alt: "Zalo",
          },
          {
            href: "tel:0367164126",
            title: "Gọi điện thoại",
            src: "/images/icons/phone-call.png",
            alt: "Gọi ngay",
          },
        ].map((item, index) => (
          <Tooltip title={item.title} placement="right" key={index}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <Box
                sx={{
                  position: "relative",
                  width: isMobile ? 42 : 50,
                  height: isMobile ? 42 : 50,
                  borderRadius: "50%",
                  cursor: "pointer",
                  animation: isMobile ? "none" : "bellShake 1.5s infinite",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(38, 132, 255, 0.3)",
                    animation: isMobile ? "none" : "pulseRing 2s infinite",
                    zIndex: 0,
                  },
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={isMobile ? 42 : 50}
                  height={isMobile ? 42 : 50}
                  style={{
                    borderRadius: "50%",
                    position: "relative",
                    zIndex: 1,
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
              transform: rotate(0deg);
            }
            15% {
              transform: rotate(25deg);
            }
            30% {
              transform: rotate(-20deg);
            }
            45% {
              transform: rotate(15deg);
            }
            60% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(5deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
        `}</style>
      </Box>
    </Zoom>
  );
};

export default FloatingContactButtons;
