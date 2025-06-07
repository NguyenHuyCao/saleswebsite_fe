// Modified FlashSaleSlider.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductCard, { Product } from "../product/ProductCard";
import { useRouter } from "next/navigation";
import CountdownPromotion from "./CountdownPromotion";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const checkScroll = () => {
    const el = containerRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

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
      const mapped = data?.data?.map((item: any) => {
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
        } as Product;
      });

      setProducts(mapped);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
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
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const renderBanner = (pos: "left" | "right") => {
    const banners = allPromotions.filter((p) => p.id !== promotion.id);
    const banner = pos === "left" ? banners[0] : banners[1];
    if (!banner) return null;
    return (
      <Paper
        elevation={4}
        sx={{
          minWidth: 160,
          maxWidth: 180,
          mx: 1,
          p: 2,
          bgcolor: "#fff8e1",
          borderRadius: 2,
          display: { xs: "none", sm: "block" },
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
    );
  };

  return (
    <>
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
          🎁 {promotion.name} - GIẢM ĐẾN {Math.round(promotion.discount * 100)}%
        </Paper>
      </Box>

      <Box
        ref={wrapperRef}
        sx={{
          position: "relative",
          px: isMobile ? 1 : 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {products.length <= 3 && renderBanner("left")}

        {showLeft && !isMobile && products.length > 3 && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              zIndex: 15,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffb700" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {showRight && !isMobile && products.length > 3 && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 15,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffb700" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            overflowX: products.length > 3 ? "auto" : "hidden",
            justifyContent: products.length <= 3 ? "center" : "flex-start",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            gap: 1,
            scrollSnapType: "x mandatory",
            px: 3,
            flexWrap: products.length <= 3 ? "wrap" : "nowrap",
          }}
        >
          {products?.map((product, idx) => (
            <Box
              key={idx}
              sx={{
                scrollSnapAlign: "start",
                flex: "0 0 auto",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() =>
                router.push(`/product/detail?name=${product.slug}`)
              }
            >
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
                    toggleWishlist(product.id!);
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
                      <FavoriteIcon
                        sx={{ color: "#f25c05" }}
                        fontSize="small"
                      />
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
                onToggleFavorite={() => toggleWishlist(product.id!)}
              />
            </Box>
          ))}
        </Box>

        {products.length <= 3 && renderBanner("right")}
      </Box>
    </>
  );
};

export default FlashSaleSlider;
