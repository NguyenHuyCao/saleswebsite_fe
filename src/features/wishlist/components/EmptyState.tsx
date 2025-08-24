"use client";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const EmptyState = () => {
  const router = useRouter();
  return (
    <Box py={8} textAlign="center">
      <Typography color="text.secondary" mb={2}>
        Danh sách yêu thích của bạn hiện đang trống.
      </Typography>
      <Button
        variant="contained"
        color="warning"
        onClick={() => router.push("/products")}
      >
        Khám phá sản phẩm
      </Button>
    </Box>
  );
};
export default EmptyState;
