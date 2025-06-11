"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductCard, { Product } from "../product/ProductCard";
import { useRouter } from "next/navigation";
import CountdownPromotion from "./CountdownPromotion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
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

type FlashSaleSliderProps = {
  promotion: Promotion;
  allPromotions?: Promotion[];
};

const FlashSaleSlider: React.FC<FlashSaleSliderProps> = ({
  promotion,
  allPromotions = [],
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);

  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems]
  );

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8080/api/v1/promotions/${promotion.id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      const now = new Date();
      const mapped = data?.data?.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const isHot = item.totalStock - item.stockQuantity > 10;
        const status = [];
        if (isNew) status.push("Mới");
        if (isHot) status.push("Bán chạy");

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status,
          sale: item.pricePerUnit < item.price,
          inStock: item.stockQuantity > 0,
          label: item.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng",
          rating: item.rating || 0,
          slug: item.slug,
          totalStock: item.totalStock,
          stockQuantity: item.stockQuantity,
          createdAt: item.createdAt,
          isFavorite: favoriteIdSet.has(item.id),
        };
      });
      setProducts(mapped);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thao tác yêu thích.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", String(productId));
      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      dispatch(fetchWishlist());
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [promotion.id, favoriteIdSet]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: isMobile ? 1 : 2,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const renderBanner = (pos: "left" | "right") => {
    const banners = allPromotions.filter((p) => p.id !== promotion.id);
    const banner = pos === "left" ? banners[0] : banners[1];

    if (products.length > 3 || !banner) return <Box />;

    return (
      <Box
        px={1}
        display={{ xs: "none", sm: "flex" }}
        alignItems="center"
        justifyContent="center"
        sx={{ ml: 1.7, mt: 5 }}
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
          🏱 {promotion.name} - GIẢM ĐẾN {Math.round(promotion.discount * 100)}%
        </Paper>
      </Box>

      <Box flex={1}>
        <Slider {...settings} className="flash-sale-slider">
          {products.length <= 3 && renderBanner("left")}
          {products.map((product, index) => (
            <Box key={index} px={1}>
              <ProductCard
                product={product}
                isFavorite={product.isFavorite}
                onToggleFavorite={() => toggleWishlist(product.id)}
              />
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
