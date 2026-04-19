"use client";

import Image from "next/image";
import {
  Box,
  Zoom,
  Tooltip,
  Backdrop,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useMemo, useState } from "react";

// ─── actions cho mobile SpeedDial ────────────────────────────────────────────
// Thứ tự trong mảng: bottom→top khi direction="up"
// (phần tử đầu = gần FAB nhất → ở dưới cùng của stack)
const MOBILE_ACTIONS = [
  {
    key: "messenger",
    label: "Chat Facebook",
    href: "https://www.facebook.com/messages/e2ee/t/9200105130025225",
    external: true,
    color: "#1877f2",
    hover: "#1558c0",
    icon: (
      <Box sx={{ position: "relative", width: 26, height: 26 }}>
        <Image
          src="/images/icons/messenger1.png"
          alt="Messenger"
          fill
          style={{ objectFit: "contain", borderRadius: "50%" }}
        />
      </Box>
    ),
  },
  {
    key: "zalo",
    label: "Chat Zalo",
    href: "https://zalo.me/0392923392",
    external: true,
    color: "#0068ff",
    hover: "#0050cc",
    icon: (
      <Box sx={{ position: "relative", width: 26, height: 26 }}>
        <Image
          src="/images/icons/Logo-Zalo-Arc.webp"
          alt="Zalo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Box>
    ),
  },
  {
    key: "phone",
    label: "Gọi ngay",
    href: "tel:0392923392",
    external: false,
    color: "#4caf50",
    hover: "#388e3c",
    icon: <LocalPhoneIcon sx={{ fontSize: 22 }} />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const FloatingContactButtons = ({ hidden = false }: { hidden?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [open, setOpen] = useState(false);

  const desktopSize = isTablet ? 48 : 56;

  const desktopButtons = useMemo(
    () => [
      {
        href: "https://www.facebook.com/messages/e2ee/t/9200105130025225",
        title: "Chat Facebook",
        src: "/images/icons/messenger1.png",
        alt: "Messenger",
        animation: false,
      },
      {
        href: "https://zalo.me/0392923392",
        title: "Chat Zalo",
        src: "/images/icons/Logo-Zalo-Arc.webp",
        alt: "Zalo",
        animation: false,
      },
      {
        href: "tel:0392923392",
        title: "Gọi điện thoại",
        src: "/images/icons/phone-call.png",
        alt: "Gọi ngay",
        animation: true,
      },
    ],
    [],
  );

  // ── MOBILE: SpeedDial ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Backdrop mờ nhẹ khi mở */}
        <Backdrop
          open={open}
          onClick={() => setOpen(false)}
          sx={{ zIndex: 9997, bgcolor: "rgba(0,0,0,0.22)" }}
        />

        <SpeedDial
          ariaLabel="Liên hệ nhanh"
          direction="up"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          icon={<HeadsetMicIcon sx={{ fontSize: 26 }} />}
          sx={{
            position: "fixed",
            // Ngay trên AiChat FAB: 56px nav + 16px gap + 52px AiChat FAB + 12px gap
            bottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 80px)",
            right: 16,
            zIndex: 9998,
            // Force root element = 52×52 to match AiChat FAB geometry (right: 16, width: 52)
            width: 52,
            height: 52,
            opacity: hidden ? 0 : 1,
            pointerEvents: hidden ? "none" : "auto",
            transition: "opacity 0.25s ease",
            // FAB chính
            "& .MuiSpeedDial-fab": {
              width: 52,
              height: 52,
              bgcolor: "#ffb700",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.28)",
              "&:hover": { bgcolor: "#f25c05" },
            },
          }}
        >
          {MOBILE_ACTIONS.map((action) => (
            <SpeedDialAction
              key={action.key}
              icon={action.icon}
              tooltipTitle={action.label}
              tooltipOpen
              tooltipPlacement="left"
              onClick={() => {
                setOpen(false);
                if (action.external) {
                  window.open(action.href, "_blank", "noopener,noreferrer");
                } else {
                  window.location.href = action.href;
                }
              }}
              FabProps={{
                sx: {
                  width: 44,
                  height: 44,
                  bgcolor: action.color,
                  color: "#fff",
                  "&:hover": { bgcolor: action.hover },
                },
              }}
              sx={{
                // tooltip label màu theo brand
                "& .MuiSpeedDialAction-staticTooltipLabel": {
                  bgcolor: action.color,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                  borderRadius: "6px",
                  px: 1.5,
                },
              }}
            />
          ))}
        </SpeedDial>
      </>
    );
  }

  // ── DESKTOP / TABLET: layout cũ giữ nguyên ────────────────────────────────
  return (
    <Zoom in>
      <Box
        sx={{
          position: "fixed",
          bottom: 40,
          left: 32,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 9999,
          opacity: hidden ? 0 : 1,
          transform: hidden ? "scale(0.85) translateY(8px)" : "scale(1) translateY(0)",
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {desktopButtons.map((item, index) => (
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
                  width: desktopSize,
                  height: desktopSize,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  animation: `fadeInUp 0.2s ease ${index * 0.2}s both, ${
                    item.animation ? "bellShake 1s infinite ease-in-out" : "none"
                  }`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.12)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                    animation: "none",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(38,132,255,0.15)",
                    animation: "pulseRing 2.5s infinite ease-out",
                    zIndex: 0,
                  },
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={`${desktopSize}px`}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              </Box>
            </a>
          </Tooltip>
        ))}

        <style jsx global>{`
          @keyframes pulseRing {
            0%   { transform: scale(1);   opacity: 0.4; }
            70%  { transform: scale(1.6); opacity: 0;   }
            100% { transform: scale(1.6); opacity: 0;   }
          }
          @keyframes bellShake {
            0%,100% { transform: rotate(0deg);  }
            15%     { transform: rotate(10deg);  }
            30%     { transform: rotate(-8deg);  }
            45%     { transform: rotate(6deg);   }
            60%     { transform: rotate(-4deg);  }
            75%     { transform: rotate(2deg);   }
          }
          @keyframes fadeInUp {
            0%   { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0);    }
          }
        `}</style>
      </Box>
    </Zoom>
  );
};

export default FloatingContactButtons;
