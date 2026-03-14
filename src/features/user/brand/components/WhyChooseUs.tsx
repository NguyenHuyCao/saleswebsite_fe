"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
  Chip,
  Fade,
  Zoom,
  Stack,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Wrench,
  Handshake,
  Hammer,
  Award,
  Users,
  Package,
  Clock,
} from "lucide-react";

// Icons
import VerifiedIcon from "@mui/icons-material/Verified";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const reasons = [
  {
    icon: <ShieldCheck size={40} strokeWidth={1.8} />,
    title: "Cam kết chính hãng 100%",
    description: "Sản phẩm chính hãng, có tem bảo hành điện tử",
    stats: "10,000+ sản phẩm",
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  {
    icon: <Hammer size={40} strokeWidth={1.8} />,
    title: "Phụ tùng dễ thay thế",
    description: "Kho phụ tùng đa dạng, sẵn sàng thay thế nhanh chóng",
    stats: "2,000+ linh kiện",
    color: "#f25c05",
    bgColor: "rgba(242, 92, 5, 0.1)",
  },
  {
    icon: <Wrench size={40} strokeWidth={1.8} />,
    title: "Hỗ trợ kỹ thuật 24/7",
    description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, hỗ trợ tận tâm",
    stats: "100+ kỹ thuật viên",
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  {
    icon: <Handshake size={40} strokeWidth={1.8} />,
    title: "Giá tốt – Dài lâu",
    description: "Hợp tác chiến lược với các nhà cung cấp hàng đầu",
    stats: "15+ năm kinh nghiệm",
    color: "#ffb700",
    bgColor: "rgba(255, 183, 0, 0.1)",
  },
];

// Stats for footer
const stats = [
  { icon: <Users />, value: "50K+", label: "Khách hàng" },
  { icon: <Package />, value: "100K+", label: "Sản phẩm" },
  { icon: <Award />, value: "10+", label: "Giải thưởng" },
  { icon: <Clock />, value: "15+", label: "Năm kinh nghiệm" },
];

export default function WhyChooseUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <motion.div variants={headerVariants}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Chip
                label="TẠI SAO CHỌN CHÚNG TÔI?"
                size="small"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                  mb: 2,
                }}
              >
                4 LÝ DO BẠN NÊN{" "}
                <Box component="span" sx={{ color: "#ffb700" }}>
                  TIN TƯỞNG
                </Box>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Với hơn 15 năm kinh nghiệm trong ngành, chúng tôi tự hào mang
                đến những sản phẩm và dịch vụ tốt nhất cho khách hàng.
              </Typography>
            </Box>
          </motion.div>

          {/* Reasons Grid */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {reasons.map((reason, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      height: "100%",
                      borderRadius: 4,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                        borderColor: reason.color,
                      },
                    }}
                  >
                    {/* Background Pattern */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        bgcolor: reason.bgColor,
                        zIndex: 0,
                      }}
                    />

                    {/* Content */}
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      {/* Icon Container */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 3,
                            bgcolor: reason.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                            color: reason.color,
                            transition: "all 0.3s ease",
                            border: "1px solid",
                            borderColor: reason.color,
                          }}
                        >
                          {reason.icon}
                        </Box>
                      </motion.div>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mb: 1.5,
                          color: "#333",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                        }}
                      >
                        {reason.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: { xs: "0.85rem", md: "0.9rem" },
                        }}
                      >
                        {reason.description}
                      </Typography>

                      {/* Stats */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: "1px dashed",
                          borderColor: "rgba(0,0,0,0.1)",
                        }}
                      >
                        <VerifiedIcon
                          sx={{ fontSize: 16, color: reason.color }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: reason.color }}
                        >
                          {reason.stats}
                        </Typography>
                      </Stack>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Stats Footer */}
          <motion.div variants={headerVariants} transition={{ delay: 0.5 }}>
            <Paper
              elevation={0}
              sx={{
                mt: 6,
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                bgcolor: "#fafafa",
                border: "1px solid #ffb700",
              }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid key={index} size={{ xs: 6, md: 3 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          bgcolor: "#fff8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#f25c05",
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          color="#f25c05"
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>

          {/* Trust Badges */}
          <Fade in timeout={1000}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}
            >
              <Chip
                icon={<VerifiedIcon />}
                label="Chính hãng 100%"
                sx={{
                  bgcolor: "#fff8e1",
                  color: "#f25c05",
                  fontWeight: 600,
                  px: 2,
                }}
              />
              <Chip
                icon={<VerifiedIcon />}
                label="Bảo hành 12 tháng"
                sx={{
                  bgcolor: "#fff8e1",
                  color: "#f25c05",
                  fontWeight: 600,
                  px: 2,
                }}
              />
              <Chip
                icon={<VerifiedIcon />}
                label="Miễn phí vận chuyển"
                sx={{
                  bgcolor: "#fff8e1",
                  color: "#f25c05",
                  fontWeight: 600,
                  px: 2,
                }}
              />
            </Stack>
          </Fade>
        </Container>
      </Box>
    </motion.div>
  );
}
