"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductCard, { Product } from "../product/ProductCard";

const FlashSaleSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]); // product IDs

  const checkScroll = () => {
    const el = containerRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/products");
      const data = await res.json();
      const now = new Date();
      const mapped = data?.data?.result.map((item: any) => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const isHot = item.totalStock - item.stockQuantity > 10;
        const status = [];
        if (isNew) status.push("Mới");
        if (isHot) status.push("Bán chạy");

        if (item.wishListUser) setWishlist((prev) => [...prev, item.id]);

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
        };
      });
      setProducts(mapped);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    // Tối ưu UX: cập nhật ngay UI
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
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
        {products.map((product, idx) => (
          <Box
            key={idx}
            sx={{
              scrollSnapAlign: "start",
              flex: "0 0 auto",
              position: "relative",
            }}
          >
            <Tooltip title="Yêu thích">
              <IconButton
                onClick={() => toggleWishlist(product.id!)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "white",
                  borderRadius: "50%",
                  zIndex: 5,
                  boxShadow: 1,
                }}
              >
                {wishlist.includes(product.id!) ? (
                  <FavoriteIcon sx={{ color: "#f25c05" }} fontSize="small" />
                ) : (
                  <FavoriteBorderIcon
                    sx={{ color: "#f25c05" }}
                    fontSize="small"
                  />
                )}
              </IconButton>
            </Tooltip>

            <ProductCard product={product} />
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
  );
};

export default FlashSaleSlider;
