// Modified FlashSaleSlider.tsx using react-slick
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductCard, { Product } from "../product/ProductCard";
import { useRouter } from "next/navigation";
import CountdownPromotion from "./CountdownPromotion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
          isFavorite: item.wishListUser === true,
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

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );

    try {
      const formData = new FormData();
      formData.append("productId", String(productId));
      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <CountdownPromotion
        deadline={new Date(promotion.endDate).toISOString()}
      />

      <Typography
        variant="h6"
        textAlign="center"
        fontWeight={700}
        mb={2}
        color="orange"
      >
        🎁 {promotion.name} - Giảm đến {Math.round(promotion.discount * 100)}%
      </Typography>

      <Slider {...settings}>
        {products.map((product, index) => (
          <Box key={index} px={1} position="relative">
            <Tooltip title="Yêu thích">
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 5,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "white",
                    borderRadius: "50%",
                    boxShadow: 1,
                    width: 32,
                    height: 32,
                    "&:hover": { bgcolor: "#ffe0b2" },
                  }}
                >
                  {product.isFavorite ? (
                    <FavoriteIcon sx={{ color: "#f25c05" }} fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{ color: "#f25c05" }}
                      fontSize="small"
                    />
                  )}
                </IconButton>
              </Box>
            </Tooltip>

            <ProductCard
              product={product}
              isFavorite={product.isFavorite}
              onToggleFavorite={() => toggleWishlist(product.id)}
            />
          </Box>
        ))}
      </Slider>

      {isMobile && products.length > 2 && (
        <Typography
          fontSize={13}
          color="gray"
          textAlign="center"
          mt={1}
          sx={{ fontStyle: "italic" }}
        >
          Vuốt để xem thêm sản phẩm ➔
        </Typography>
      )}
    </Box>
  );
};

export default FlashSaleSlider;
