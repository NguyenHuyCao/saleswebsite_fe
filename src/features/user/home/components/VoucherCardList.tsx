"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Fade,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  
  Stack,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DiscountIcon from "@mui/icons-material/Discount";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

import type { Promotion } from "../types";

type Props = { vouchers: Promotion[] };

// Helper: Đếm ngược thời gian
const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {timeLeft.days > 0 && (
        <Chip
          label={`${timeLeft.days} ngày`}
          size="small"
          sx={{
            height: 20,
            fontSize: "0.6rem",
            bgcolor: "#f25c05",
            color: "#000",
          }}
        />
      )}
      <Chip
        label={`${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
        size="small"
        sx={{
          height: 20,
          fontSize: "0.6rem",
          bgcolor: "#ffb700",
          color: "#000",
        }}
      />
    </Box>
  );
};

export default function VoucherCardList({ vouchers }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sliderRef = useRef<Slider>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  // Kiểm tra khi component vào viewport
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.35,
        ease: "easeOut",
      },
    }),
  };

  const slidesToShow = isMobile ? 1 : isTablet ? 2 : 3;
  const totalSlides = vouchers?.length ?? 0;
  const totalPages = Math.ceil(totalSlides / slidesToShow);
  const currentPage = Math.floor(currentSlide / slidesToShow) + 1;

  // Auto-slide function
  const goToNext = useCallback(() => {
    if (sliderRef.current && !isPaused) {
      const nextSlide = (currentSlide + slidesToShow) % totalSlides;
      sliderRef.current.slickGoTo(nextSlide);
    }
  }, [currentSlide, slidesToShow, totalSlides, isPaused]);

  // Auto-slide timer
  useEffect(() => {
    if (isAutoPlay && !isPaused) {
      autoPlayTimerRef.current = setInterval(goToNext, 5000);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlay, isPaused, goToNext]);

  const fixSlickA11y = useCallback(() => {
    const container = sliderContainerRef.current;
    if (!container) return;
    container.querySelectorAll<HTMLElement>('.slick-slide[aria-hidden="true"]').forEach((slide) => {
      slide.setAttribute("inert", "");
    });
    container.querySelectorAll<HTMLElement>('.slick-slide:not([aria-hidden="true"])').forEach((slide) => {
      slide.removeAttribute("inert");
    });
  }, []);

  useEffect(() => {
    fixSlickA11y();
    const container = sliderContainerRef.current;
    if (!container) return;
    const observer = new MutationObserver(fixSlickA11y);
    observer.observe(container, { subtree: true, attributeFilter: ["aria-hidden"] });
    return () => observer.disconnect();
  }, [fixSlickA11y]);

  if (!vouchers?.length) return null;

  // Pause auto-play khi hover vào slider
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    afterChange: (cur: number) => setCurrentSlide(cur),
    responsive: [
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 960, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  const handleCopy = (voucher: Promotion) => {
    navigator.clipboard.writeText(voucher.code || "");
    setCopiedId(voucher.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getVoucherType = (discount: number, maxDiscount: number) => {
    if (discount >= 0.3)
      return { label: "SIÊU HOT", color: "#f25c05", icon: <BoltIcon /> };
    if (maxDiscount >= 1000000)
      return {
        label: "GIÁ TRỊ LỚN",
        color: "#4caf50",
        icon: <EmojiEventsIcon />,
      };
    return { label: "TIẾT KIỆM", color: "#2196f3", icon: <DiscountIcon /> };
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff", position: "relative" }}>
        <Box>
          {/* Header với controls */}
          <motion.div variants={itemVariants}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: { xs: 2, md: 4 }, flexWrap: "wrap", gap: { xs: 1, sm: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f25c05",
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 12px rgba(242,92,5,0.2)",
                    }}
                  >
                    <LocalOfferIcon sx={{ color: "#fff", fontSize: 28 }} />
                  </Box>
                </motion.div>
                <Box>
                  <Typography component="h2" variant="h5" fontWeight={800} color="#333">
                    Mã giảm giá hot
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {vouchers.length} ưu đãi đang chờ bạn
                  </Typography>
                </Box>
              </Box>

              {/* Auto-play Controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Play/Pause Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    size="small"
                    aria-label={isAutoPlay ? "Tạm dừng tự động" : "Bật tự động"}
                    sx={{
                      bgcolor: isAutoPlay ? "#f25c05" : "#f5f5f5",
                      color: isAutoPlay ? "#fff" : "#999",
                      "&:hover": {
                        bgcolor: isAutoPlay ? "#e64a19" : "#e0e0e0",
                      },
                    }}
                  >
                    {isAutoPlay ? <PauseCircleIcon /> : <PlayCircleIcon />}
                  </IconButton>
                </motion.div>

                {/* Auto-play Label */}
                <Typography variant="caption" sx={{ color: "#666" }}>
                  {isAutoPlay ? "Đang tự động" : "Đã dừng"}
                </Typography>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div

                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Box
                              sx={{
                                width: i === currentPage - 1 ? 24 : 6,
                                height: 6,
                                borderRadius: 3,
                                bgcolor:
                                  i === currentPage - 1 ? "#f25c05" : "#ffb700",
                                opacity: i === currentPage - 1 ? 1 : 0.3,
                                transition: "all 0.3s",
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        {currentPage}/{totalPages}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </Stack>
          </motion.div>

          {/* Slider Container */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{ position: "relative", px: { xs: 0.5, sm: 1, md: 4 } }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Navigation Buttons */}
              {!isMobile && vouchers.length > slidesToShow && (
                <>
                  <motion.div

                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <IconButton
                      onClick={() => {
                        sliderRef.current?.slickPrev();
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 5000);
                      }}
                      aria-label="Trang trước"
                      sx={{
                        position: "absolute",
                        left: -20,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "#fff",
                        boxShadow: 3,
                        zIndex: 2,
                        "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  </motion.div>
                  <motion.div

                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <IconButton
                      onClick={() => {
                        sliderRef.current?.slickNext();
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 5000);
                      }}
                      aria-label="Trang tiếp"
                      sx={{
                        position: "absolute",
                        right: -20,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "#fff",
                        boxShadow: 3,
                        zIndex: 2,
                        "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </motion.div>
                </>
              )}

              {/* Slider — pt gives hover animation room; slick-list overflow visible prevents top clip */}
              <Box ref={sliderContainerRef} sx={{ pt: 1, "& .slick-list": { overflow: "visible !important" }, overflow: "hidden" }}>
              <Slider ref={sliderRef} {...settings}>
                {vouchers.map((voucher, index) => {
                  const type = getVoucherType(
                    voucher.discount,
                    voucher.maxDiscount,
                  );
                  const discountPercent = Math.round(voucher.discount * 100);
                  const isExpiringSoon =
                    new Date(voucher.endDate).getTime() - Date.now() <
                    3 * 24 * 60 * 60 * 1000;

                  return (
                    <Box key={voucher.id} px={1}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #fff8e1, #fff)",
                            border: "1px solid",
                            borderColor: isExpiringSoon ? "#f25c05" : "#ffb700",
                            position: "relative",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 12px 28px rgba(242,92,5,0.2)",
                            },
                          }}
                        >
                          {/* Type Badge */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              zIndex: 2,
                            }}
                          >
                            <Chip
                              icon={type.icon}
                              label={type.label}
                              size="small"
                              sx={{
                                bgcolor: type.color,
                                color: "#000",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                height: 24,
                              }}
                            />
                          </Box>

                          {/* Content */}
                          <Box sx={{ display: "flex", p: { xs: 1.5, sm: 2 } }}>
                            {/* Left - Code Section */}
                            <Box
                              sx={{
                                width: { xs: 80, sm: 100 },
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRight: "2px dashed",
                                borderColor: "#ffb700",
                                pr: { xs: 1.5, sm: 2 },
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                MÃ
                              </Typography>
                              <Typography
                                component="p"
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                  color: "#f25c05",
                                  letterSpacing: 1,
                                  fontSize: { xs: "0.85rem", sm: "1.1rem" },
                                  wordBreak: "break-all",
                                  textAlign: "center",
                                }}
                              >
                                {voucher.code || "CODE"}
                              </Typography>
                            </Box>

                            {/* Right - Info Section */}
                            <Box sx={{ flex: 1, pl: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
                              <Typography
                                component="p"
                                variant="h5"
                                fontWeight={900}
                                sx={{ color: "#f25c05", lineHeight: 1 }}
                              >
                                {discountPercent}%
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ color: "#666", ml: 1 }}
                                >
                                  GIẢM
                                </Typography>
                              </Typography>

                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ color: "#333", mb: 1 }}
                              >
                                Tối đa {voucher.maxDiscount.toLocaleString()}₫
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 1.5 }}
                              >
                                <Chip
                                  icon={
                                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                                  }
                                  label="Áp dụng sản phẩm cụ thể"
                                  size="small"
                                  sx={{
                                    bgcolor: "#f5f5f5",
                                    fontSize: "0.6rem",
                                    height: 22,
                                  }}
                                />
                              </Stack>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{ fontSize: 16, color: "#999" }}
                                />
                                {isExpiringSoon ? (
                                  <CountdownTimer endDate={voucher.endDate} />
                                ) : (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    HSD:{" "}
                                    {new Date(
                                      voucher.endDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </Typography>
                                )}
                              </Box>

                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleCopy(voucher)}
                                sx={{
                                  bgcolor:
                                    copiedId === voucher.id
                                      ? "#2e7d32"
                                      : "#c94000",
                                  color: "#fff",
                                  textTransform: "none",
                                  fontWeight: 600,
                                  py: 1,
                                  borderRadius: 2,
                                  fontSize: "0.9rem",
                                  "&:hover": {
                                    bgcolor:
                                      copiedId === voucher.id
                                        ? "#1b5e20"
                                        : "#a83700",
                                  },
                                }}
                                startIcon={
                                  copiedId === voucher.id ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <ContentCopyIcon />
                                  )
                                }
                              >
                                {copiedId === voucher.id
                                  ? "Đã sao chép!"
                                  : "Sao chép mã"}
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Box>
                  );
                })}
              </Slider>
              </Box>
            </Box>
          </motion.div>

          {/* Mobile Hint */}
          {isMobile && vouchers.length > 1 && (
            <motion.div

              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Fade in timeout={1000}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 3,
                    color: "#999",
                    fontStyle: "italic",
                    animation: "slideHint 1.5s infinite",
                    "@keyframes slideHint": {
                      "0%": { transform: "translateX(0)" },
                      "50%": { transform: "translateX(-10px)" },
                      "100%": { transform: "translateX(0)" },
                    },
                  }}
                >
                  ← Vuốt để xem thêm mã giảm giá →
                </Typography>
              </Fade>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
