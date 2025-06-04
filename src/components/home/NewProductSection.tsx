"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard, { Product } from "../product/ProductCard";
import { useRouter } from "next/navigation";

const NewProductSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const router = useRouter();

  const checkScroll = () => {
    const el = containerRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

  const fetchNewProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        "http://localhost:8080/api/v1/products?sort=createdAt,desc",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      const data = json?.data?.result || [];
      const now = new Date();
      const mapped = data.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const status =
          item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [];

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status,
          sale: item.price !== item.pricePerUnit,
          inStock: item.active === true,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          rating: item.rating || 0,
          createdAt: item.createdAt,
          stockQuantity: item.stockQuantity,
          totalStock: item.totalStock,
          slug: item.slug,
          isFavorite: item.wishListUser === true, 
        };
      });
      setProducts(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm mới:", err);
    }
  };

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  useEffect(() => {
    fetchNewProducts();
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

  const handleProductClick = (slug: string) => {
    router.push(`/product/detail?name=${slug}`);
  };

  return (
    <Box sx={{ position: "relative", px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SẢN PHẨM <span style={{ color: "#ffb700" }}>MỚI</span>
      </Typography>

      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            transform: "translateY(-50%)",
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
          "&::-webkit-scrollbar": { display: "none" },
          scrollSnapType: "x mandatory",
          px: 5,
        }}
      >
        {products.map((product, index) => (
          <Box
            key={index}
            sx={{
              width: 250,
              scrollSnapAlign: "start",
              flexShrink: 0,
              position: "relative",
            }}
            onClick={() => handleProductClick(product.slug)}
          >
            <ProductCard
              product={product}
              isFavorite={product.isFavorite}
              onToggleFavorite={() => toggleWishlist(product.id)}
            />
          </Box>
        ))}
      </Box>

      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            transform: "translateY(-50%)",
            "&:hover": { bgcolor: "#ffb700" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default NewProductSection;
