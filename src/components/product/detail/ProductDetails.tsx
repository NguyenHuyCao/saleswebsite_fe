"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  product: any;
  category: { name: string } | null;
}

export const ProductDetails = ({ product, category }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);

  console.log("product", product);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8080/api/v1/wish_list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const isInWishlist = data?.data?.result?.some(
          (entry: any) => entry.product.id === product.id
        );
        setIsFavorite(isInWishlist);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
      }
    };
    fetchWishlist();
  }, [product.id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }
    try {
      setIsFavorite((prev) => !prev);
      const formData = new FormData();
      formData.append("productId", String(product.id));
      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  return (
    <Box component={Paper} elevation={1} p={3} borderRadius={3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {product.name}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Thương hiệu:{" "}
        <Box component="span" color="warning.main" fontWeight={500}>
          {category?.name || "Không rõ"}
        </Box>{" "}
        | Loại: {product?.type || "--"} | Xuất xứ: {product.origin} | Công suất:{" "}
        {product.power}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" fontWeight={700} color="error.main" gutterBottom>
        {product.price > 0
          ? `${product.price.toLocaleString()}₫`
          : "Liên hệ báo giá"}
      </Typography>
      <Typography color="success.main" variant="body2" mb={2}>
        Còn hàng: {product.stockQuantity} sản phẩm
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            <b>Loại nhiên liệu:</b> {product.fuelType}
          </Typography>
          <Typography variant="body2">
            <b>Loại động cơ:</b> {product.engineType}
          </Typography>
          <Typography variant="body2">
            <b>Dung tích bình:</b> {product.tankCapacity}L
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            <b>Kích thước:</b> {product.dimensions}
          </Typography>
          <Typography variant="body2">
            <b>Trọng lượng:</b> {product.weight}g
          </Typography>
          <Typography variant="body2">
            <b>Bảo hành:</b>{" "}
            {product.warrantyMonths > 0
              ? `${product.warrantyMonths} tháng`
              : "Không có"}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          bgcolor: "#212121",
          color: "white",
          borderRadius: 1,
          px: 2,
          py: 1,
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
        }}
      >
        <span>Kết thúc còn:</span>
        <Typography variant="body2" fontWeight={400}>
          Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#ffc107",
          p: 1.5,
          borderRadius: 1,
          position: "relative",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 12,
            bgcolor: "white",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "75%",
              height: "100%",
              bgcolor: "#f44336",
              backgroundImage:
                "repeating-linear-gradient(45deg, #f44336 0, #f44336 10px, #ff9800 10px, #ff9800 20px)",
              borderRadius: 6,
              transition: "width 0.4s ease-in-out",
            }}
          />
        </Box>
        <Typography variant="body2" fontWeight={600} mt={1}>
          Đã bán 12
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" mt={3}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            overflow: "hidden",
            height: 40,
          }}
        >
          <IconButton size="small" sx={{ borderRadius: 0 }}>
            <Minus size={16} />
          </IconButton>
          <TextField
            size="small"
            value={1}
            sx={{
              width: 50,
              input: { textAlign: "center", py: 1 },
              "& fieldset": { border: "none" },
            }}
          />
          <IconButton size="small" sx={{ borderRadius: 0 }}>
            <Plus size={16} />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          color="warning"
          startIcon={<ShoppingCart size={18} />}
          sx={{ borderRadius: 3, px: 3, py: 1.5, fontWeight: 600 }}
        >
          Thêm vào giỏ
        </Button>

        <IconButton onClick={toggleFavorite}>
          <Heart fill={isFavorite ? "#f44336" : "none"} color="#f44336" />
        </IconButton>
      </Stack>
    </Box>
  );
};
