"use client";

import { Box, Container, Typography, Button, Stack, Paper } from "@mui/material";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const channels = [
  {
    icon: <PhoneIcon sx={{ fontSize: 28 }} />,
    title: "Gọi hotline",
    desc: "0392 923 392",
    sub: "7:00 – 18:00 mỗi ngày",
    href: "tel:0392923392",
    color: "#4caf50",
    variant: "contained" as const,
  },
  {
    icon: <EmailIcon sx={{ fontSize: 28 }} />,
    title: "Gửi email",
    desc: "support@cuonghoa.vn",
    sub: "Phản hồi trong 24h",
    href: "mailto:support@cuonghoa.vn",
    color: "#f25c05",
    variant: "outlined" as const,
  },
  {
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />,
    title: "Chat Zalo",
    desc: "Nhắn tin ngay",
    sub: "Phản hồi nhanh nhất",
    href: "https://zalo.me/0392923392",
    color: "#0068FF",
    variant: "outlined" as const,
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 28 }} />,
    title: "Đến cửa hàng",
    desc: "293 TL293, Bắc Ninh",
    sub: "Gặp trực tiếp kỹ thuật viên",
    href: "/system",
    color: "#ffb700",
    variant: "outlined" as const,
  },
];

export default function QuestionCTA() {
  return (
    <Box
      component="section"
      sx={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #3a1a00 100%)",
        py: { xs: 6, md: 8 },
        mt: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,92,5,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              component="h2"
              fontWeight={900}
              sx={{
                fontSize: { xs: "1.8rem", md: "2.6rem" },
                color: "#fff",
                lineHeight: 1.25,
                mb: 1.5,
              }}
            >
              Vẫn chưa tìm thấy câu trả lời?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", maxWidth: 500, mx: "auto" }}>
              Đội ngũ Cường Hoa luôn sẵn sàng hỗ trợ bạn qua nhiều kênh khác nhau
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ gap: 2 }}
          >
            {channels.map((ch, idx) => (
              <motion.div
                key={ch.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Paper
                  component="a"
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                    width: { xs: "100%", sm: 180 },
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.13)",
                      borderColor: ch.color,
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${ch.color}30`,
                    },
                  }}
                >
                  <Box sx={{ color: ch.color, mb: 1.5 }}>{ch.icon}</Box>
                  <Typography fontWeight={700} color="#fff" fontSize="0.95rem" gutterBottom>
                    {ch.title}
                  </Typography>
                  <Typography
                    fontSize="0.85rem"
                    fontWeight={600}
                    sx={{ color: ch.color, mb: 0.5, wordBreak: "break-all" }}
                  >
                    {ch.desc}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    {ch.sub}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Stack>

          {/* Bottom CTA */}
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
              sx={{
                bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
                px: 4, py: 1.5, borderRadius: 3,
                "&:hover": { bgcolor: "#e64a19" },
              }}
            >
              Xem lại danh sách câu hỏi
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
