"use client";

import { Box, Typography, Grid } from "@mui/material";
import WishlistItemCard from "./WishlistItemCard";

const wishlistItems: Product[] = [
  {
    id: "1",
    name: "Máy cưa cầm tay Makita 1800W",
    image: "/images/product/images.jpeg",
    inStock: true,
  },
  {
    id: "2",
    name: "Máy phát cỏ Honda GX35",
    image: "/images/product/images.jpeg",
    inStock: false,
  },
  {
    id: "3",
    name: "Máy khoan cầm tay Bosch GSB 550",
    image: "/images/product/images.jpeg",
    inStock: true,
  },
];

const WishlistPage = () => {
  return (
    <Box mt={6}>
      {wishlistItems.length === 0 ? (
        <Typography textAlign="center">
          Danh sách yêu thích của bạn trống.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {wishlistItems.map((product) => (
            <Grid size={{ xs: 12, md: 6 }} key={product.id}>
              <WishlistItemCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WishlistPage;
