// components/home/CategoryBanner.tsx (OPTIMIZED RESPONSIVE)
"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
  Fade,
  Chip,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";

const banners = [
  {
    id: 1,
    image: "/images/banner/banner-ab.jpg",
    title: "Chất lượng Mỹ – Hiệu năng vượt trội",
    subtitle: "DeWALT chính hãng – Giá tốt mỗi ngày!",
    buttonText: "Xem sản phẩm DeWALT",
    href: "/product?brand=dewalt",
    tag: "DeWALT",
    color: "#f25c05",
    gradient: "linear-gradient(90deg, #f25c05, #ffb700)",
    features: ["Bảo hành 12 tháng", "Miễn phí vận chuyển", "Ưu đãi 15%"],
  },
  {
    id: 2,
    image: "/images/banner/banner-may-cat-co.jpg",
    title: "Makita – Đẳng cấp từ Nhật Bản",
    subtitle: "Bền bỉ – Tiết kiệm – Chuyên nghiệp",
    buttonText: "Khám phá máy Makita",
    href: "/product?brand=makita",
    tag: "Makita",
    color: "#f25c05",
    gradient: "linear-gradient(90deg, #ffb700, #f25c05)",
    features: ["Công nghệ Nhật", "Tiết kiệm pin", "Nhẹ - Bền"],
  },
];

export default function CategoryBanner() {
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
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const current = banners[index];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: {
          xs: "calc(100vh - 56px)", // Mobile: gần full màn hình
          sm: 450, // Tablet
          md: 500, // Desktop
          lg: 550,
        },
        minHeight: { xs: 500, sm: 450 },
        borderRadius: { xs: 0, sm: 4 },
        overflow: "hidden",
        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
        mb: { xs: 2, sm: 4 },
        mx: { xs: -2, sm: 0 }, // Bù padding container
      }}
    >
      {/* Background Image */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.4 },
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            priority
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 100vw, 100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: {
                xs: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)",
                sm: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
              },
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "flex-end", sm: "center" },
              alignItems: { xs: "center", sm: "flex-start" },
              px: { xs: 3, sm: 6, md: 8 },
              pb: { xs: 8, sm: 0 },
              color: "#fff",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {/* Tag */}
            <Chip
              label={current.tag}
              size="small"
              sx={{
                bgcolor: current.color,
                color: "#fff",
                fontWeight: 700,
                width: "fit-content",
                mb: 2,
                px: 1,
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                height: { xs: 24, sm: 28 },
              }}
            />

            {/* Title */}
            <Typography
              variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
              fontWeight={800}
              sx={{
                mb: { xs: 1, sm: 1.5 },
                maxWidth: { xs: "100%", sm: 500, md: 600 },
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
                lineHeight: 1.2,
              }}
            >
              {current.title}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{
                mb: { xs: 2, sm: 3 },
                opacity: 0.95,
                maxWidth: { xs: "100%", sm: 450, md: 500 },
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
              }}
            >
              {current.subtitle}
            </Typography>

            {/* Features - Ẩn bớt trên mobile nếu cần */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              sx={{
                mb: { xs: 3, sm: 4 },
                width: { xs: "100%", sm: "auto" },
                alignItems: { xs: "center", sm: "flex-start" },
              }}
            >
              {current.features
                .slice(0, isMobile ? 2 : 3)
                .map((feature, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.8, sm: 1 },
                      borderRadius: 3,
                      width: { xs: "100%", sm: "auto" },
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    <VerifiedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      fontSize={{ xs: "0.8rem", sm: "0.9rem" }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
            </Stack>

            {/* CTA Button */}
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={() => router.push(current.href)}
              sx={{
                bgcolor: "#fff",
                color: "#333",
                fontWeight: 700,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                width: { xs: "100%", sm: "fit-content" },
                maxWidth: { xs: 280, sm: "none" },
                borderRadius: 3,
                textTransform: "none",
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: current.color,
                  color: "#fff",
                  transform: { xs: "none", sm: "translateY(-2px)" },
                  boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {current.buttonText}
            </Button>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Chỉ hiện trên tablet/desktop */}
      {!isMobile && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 8, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              zIndex: 3,
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ChevronLeftIcon fontSize={isTablet ? "medium" : "large"} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 8, sm: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              zIndex: 3,
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ChevronRightIcon fontSize={isTablet ? "medium" : "large"} />
          </IconButton>
        </>
      )}

      {/* Pagination Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 16, sm: 24 },
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
              "&:hover": { opacity: 1, width: { xs: 12, sm: 16 } },
            }}
          />
        ))}
      </Box>

      {/* Index Indicator - Ẩn trên mobile vì đã có dots */}
      {!isMobile && (
        <Chip
          label={`${index + 1}/${banners.length}`}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            zIndex: 3,
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            height: { xs: 24, sm: 28 },
          }}
        />
      )}
    </Box>
  );
}
