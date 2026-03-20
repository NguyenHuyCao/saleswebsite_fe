// questions/components/FaqHeroSection.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Container,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function FaqHeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 500, md: 550 },
        bgcolor: "#f5f5f5",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 50%, #f25c05 0%, transparent 50%)",
          opacity: 0.1,
        }}
      />

      {/* Decorative Circles */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "#ffb700",
          opacity: 0.05,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "#f25c05",
          opacity: 0.05,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", py: { xs: 6, md: 8 } }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 6, md: 4 }}
          sx={{ width: "100%" }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ flex: 1 }}
          >
            <Box sx={{ maxWidth: 600 }}>
              {/* Badge */}
              <Chip
                icon={<HelpOutlineIcon />}
                label="TRUNG TÂM HỖ TRỢ"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 3,
                  px: 2,
                  py: 1.5,
                  fontSize: "0.85rem",
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Bạn cần hỗ trợ?
                <Box
                  component="span"
                  sx={{ color: "#f25c05", display: "block", mt: 1 }}
                >
                  Chúng tôi sẵn sàng giúp đỡ!
                </Box>
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  maxWidth: 500,
                }}
              >
                Tìm câu trả lời nhanh chóng với hàng trăm bài viết hướng dẫn
                hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
              </Typography>

              {/* Search Bar */}
              <Paper
                elevation={2}
                sx={{
                  p: 0.5,
                  pl: 2,
                  display: "flex",
                  alignItems: "center",
                  maxWidth: 500,
                  borderRadius: 4,
                  mb: 4,
                }}
              >
                <SearchIcon sx={{ color: "#999", mr: 1 }} />
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm câu hỏi thường gặp..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: "0.95rem" },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#fff",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": { bgcolor: "#e64a19" },
                  }}
                >
                  Tìm
                </Button>
              </Paper>

              {/* Quick Stats */}
              <Stack
                direction="row"
                spacing={{ xs: 2, sm: 4 }}
                sx={{
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 100,
                    bgcolor: "#fff",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight={800} color="#f25c05">
                    50+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Câu hỏi
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 100,
                    bgcolor: "#fff",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight={800} color="#f25c05">
                    24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hỗ trợ
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 100,
                    bgcolor: "#fff",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight={800} color="#f25c05">
                    15'
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phản hồi
                  </Typography>
                </Paper>
              </Stack>

              {/* Trust Badge */}
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Chip
                  label="✓ Hỗ trợ tận tâm"
                  size="small"
                  sx={{ bgcolor: "#f5f5f5" }}
                />
                <Chip
                  label="✓ Giải đáp nhanh chóng"
                  size="small"
                  sx={{ bgcolor: "#f5f5f5" }}
                />
              </Stack>
            </Box>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: 1 }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                width: "100%",
                height: 350,
              }}
            >
              <Image
                src="/images/about/May-cua-xich-chay-pin-STIHL-MSA-120.jpg"
                alt="FAQ Illustration"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
