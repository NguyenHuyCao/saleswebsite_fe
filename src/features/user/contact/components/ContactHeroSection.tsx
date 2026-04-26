"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const CUSTOMER_INITIALS = ["H", "M", "T", "P", "N"];
const AVATAR_COLORS = ["#f25c05", "#ffb700", "#4caf50", "#2196f3", "#9c27b0"];

export default function ContactHeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: { xs: "80vh", md: "90vh" },
        minHeight: { xs: 480, md: 600 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Image
        src="/images/banner/360_F_229670001_Ju6K5ezKiyJphkwj316zT31XifNHJoPT.jpg"
        alt="Đội ngũ tư vấn Cường Hoa"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 0 }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.2) 100%)",
          zIndex: 1,
        }}
      />

      {/* Trust Badges — top right */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, md: 40 },
          right: { xs: 12, md: 40 },
          zIndex: 3,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {[
          { icon: <SupportAgentIcon fontSize="small" />, label: "Hỗ trợ 24/7" },
          { icon: <VerifiedIcon fontSize="small" />, label: "Phản hồi 100%" },
        ].map((item) => (
          <Chip
            key={item.label}
            icon={item.icon}
            label={item.label}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ))}
      </Box>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 900,
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        {/* Trust Badge */}
        <Stack direction="row" justifyContent="center" sx={{ mb: 2.5 }}>
          <Chip
            label="✨ 10,000+ Khách hàng tin tưởng"
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
        </Stack>

        <Typography
          component="h1"
          variant="h2"
          fontWeight={900}
          sx={{
            fontSize: { xs: "2rem", sm: "2.6rem", md: "3.5rem" },
            color: "#fff",
            mb: 2,
            textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
            lineHeight: 1.2,
          }}
        >
          Chúng tôi luôn sẵn sàng
          <Box component="span" sx={{ color: "#ffb700", display: "block" }}>
            hỗ trợ bạn!
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.92)",
            mb: 4,
            maxWidth: 680,
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.6,
          }}
        >
          Đội ngũ tư vấn chuyên nghiệp phản hồi trong vòng 24h.
          Gửi yêu cầu ngay để nhận ưu đãi đặc biệt!
        </Typography>

        {/* CTA Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 5 }}
        >
          <Button
            variant="contained"
            size="large"
            href="#contact-form"
            endIcon={<KeyboardDoubleArrowDownIcon />}
            sx={{
              bgcolor: "#ffb700",
              color: "#000",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#f59e0b",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Gửi yêu cầu ngay
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="#quick-help"
            sx={{
              borderColor: "rgba(255,255,255,0.7)",
              borderWidth: 2,
              color: "#fff",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#ffb700",
                bgcolor: "rgba(255,255,255,0.08)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Câu hỏi thường gặp
          </Button>
        </Stack>

        {/* Social Proof */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          flexWrap="wrap"
        >
          <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { border: "2px solid #ffb700" } }}>
            {CUSTOMER_INITIALS.map((initial, i) => (
              <Avatar
                key={i}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: AVATAR_COLORS[i],
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {initial}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.88)", fontWeight: 500 }}
          >
            +500 khách hàng đã liên hệ tháng này
          </Typography>
        </Stack>
      </motion.div>
    </Box>
  );
}
