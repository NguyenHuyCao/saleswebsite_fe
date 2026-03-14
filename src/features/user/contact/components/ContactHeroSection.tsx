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

export default function ContactHeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "80vh", md: "90vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Image
        src="/images/banner/360_F_229670001_Ju6K5ezKiyJphkwj316zT31XifNHJoPT.jpg"
        alt="Team working"
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
            "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)",
          zIndex: 1,
        }}
      />

      {/* Floating Stats */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 20, md: 40 },
          right: { xs: 10, md: 40 },
          zIndex: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {[
          { icon: <SupportAgentIcon />, label: "24/7 Support" },
          { icon: <VerifiedIcon />, label: "100% Response" },
        ].map((item, idx) => (
          <Chip
            key={idx}
            icon={item.icon}
            label={item.label}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

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
        }}
      >
        {/* Trust Badge */}
        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          <Chip
            label="✨ 10,000+ Khách hàng tin tưởng"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Typography
          variant="h2"
          fontWeight={900}
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            textAlign: "center",
            color: "#fff",
            mb: 2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
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
            textAlign: "center",
            color: "#fff",
            mb: 4,
            maxWidth: 700,
            mx: "auto",
            opacity: 0.95,
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          Đội ngũ tư vấn chuyên nghiệp sẽ phản hồi trong vòng 24h. Gửi yêu cầu
          ngay để nhận ưu đãi đặc biệt!
        </Typography>

        {/* CTA Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
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
              "&:hover": {
                bgcolor: "#f59e0b",
                transform: "scale(1.05)",
              },
            }}
          >
            Gửi yêu cầu ngay
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="#quick-help"
            sx={{
              borderColor: "#fff",
              borderWidth: 2,
              color: "#fff",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "#ffb700",
                bgcolor: "rgba(255,255,255,0.1)",
              },
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
          spacing={2}
        >
          <AvatarGroup max={4}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar
                key={i}
                src={`/images/customers/customer${i}.jpg`}
                sx={{ width: 40, height: 40, border: "2px solid #ffb700" }}
              />
            ))}
          </AvatarGroup>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            +500 khách hàng đã liên hệ trong tháng này
          </Typography>
        </Stack>
      </motion.div>
    </Box>
  );
}
