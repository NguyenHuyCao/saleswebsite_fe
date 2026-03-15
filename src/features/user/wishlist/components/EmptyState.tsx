// wishlist/components/EmptyState.tsx
"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showButton?: boolean;
}

const EmptyState = ({
  title = "Danh sách yêu thích của bạn đang trống",
  description = "Hãy thêm sản phẩm bạn yêu thích để theo dõi giá và đặt mua nhanh chóng!",
  showButton = true,
}: EmptyStateProps) => {
  const router = useRouter();

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        bgcolor: "#fafafa",
        borderRadius: 4,
        border: "2px dashed #ffb700",
        mt: 4,
      }}
    >
      <FavoriteIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {showButton && (
        <Button
          variant="contained"
          startIcon={<ShoppingBagIcon />}
          onClick={() => router.push("/products")}
          sx={{ bgcolor: "#f25c05" }}
        >
          Khám phá sản phẩm
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
