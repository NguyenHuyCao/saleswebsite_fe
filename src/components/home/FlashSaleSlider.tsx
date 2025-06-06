"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
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
};

const FlashSaleSlider: React.FC<FlashSaleSliderProps> = ({ promotion }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

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
      let res;
      if (token) {
        res = await fetch(
          `http://localhost:8080/api/v1/promotions/${promotion.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await fetch(
          `http://localhost:8080/api/v1/promotions/${promotion.id}`
        );
      }

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

  return (
    <>
      <CountdownPromotion
        deadline={new Date(promotion.endDate).toISOString()}
      />

      <Box textAlign="center" mb={5}>
        <Typography variant="subtitle1" color="text.secondary">
          {promotion.name} | Giảm đến {(promotion.discount * 100).toFixed(0)}% –
          tối đa {promotion.maxDiscount.toLocaleString()}₫
        </Typography>

        {promotion.requiresCode && promotion.code && (
          <Typography variant="body2" sx={{ mt: 1, color: "#dc2626" }}>
            🎁 Mã khuyến mãi: <b>{promotion.code}</b>
          </Typography>
        )}
      </Box>

      <Box sx={{ position: "relative", px: 2, textAlign: "center" }}>
        {showLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "45%",
              left: 0,
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffb700" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            justifyContent: "center",
            "&::-webkit-scrollbar": { display: "none" },
            gap: 1,
            px: 5,
            scrollSnapType: "x mandatory",
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

        {showRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "45%",
              right: 0,
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffb700" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default FlashSaleSlider;
