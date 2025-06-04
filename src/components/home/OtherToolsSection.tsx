"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import ProductCard, { Product } from "../product/ProductCard";

export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  products: Product[];
};

interface OtherToolsSectionProps {
  categories: CategoryWithProducts[];
}

const OtherToolsSection: React.FC<OtherToolsSectionProps> = ({
  categories,
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<
    CategoryWithProducts[]
  >([]);

  useEffect(() => {
    // Đồng bộ favorite từ wishListUser nếu cần
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      products: cat.products.map(
        (item: any): Product => ({
          ...item,
          favorite: item.favorite || item.wishListUser === true,
        })
      ),
    }));
    setCategoryProducts(updatedCategories);
  }, [categories]);

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    setCategoryProducts((prev) =>
      prev.map((cat) => ({
        ...cat,
        products: cat.products.map((p) =>
          p.id === productId ? { ...p, favorite: !p.favorite } : p
        ),
      }))
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

  const handleCategoryClick = (index: number) => {
    setActiveIndex(index);
  };

  const activeCategory = categoryProducts[activeIndex];

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        DỤNG CỤ <span style={{ color: "#ffb700" }}>KHÁC</span>
      </Typography>

      <Box
        mb={3}
        display="flex"
        flexWrap="wrap"
        gap={1}
        px={5}
        justifyContent="center"
      >
        {categoryProducts.map((cat, idx) => (
          <Button
            key={cat.id}
            variant={idx === activeIndex ? "contained" : "outlined"}
            onClick={() => handleCategoryClick(idx)}
            sx={{
              bgcolor: idx === activeIndex ? "#ffb700" : "transparent",
              color: "black",
              borderColor: "#ffb700",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              "&:hover": {
                bgcolor: "#f25c05",
                borderColor: "#f25c05",
              },
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
        px={5}
      >
        {activeCategory?.products?.map((product, index) => (
          <Box
            key={index}
            sx={{ width: 230, position: "relative", cursor: "pointer" }}
            onClick={() => router.push(`/product/detail?name=${product.slug}`)}
          >
            <Stack
              direction="row"
              spacing={1}
              position="absolute"
              top={8}
              left={8}
              zIndex={2}
            >
              {product.createdAt &&
                (new Date().getTime() - new Date(product.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24) <=
                  30 && (
                  <Box
                    sx={{
                      bgcolor: "red",
                      color: "white",
                      fontSize: 12,
                      fontWeight: "bold",
                      px: 1,
                      borderRadius: 0.5,
                    }}
                  >
                    Mới
                  </Box>
                )}
              {product.totalStock - product.stockQuantity > 10 && (
                <Box
                  sx={{
                    bgcolor: "#ffb700",
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                    px: 1,
                    borderRadius: 0.5,
                  }}
                >
                  Bán chạy
                </Box>
              )}
            </Stack>
            <ProductCard
              product={product}
              isFavorite={product.favorite}
              onToggleFavorite={() => toggleWishlist(product.id)}
            />
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          onClick={() =>
            router.push(`/product?category=${activeCategory?.slug}`)
          }
          variant="outlined"
          sx={{
            borderColor: "#ffb700",
            color: "black",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#ffb700",
              color: "black",
              borderColor: "#f25c05",
            },
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
};

export default OtherToolsSection;
