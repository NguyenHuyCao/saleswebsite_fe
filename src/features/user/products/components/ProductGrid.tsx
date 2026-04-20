"use client";

import { Grid, Box } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes prodFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
            <Box
              style={{
                animation: "prodFadeIn 0.25s ease forwards",
                animationDelay: `${Math.min(index * 0.04, 0.18)}s`,
                opacity: 0,
                height: "100%",
              }}
            >
              <ProductCard product={product} priority={index < 4} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
