"use client";

import React, { useEffect, useState } from "react";
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
import ProductCard from "@/features/user/products/components/ProductCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import deepEqual from "fast-deep-equal";
import { motion } from "framer-motion";
import type { CategoryWithProducts } from "@/features/user/home/types";

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
      products: cat.products.map((item) => {
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
        };
      }),
    }));

    if (!deepEqual(updated, categoryProducts)) {
      setCategoryProducts(updated);
    }
  }, [categories]);

  const activeCategory = categoryProducts[activeIndex];

  return (
    <Box sx={{ py: 3, px: isMobile ? 2 : 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{
          position: "relative",
          display: "inline-block",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            bgcolor: "#ffb700",
            borderRadius: 2,
          },
        }}
      >
        DỤNG CỤ <span style={{ color: "#ffb700" }}>KHÁC</span>
      </Typography>

      <Box
        mb={3}
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
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
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard
                  product={product}
                  mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${activeCategory?.slug}`}
                />
              </motion.div>
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
