"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
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
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8080/api/v1/wish_list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        const favIds = json?.data?.result?.map((item: any) => item.id) || [];
        setFavoriteIds(favIds);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm yêu thích:", err);
      }
    };

    fetchFavoriteProducts();
  }, []);

  useEffect(() => {
    const now = new Date();
    const updated = categories.map((cat) => ({
      ...cat,
      products: cat.products.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const status =
          item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [];
        return {
          ...item,
          status,
          sale: item.price !== item.pricePerUnit,
          inStock: item.active === true,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          favorite: favoriteIds.includes(item.id),
        };
      }),
    }));
    setCategoryProducts(updated);
  }, [categories, favoriteIds]);

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
    <Box sx={{ py: 4 }}>
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

      <Grid container spacing={2} px={2} justifyContent={"center"}>
        {activeCategory?.products?.map((product, index) => (
          <Grid
            size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}
            key={index}
            justifyContent="center"
          >
            <ProductCard
              product={product}
              isFavorite={product.favorite}
              onToggleFavorite={() => toggleWishlist(product.id)}
            />
          </Grid>
        ))}
      </Grid>

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
