// wishlist/components/WishlistGrid.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Fade,
  Checkbox,
  Skeleton,
  Paper,
  Button,
  Chip,
  Alert,
  Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../products/components/ProductCard";
import { useWishlist, WISHLIST_QUERY_KEY } from "../queries";
import { useWishlistBulk } from "../hooks/useWishlistBulk";
import EmptyState from "./EmptyState";

const ITEMS_PER_PAGE = 12;

const WishlistGrid = () => {
  const { data: items = [], isLoading } = useWishlist();
  const { selectedItems, toggleSelectItem } = useWishlistBulk();
  const [page, setPage] = useState(1);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const displayed = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [page, items]);

  // Reset page khi items thay đổi
  useEffect(() => {
    setPage(1);
  }, [items.length]);

  if (isLoading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Đang tải danh sách...
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={2}
        >
          {[...Array(10)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={320}
              sx={{ borderRadius: 3 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Results count và thông tin */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" color="text.secondary">
          Hiển thị {displayed.length} / {items.length} sản phẩm
        </Typography>

        <Chip
          label={`Đã chọn ${selectedItems.size}`}
          color={selectedItems.size > 0 ? "warning" : "default"}
          size="small"
        />
      </Stack>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={2}
            sx={{
              "& .product-card": {
                position: "relative",
                "&:hover .product-checkbox": {
                  opacity: 1,
                },
              },
            }}
          >
            {displayed.map((product) => (
              <Box key={product.id} className="product-card">
                {/* Checkbox với animation */}
                <motion.div
                  className="product-checkbox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: selectedItems.has(product.id) ? 1 : 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 3,
                  }}
                >
                  <Checkbox
                    checked={selectedItems.has(product.id)}
                    onChange={() => toggleSelectItem(product.id)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: "#fff" },
                    }}
                  />
                </motion.div>

                {/* Product Card */}
                <ProductCard
                  product={product}
                  mutateKey={WISHLIST_QUERY_KEY}
                  hideWishlistButton // Ẩn nút wishlist vì đã trong wishlist
                />

                {/* Sale Badge */}
                {product.sale && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      label="Giảm giá"
                      size="small"
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  </motion.div>
                )}
              </Box>
            ))}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box mt={5} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            shape="rounded"
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  bgcolor: "#f25c05",
                  color: "#fff",
                  "&:hover": { bgcolor: "#e64a19" },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default WishlistGrid;
