"use client";

import React, { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import {
  Box,
  Typography,
  Paper,
  Fade,
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// IMPORT type Promotion từ file types thay vì định nghĩa lại
import type { Promotion } from "../types";

// Product type (giữ nguyên)
type Product = {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  imageDetail1?: string;
  imageDetail2?: string;
  imageDetail3?: string;
  description?: string;
  price: number;
  pricePerUnit: number;
  originalPrice: number;
  sale: boolean;
  inStock: boolean;
  label: string;
  stockQuantity: number;
  totalStock: number;
  power?: string;
  fuelType?: string;
  engineType?: string;
  weight?: number;
  dimensions?: string;
  tankCapacity?: number;
  origin?: string;
  warrantyMonths?: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  rating?: number;
  status: string[];
  favorite?: boolean;
};

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
// Mapper chuẩn hoá Product (giữ nguyên)
function mapProduct(item: any, nowMs: number): Product {
  const createdAtMs = new Date(item.createdAt).getTime();
  const isNew = (nowMs - createdAtMs) / (1000 * 60 * 60 * 24) <= 30;
  const sold = (item.totalStock ?? 0) - (item.stockQuantity ?? 0);
  const isHot = sold > 10;

  const currentPrice = item?.pricePerUnit ?? item?.price ?? 0;
  const originalPrice = item?.price ?? currentPrice;

  const status: string[] = [];
  if (isNew) status.push("Mới");
  if (isHot) status.push("Bán chạy");
  if ((item.stockQuantity ?? 0) === 0)
    status.splice(0, status.length, "Hết hàng");

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    imageAvt: item.imageAvt,
    imageDetail1: item.imageDetail1 || "",
    imageDetail2: item.imageDetail2 || "",
    imageDetail3: item.imageDetail3 || "",
    description: item.description || "",
    price: currentPrice,
    pricePerUnit: currentPrice,
    originalPrice,
    sale: currentPrice < originalPrice,
    inStock: (item.stockQuantity ?? 0) > 0,
    label: (item.stockQuantity ?? 0) > 0 ? "Thêm vào giỏ" : "Hết hàng",
    stockQuantity: item.stockQuantity ?? 0,
    totalStock: item.totalStock ?? 0,
    power: item.power || "N/A",
    fuelType: item.fuelType || "N/A",
    engineType: item.engineType || "N/A",
    weight: item.weight || 0,
    dimensions: item.dimensions || "",
    tankCapacity: item.tankCapacity || 0,
    origin: item.origin || "Không rõ",
    warrantyMonths: item.warrantyMonths || 0,
    createdAt: item.createdAt,
    createdBy: item.createdBy || "",
    updatedAt: item.updatedAt || null,
    updatedBy: item.updatedBy || null,
    rating: item.rating || 0,
    status,
    favorite: item.wishListUser === true,
  };
}

// Fetcher (giữ nguyên)
const fetcher = async (path: string): Promise<Product[]> => {
  try {
    const payload = await api.get<any>(path);
    const raw: any[] = Array.isArray(payload)
      ? payload
      : (payload?.result ?? payload?.items ?? payload?.data ?? []);

    const nowMs = Date.now();
    return raw.map((item: any) => mapProduct(item, nowMs));
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

  const swrKey = `/api/v1/promotions/${promotion.id}/products`;
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

  const isExpired = Date.now() > new Date(promotion.endDate).getTime();
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

  // Tính phần trăm giảm giá
  const discountPercent = Math.round(promotion.discount * 100);

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={{
                      ...product,
                      originalPrice: product.price,
                      price: Math.round(
                        product.price * (1 - promotion.discount),
                      ),
                      sale: true,
                    }}
                    mutateKey={swrKey}
                  />
                </motion.div>
              </Box>
            ))}
          </Slider>

          {/* Hint kéo tay cho mobile */}
          {isMobile && products.length > slidesToShow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 2,
                  color: "#ffb700",
                  fontStyle: "italic",
                  animation: "slideHint 1.5s infinite",
                  "@keyframes slideHint": {
                    "0%": { transform: "translateX(0)" },
                    "50%": { transform: "translateX(-8px)" },
                    "100%": { transform: "translateX(0)" },
                  },
                }}
              >
                ← Kéo để xem thêm →
              </Typography>
            </motion.div>
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

                      {/* Hiệu ứng glow cho dot active */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.2 }}
                          animate={{ scale: 1.2, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#f25c05",
                            zIndex: -1,
                          }}
                        />
                      )}
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
};;;;;;

export default FlashSaleSlider;