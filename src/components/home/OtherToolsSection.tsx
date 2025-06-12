"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ProductCard, { Product } from "../product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import deepEqual from "fast-deep-equal";

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
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<
    CategoryWithProducts[]
  >([]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const updated = categories.map((cat) => ({
      ...cat,
      products: cat.products.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const isInStock = item.inStock === true && item.stockQuantity > 0;

        return {
          ...item,
          status:
            item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
          sale: item.price !== item.pricePerUnit,
          inStock: isInStock,
          label: isInStock ? "Thêm vào giỏ" : "Hết hàng",
          favorite: favoriteIdSet.has(item.id),
        };
      }),
    }));

    if (!deepEqual(updated, categoryProducts)) {
      setCategoryProducts(updated);
    }
  }, [categories, favoriteIdSet]);

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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      dispatch(fetchWishlist());
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  const activeCategory = categoryProducts[activeIndex];

  return (
    <Box sx={{ py: 4, px: isMobile ? 2 : 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        DỤNG CỤ <span style={{ color: "#ffb700" }}>KHÁC</span>
      </Typography>

      <Box
        mb={3}
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
      >
        {categoryProducts.map((cat, idx) => (
          <Button
            key={cat.id}
            variant={idx === activeIndex ? "contained" : "outlined"}
            onClick={() => setActiveIndex(idx)}
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

      <Fade in timeout={500} key={activeCategory?.id}>
        <Grid container spacing={2} justifyContent={"center"}>
          {activeCategory?.products?.map((product) => (
            <Grid
              key={product.id}
              size={{ xs: 6, sm: 4, md: 3, lg: 2.4 as any }}
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
      </Fade>

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
