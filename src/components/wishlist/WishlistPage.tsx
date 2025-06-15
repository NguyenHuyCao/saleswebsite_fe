"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Pagination,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductCard from "@/components/product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 15;

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const allItems: Product[] = useMemo(() => {
    const now = new Date();
    return wishlistItems.map((item: any) => {
      const createdAt = new Date(item.createdAt);
      const isNew =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
      const isHot = item.totalStock - item.stockQuantity > 10;
      const status = [];
      if (isNew) status.push("Mới");
      if (isHot) status.push("Bán chạy");

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        imageAvt: item.imageAvt,
        imageDetail1: item.imageDetail1 || "",
        imageDetail2: item.imageDetail2 || "",
        imageDetail3: item.imageDetail3 || "",
        price: item.pricePerUnit,
        pricePerUnit: item.pricePerUnit,
        originalPrice: item.price,
        sale: item.pricePerUnit < item.price,
        inStock: item.stockQuantity > 0,
        label: item.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng",
        description: item.description || "",
        stockQuantity: item.stockQuantity,
        totalStock: item.totalStock,
        power: item.power || "N/A",
        fuelType: item.fuelType || "N/A",
        engineType: item.engineType || "N/A",
        weight: item.weight || 0,
        dimensions: item.dimensions || "",
        tankCapacity: item.tankCapacity || 0,
        origin: item.origin || "Không rõ",
        warrantyMonths: item.warrantyMonths || 0,
        createdAt: item.createdAt,
        createdBy: item.createdBy || "",
        updatedAt: item.updatedAt || null,
        updatedBy: item.updatedBy || "",
        rating: item.rating || 0,
        status,
        favorite: true,
      };
    });
  }, [wishlistItems]);

  const pageCount = Math.ceil(allItems.length / ITEMS_PER_PAGE);

  const displayedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return allItems.slice(start, start + ITEMS_PER_PAGE);
  }, [page, allItems]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <Box mt={6} mb={10} px={{ xs: 2, sm: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          DANH SÁCH <span style={{ color: "#ffb700" }}>YÊU THÍCH</span>
        </Typography>
      </motion.div>

      {allItems.length === 0 ? (
        <Fade in timeout={300}>
          <Typography textAlign="center" color="text.secondary">
            Danh sách yêu thích của bạn hiện đang trống.
          </Typography>
        </Fade>
      ) : (
        <>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={2}
            rowGap={4}
          >
            {displayedItems.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </Box>

          {pageCount > 1 && (
            <Box mt={5} display="flex" justifyContent="center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default WishlistPage;
