// components/product/ProductGrid.tsx
"use client";

import { Grid, Box, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          bgcolor: "#fafafa",
          borderRadius: 4,
          border: "2px dashed #ffb700",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          😢 Không tìm thấy sản phẩm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng thử lại với bộ lọc khác
        </Typography>
      </Box>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid
            key={product.id}
            size={{ xs: 6, sm: 4, md: 3, lg: 3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.25,
                delay: Math.min(index * 0.04, 0.2),
                ease: "easeOut",
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ProductCard product={product} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimatePresence>
  );
}
