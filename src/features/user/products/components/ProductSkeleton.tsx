// components/product/ProductSkeleton.tsx
import { Skeleton, Box, Grid } from "@mui/material";

export function ProductCardSkeleton() {
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
      <Skeleton variant="text" sx={{ mt: 1 }} />
      <Skeleton variant="text" width="60%" />
    </Box>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
