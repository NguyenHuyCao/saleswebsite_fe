"use client";

import { Box, Container, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CachedIcon from "@mui/icons-material/Cached";

const BADGES = [
  {
    Icon: LocalShippingIcon,
    title: "Giao hàng toàn quốc",
    desc: "Miễn phí nội thành TP.HCM",
    iconColor: "#1976d2",
    bgColor: "#e3f2fd",
  },
  {
    Icon: VerifiedUserIcon,
    title: "Bảo hành chính hãng",
    desc: "Lên đến 12 tháng",
    iconColor: "#2e7d32",
    bgColor: "#e8f5e9",
  },
  {
    Icon: CachedIcon,
    title: "Đổi trả dễ dàng",
    desc: "Trong vòng 7 ngày",
    iconColor: "#f25c05",
    bgColor: "#fff3e0",
  },
  {
    Icon: SupportAgentIcon,
    title: "Hỗ trợ 24/7",
    desc: "Hotline: 0392 923 392",
    iconColor: "#7b1fa2",
    bgColor: "#f3e5f5",
  },
];

export default function TrustBadgesBar() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          }}
        >
          {BADGES.map(({ Icon, title, desc, iconColor, bgColor }, i) => (
              <Box
                key={title}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1.75, sm: 2.25 },
                  borderRight: {
                    xs: i % 2 === 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    md: i < 3 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  },
                  borderBottom: {
                    xs: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    md: "none",
                  },
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#fafafa" },
                  cursor: "default",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 38, sm: 44 },
                    height: { xs: 38, sm: 44 },
                    borderRadius: 2,
                    bgcolor: bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ color: iconColor, fontSize: { xs: 20, sm: 24 } }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: "0.72rem", sm: "0.82rem", md: "0.88rem" },
                      color: "#1a1a1a",
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#888",
                      fontSize: { xs: "0.62rem", sm: "0.7rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {desc}
                  </Typography>
                </Box>
              </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
