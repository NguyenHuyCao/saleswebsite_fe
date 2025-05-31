"use client";

import Image from "next/image";
import { Box, Zoom, Tooltip } from "@mui/material";

const FloatingContactButtons = () => {
  return (
    <Zoom in={true}>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  cursor: "pointer",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(38, 132, 255, 0.4)",
                    animation: "pulseRing 2s infinite",
                    zIndex: 0,
                  },
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={50}
                  height={50}
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
        `}</style>
      </Box>
    </Zoom>
  );
};

export default FloatingContactButtons;
