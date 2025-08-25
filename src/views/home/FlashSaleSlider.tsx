"use client";

import React from "react";
import useSWR from "swr";
import {
  Box,
  Typography,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import ProductCard from "../product/ProductCard";
import CountdownPromotion from "./CountdownPromotion";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

export type Promotion = {
  id: number;
  name: string;
  code: string | null;
  discount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  requiresCode: boolean;
};

const fetcher = async (url: string): Promise<Product[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  const now = new Date();

  return (data?.data || []).map((item: any): Product => {
    const createdAt = new Date(item.createdAt);
    const isNew =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
    const isHot = item.totalStock - item.stockQuantity > 10;
    const status = [];
    if (isNew) status.push("Mới");
    if (isHot) status.push("Bán chạy");

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      imageAvt: item.imageAvt,
      imageDetail1: item.imageDetail1,
      imageDetail2: item.imageDetail2,
      imageDetail3: item.imageDetail3,
      description: item.description,
      price: item.pricePerUnit,
      pricePerUnit: item.pricePerUnit,
      originalPrice: item.price,
      sale: item.pricePerUnit < item.price,
      inStock: item.stockQuantity > 0,
      label: item.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng",
      stockQuantity: item.stockQuantity,
      totalStock: item.totalStock,
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
  });
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
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const { data: products = [], mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/${promotion.id}`,
    fetcher
  );

  React.useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const isExpired = new Date() > new Date(promotion.endDate);
  if (isExpired) return null;

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: isMobile ? 1 : 2,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  const renderBanner = (pos: "left" | "right") => {
    const banners = allPromotions.filter((p) => p.id !== promotion.id);
    const banner = pos === "left" ? banners[0] : banners[1];
    if (!isTabletOrLarger || !banner || products.length > 3) return null;

    return (
      <Fade in timeout={600}>
        <Box
          px={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 5 }}
        >
          <Paper
            elevation={3}
            sx={{
              minWidth: 160,
              maxWidth: 180,
              p: 2,
              bgcolor: "#fff8e1",
              borderRadius: 2,
              textAlign: "center",
              animation: "zoomIn 0.4s ease-in-out",
              "@keyframes zoomIn": {
                from: { transform: "scale(0.9)", opacity: 0 },
                to: { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <Typography variant="subtitle2" color="#e65100" fontWeight={700}>
              🎊 {banner.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Giảm đến {(banner.discount * 100).toFixed(0)}% <br />
              Tối đa {banner.maxDiscount.toLocaleString()}₫
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  };

  const renderScrollHint = () => {
    if (!isMobile || products.length <= 2) return null;
    return (
      <Fade in timeout={600}>
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            color: "text.secondary",
            fontStyle: "italic",
            textAlign: "center",
            animation: "slideLeft 1.5s infinite",
            "@keyframes slideLeft": {
              from: { transform: "translateX(0px)" },
              to: { transform: "translateX(-10px)" },
            },
          }}
        >
          🖐 Kéo sang để xem thêm sản phẩm hấp dẫn!
        </Typography>
      </Fade>
    );
  };

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <CountdownPromotion
        deadline={new Date(promotion.endDate).toISOString()}
      />

      <Box textAlign="center" mt={-2} mb={2}>
        <Paper
          elevation={3}
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          sx={{
            display: "inline-block",
            px: 4,
            py: 1.5,
            background: "linear-gradient(to right, #facc15, #f59e0b)",
            borderRadius: "50px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            animation: "bounce 1s infinite alternate",
            "@keyframes bounce": {
              from: { transform: "translateY(0px)" },
              to: { transform: "translateY(-4px)" },
            },
          }}
        >
          🍱 {promotion.name} - GIẢM ĐẾN {Math.round(promotion.discount * 100)}%
        </Paper>
      </Box>

      <Box>
        <Slider {...settings} className="flash-sale-slider">
          {products.length <= 3 && renderBanner("left")}
          {products.map((product, index) => (
            <Box key={product.id} px={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/${promotion.id}`}
                />
              </motion.div>
            </Box>
          ))}
          {products.length <= 3 && renderBanner("right")}
        </Slider>

        {renderScrollHint()}
      </Box>
    </Box>
  );
};

export default FlashSaleSlider;
