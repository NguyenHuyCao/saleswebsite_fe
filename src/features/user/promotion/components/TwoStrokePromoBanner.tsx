// components/home/TwoStrokePromoBanner.tsx (FIXED)
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Container,
} from "@mui/material";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const banners = [
  {
    id: 1,
    title: "SIÊU ƯU ĐÃI MÁY PHÁT ĐIỆN",
    subtitle: "Mua 1 được 2 – Quà tặng lên đến 300K + Freeship toàn quốc",
    highlights: [
      { icon: <VerifiedIcon />, text: "Bảo hành 12 tháng" },
      { icon: <SupportAgentIcon />, text: "Hỗ trợ kỹ thuật tận nơi" },
      { icon: <LocalOfferIcon />, text: "Giảm đến 50%" },
      { icon: <AutorenewIcon />, text: "Miễn phí đổi trả 7 ngày" },
    ],
    button: "XEM SẢN PHẨM",
    buttonIcon: "🔥",
    href: "/product#products",
    imageAlt: "Máy cắt cỏ 2 thì đang khuyến mãi tại Cường Hoa",
    image:
      "/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg",
    bgGradient: "linear-gradient(135deg, #f25c05 0%, #ffb700 100%)",
    badge: "SIÊU HOT",
    badgeColor: "#f25c05",
  },
  {
    id: 2,
    title: "FLASH SALE MÁY CƯA 12H",
    subtitle: "Giảm khủng – Số lượng có hạn – Chỉ áp dụng hôm nay",
    highlights: [
      { icon: <LocalShippingIcon />, text: "Tặng nhớt pha sẵn" },
      { icon: <LocalShippingIcon />, text: "Giao nhanh 2H tại HCM" },
      { icon: <VerifiedIcon />, text: "Bảo hành chính hãng" },
      { icon: <LocalOfferIcon />, text: "Ưu đãi độc quyền online" },
    ],
    button: "MUA NGAY",
    buttonIcon: "⚡",
    href: "/product#products",
    imageAlt: "Máy cưa xích flash sale giảm giá tại Cường Hoa",
    image: "/images/banner/cua-betong-gs461.jpg",
    bgGradient: "linear-gradient(135deg, #ffb700 0%, #f25c05 100%)",
    badge: "GIỚI HẠN",
    badgeColor: "#ffb700",
  },
];

export default function TwoStrokePromoBanner() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const router = useRouter();

  const handleNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 7000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const current = banners[index];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      <Box>
        <Box
          sx={{
            position: "relative",
            borderRadius: { xs: 3, sm: 4 },
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(242,92,5,0.15)",
          }}
        >
          {/* Background Gradient */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
              }}
              style={{
                position: "relative",
                background: current.bgGradient,
                // FIX: Chuyển minHeight vào Box bên dưới thay vì style của motion.div
              }}
            >
              {/* Box với minHeight đã được fix */}
              <Box
                sx={{
                  minHeight: { xs: 520, sm: 440, md: 420 }, // TĂNG PADDING TRỤC Y
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* Background Pattern */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)",
                    opacity: 0.3,
                  }}
                />

                {/* Content Container */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    px: { xs: 3, sm: 6, md: 8 },
                    py: { xs: 5, sm: 6, md: 5 }, // TĂNG PADDING DỌC (xs: 4 → 5, sm: 5 → 6)
                  }}
                >
                  {/* Left Content */}
                  <Stack
                    spacing={{ xs: 2.5, sm: 3 }} // TĂNG SPACING DỌC
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", md: 600 },
                      color: "#fff",
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    {/* Badge */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-start" },
                      }}
                    >
                      <Chip
                        label={current.badge}
                        size="small"
                        sx={{
                          bgcolor: current.badgeColor,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          height: { xs: 24, sm: 28 },
                          px: 1,
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      fontWeight={900}
                      sx={{
                        lineHeight: 1.2,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      <ElectricBoltIcon
                        sx={{ mr: 1, fontSize: { xs: 28, sm: 32 } }}
                      />
                      {current.title}
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      sx={{
                        opacity: 0.95,
                        fontWeight: 500,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      {current.subtitle}
                    </Typography>

                    {/* Highlights Grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
                        gap: { xs: 1.5, sm: 2 }, // TĂNG GAP
                        mt: 1.5, // TĂNG MARGIN TOP
                      }}
                    >
                      {current.highlights.map((item, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(4px)",
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 1, sm: 1.2 }, // TĂNG PADDING DỌC
                            borderRadius: 3,
                          }}
                        >
                          <Box
                            sx={{ color: "#fff", fontSize: { xs: 16, sm: 18 } }}
                          >
                            {item.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* CTA Button */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mt: { xs: 2, sm: 3 }, // TĂNG MARGIN TOP
                      }}
                    >
                      <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        onClick={() => router.push(current.href)}
                        startIcon={<span>{current.buttonIcon}</span>}
                        sx={{
                          bgcolor: "#fff",
                          color: "#f25c05",
                          fontWeight: 700,
                          px: { xs: 4, sm: 5 },
                          py: { xs: 1.2, sm: 1.5 },
                          borderRadius: 3,
                          textTransform: "uppercase",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                          "&:hover": {
                            bgcolor: "#fff8e1",
                            transform: { xs: "none", sm: "translateY(-2px)" },
                            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {current.button}
                      </Button>
                    </Box>
                  </Stack>

                  {/* Right Image */}
                  {!isMobile && (
                    <motion.div

                      animate={{ opacity: 0.95, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      style={{
                        flexShrink: 0,
                        marginLeft: isTablet ? 20 : 40,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { sm: 200, md: 260, lg: 300 },
                          height: { sm: 160, md: 190, lg: 220 },
                          borderRadius: 3,
                          overflow: "hidden",
                          boxShadow: "0 20px 30px rgba(0,0,0,0.25)",
                          transform: "rotate(2deg)",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "rotate(0deg) scale(1.02)",
                          },
                        }}
                      >
                        <Image
                          src={current.image}
                          alt={current.imageAlt}
                          fill
                          sizes="(max-width: 900px) 200px, 300px"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!isMobile && (
            <>
              <IconButton
                onClick={handlePrev}
                aria-label="Banner khuyến mãi trước"
                sx={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  zIndex: 3,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                aria-label="Banner khuyến mãi tiếp theo"
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  zIndex: 3,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* Pagination Dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 3,
            }}
          >
            {banners.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => {
                  setDirection(idx > index ? 1 : -1);
                  setIndex(idx);
                }}
                sx={{
                  width: idx === index ? { xs: 24, sm: 32 } : { xs: 6, sm: 8 },
                  height: { xs: 6, sm: 8 },
                  borderRadius: 4,
                  bgcolor: "#fff",
                  opacity: idx === index ? 1 : 0.5,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                    width: { xs: 12, sm: 16 },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
