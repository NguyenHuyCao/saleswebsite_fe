// components/product/ProductGrid.tsx
"use client";

import { Grid, Box, Typography, Fade } from "@mui/material";
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
            size={{ xs: 6, sm: 4, md: 3 }}
            display="flex"
            justifyContent="center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{ width: "100%" }}
            >
              <Fade in timeout={300 + index * 50}>
                <Box sx={{ width: "100%", maxWidth: 260, mx: "auto" }}>
                  <ProductCard product={product} />
                </Box>
              </Fade>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimatePresence>
  );
}
