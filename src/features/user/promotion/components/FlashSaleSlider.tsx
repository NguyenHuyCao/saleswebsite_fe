"use client";

import React, { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import Slider from "react-slick";
import ProductCard from "../../products/components/ProductCard";
import CountdownPromotion from "../../home/components/CountdownPromotion";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { api } from "@/lib/api/http";
import { mapProduct } from "@/lib/utils/productMapper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// IMPORT type Promotion từ file types thay vì định nghĩa lại
import type { Promotion } from "../types";
import type { Product } from "@/features/user/products/types";

const sliderStyles = `
  .flash-sale-slider .slick-track {
    display: flex;
    gap: 8px;
  }
  .flash-sale-slider .slick-slide {
    height: inherit;
    padding: 4px;
  }
  .flash-sale-slider .slick-slide > div {
    height: 100%;
  }
`;
// Fetcher applies the promotion discount so each product card shows the correct sale price.
// [path, discountPct] used as SWR key so SWR re-fetches when promotion changes.
const fetcher = async ([path, discountPct]: [string, number]): Promise<Product[]> => {
  try {
    const payload = await api.get<any>(path);
    const raw: any[] = Array.isArray(payload)
      ? payload
      : (payload?.result ?? payload?.items ?? payload?.data ?? []);

    const nowMs = Date.now();
    return raw.map((item: any) => mapProduct(item, nowMs, discountPct));
  } catch {
    return [];
  }
};

type FlashSaleSliderProps = {
  promotion: Promotion;
  allPromotions?: Promotion[];
};

const FlashSaleSlider: React.FC<FlashSaleSliderProps> = ({
  promotion,
  allPromotions = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const sliderRef = useRef<Slider | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderReady, setSliderReady] = useState(false);

  const swrKey = [`/api/v1/promotions/${promotion.id}/products`, promotion.discount] as const;
  const { data: products = [] } = useSWR(swrKey, fetcher);

  // Tính toán số slide
  const slidesToShow = isMobile ? 2 : 5;
  const totalProducts = products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / slidesToShow));
  const currentPage = Math.min(
    Math.floor(currentSlide / slidesToShow) + 1,
    totalPages,
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderReady(true);
    }
  }, []);

  // So sánh theo ngày tại múi giờ VN (UTC+7) để tránh bị mất 7 tiếng sớm
  const isExpired = (() => {
    if (!promotion.endDate) return false;
    // endDate dạng "YYYY-MM-DD" → coi là hết hiệu lực khi qua ngày đó tại VN
    const [y, m, d] = promotion.endDate.split("-").map(Number);
    const endMs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime(); // local midnight+1s
    return Date.now() > endMs;
  })();
  if (isExpired) return null;

  const settings = {
    infinite: false,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: false,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
    },
    afterChange: (current: number) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
    ],
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPage = (pageIndex: number) => {
    sliderRef.current?.slickGoTo(pageIndex * slidesToShow);
  };

  // Normalise: backend may return 0-1 fraction or 0-100 integer
  const discountPercent = promotion.discount > 1
    ? Math.round(promotion.discount)
    : Math.round(promotion.discount * 100);

  // Phần còn lại của component giữ nguyên...
  // (tôi sẽ viết tiếp phần return để bạn dễ copy)

  return (
    <>
      <style>{sliderStyles}</style>
      <Box
        sx={{
          px: { xs: 1, md: 2 },
          py: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #fff9f0 100%)",
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255, 183, 0, 0.2)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #ffb700, #f25c05, #ffb700)",
            backgroundSize: "200% 100%",
            animation: "gradientMove 3s infinite linear",
            "@keyframes gradientMove": {
              "0%": { backgroundPosition: "0% 0%" },
              "100%": { backgroundPosition: "200% 0%" },
            },
          },
        }}
      >
        {/* Header của từng flash sale */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 3,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#f25c05",
                width: 48,
                height: 48,
                boxShadow: "0 4px 12px rgba(242, 92, 5, 0.3)",
              }}
            >
              <LocalOfferIcon />
            </Avatar>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#f25c05">
                  {promotion.name}
                </Typography>
                <Chip
                  label={`-${discountPercent}%`}
                  size="small"
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <AccessTimeIcon sx={{ fontSize: 16, color: "#ffb700" }} />
                Kết thúc sau:{" "}
                <CountdownPromotion deadline={promotion.endDate} compact />
              </Typography>
            </Box>
          </Box>

          {/* Nút điều hướng cho desktop */}
          {!isMobile && totalPages > 1 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handlePrev}
                disabled={currentSlide === 0}
                sx={{
                  bgcolor: currentSlide === 0 ? "#f5f5f5" : "#ffb700",
                  color: currentSlide === 0 ? "#bdbdbd" : "#000",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: currentSlide === 0 ? "#f5f5f5" : "#f59e0b",
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentSlide + slidesToShow >= totalProducts}
                sx={{
                  bgcolor:
                    currentSlide + slidesToShow >= totalProducts
                      ? "#f5f5f5"
                      : "#f25c05",
                  color:
                    currentSlide + slidesToShow >= totalProducts
                      ? "#bdbdbd"
                      : "#fff",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor:
                      currentSlide + slidesToShow >= totalProducts
                        ? "#f5f5f5"
                        : "#e64a19",
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Slider sản phẩm */}
        <Box sx={{ position: "relative" }}>
          <Slider ref={sliderRef} {...settings} className="flash-sale-slider">
            {products.map((product, index) => (
              <Box key={product.id} px={1}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.04, 0.2),
                    ease: "easeOut",
                  }}
                >
                  <ProductCard product={product} mutateKey={swrKey[0]} />
                </motion.div>
              </Box>
            ))}
          </Slider>

          {/* Hint kéo tay cho mobile */}
          {isMobile && products.length > slidesToShow && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: "#bbb",
                fontStyle: "italic",
              }}
            >
              Vuốt để xem thêm →
            </Typography>
          )}
        </Box>

        {/* Pagination chuyên nghiệp */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
              gap: 2,
            }}
          >
            {/* Progress bar cho mobile */}
            {isMobile ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 240,
                  height: 4,
                  bgcolor: "rgba(255, 183, 0, 0.2)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentSlide + slidesToShow) / totalProducts) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ffb700, #f25c05)",
                    borderRadius: 2,
                  }}
                />
              </Box>
            ) : (
              /* Pagination dots đẹp cho desktop */
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const isActive = index === currentPage - 1;
                  return (
                    <Box
                      key={index}
                      onClick={() => goToPage(index)}
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        px: 0.5,
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          width: isActive ? 32 : 8,
                          height: 8,
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderRadius: 4,
                          background: isActive
                            ? "linear-gradient(90deg, #f25c05, #ffb700)"
                            : "#ffb700",
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />

                    </Box>
                  );
                })}

                {/* Hiển thị số trang dạng badge */}
                <Chip
                  label={`${currentPage}/${totalPages}`}
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: "#fff8e1",
                    color: "#f25c05",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    border: "1px solid #ffb700",
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Banner phụ nếu có ít sản phẩm */}
        {products.length <= 3 && allPromotions.length > 1 && (
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px dashed rgba(255, 183, 0, 0.3)",
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {allPromotions
              .filter((p) => p.id !== promotion.id)
              .slice(0, 2)
              .map((promo) => (
                <Paper
                  key={promo.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    px: 2,
                    bgcolor: "rgba(255, 183, 0, 0.1)",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid rgba(255, 183, 0, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(255, 183, 0, 0.2)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <DiscountIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={600} color="#f25c05">
                    {promo.name}
                  </Typography>
                  <Chip
                    label={`-${Math.round(promo.discount * 100)}%`}
                    size="small"
                    sx={{
                      bgcolor: "#ffb700",
                      color: "#000",
                      height: 20,
                      fontSize: "0.6rem",
                    }}
                  />
                </Paper>
              ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default FlashSaleSlider;