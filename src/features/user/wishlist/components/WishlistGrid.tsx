"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography, Pagination, Fade } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "@/views/product/ProductCard";
import { useWishlist, WISHLIST_QUERY_KEY } from "../queries";

const ITEMS_PER_PAGE = 15;

const WishlistGrid = () => {
  const { data: items = [], isLoading } = useWishlist();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  const displayed = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [page, items]);

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

      {isLoading ? (
        <Fade in>
          <Typography textAlign="center" color="text.secondary">
            Đang tải...
          </Typography>
        </Fade>
      ) : items.length === 0 ? (
        <Fade in timeout={300}>
          <Box textAlign="center" color="text.secondary">
            Danh sách yêu thích của bạn hiện đang trống.
          </Box>
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
            {displayed.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} mutateKey={WISHLIST_QUERY_KEY} />
              </motion.div>
            ))}
          </Box>

          {pageCount > 1 && (
            <Box mt={5} display="flex" justifyContent="center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, p) => setPage(p)}
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

export default WishlistGrid;
