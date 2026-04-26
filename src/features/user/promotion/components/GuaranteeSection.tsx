"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { motion } from "framer-motion";

const guarantees = [
  {
    icon: LocalShippingIcon,
    label: "Giao nhanh",
    text: "Giao hàng siêu tốc 2–4h tại TP.HCM",
    color: "#f25c05",
    bg: "rgba(242,92,5,0.08)",
    border: "rgba(242,92,5,0.2)",
  },
  {
    icon: VerifiedIcon,
    label: "Bảo hành",
    text: "Bảo hành chính hãng 12 tháng",
    color: "#4caf50",
    bg: "rgba(76,175,80,0.08)",
    border: "rgba(76,175,80,0.2)",
  },
  {
    icon: SupportAgentIcon,
    label: "Hỗ trợ",
    text: "Tư vấn kỹ thuật miễn phí 24/7",
    color: "#2196f3",
    bg: "rgba(33,150,243,0.08)",
    border: "rgba(33,150,243,0.2)",
  },
  {
    icon: CardGiftcardIcon,
    label: "Quà tặng",
    text: "Tặng kèm phụ kiện bảo dưỡng",
    color: "#ffb700",
    bg: "rgba(255,183,0,0.08)",
    border: "rgba(255,183,0,0.3)",
  },
];

const MotionPaper = motion(Paper);

export default function GuaranteeSection() {
  return (
    <Box mt={6}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          mb={4}
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          CAM KẾT — CHÍNH SÁCH
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
          {guarantees.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Grid key={idx} size={{ xs: 6, sm: 6, md: 3 }}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, translateY: -4 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 3,
                    height: "100%",
                    bgcolor: item.bg,
                    border: `1.5px solid ${item.border}`,
                    cursor: "default",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      borderRadius: "50%",
                      bgcolor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                      boxShadow: `0 4px 12px ${item.border}`,
                    }}
                  >
                    <IconComponent sx={{ color: item.color, fontSize: { xs: 24, sm: 28 } }} />
                  </Box>
                  <Typography
                    fontWeight={700}
                    sx={{ fontSize: { xs: "0.72rem", sm: "0.8rem" }, color: item.color, mb: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, color: "text.primary", fontWeight: 500 }}
                  >
                    {item.text}
                  </Typography>
                </MotionPaper>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    </Box>
  );
}
