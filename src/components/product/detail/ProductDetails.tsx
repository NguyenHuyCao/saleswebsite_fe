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

export const ProductDetails = () => (
  <Box component={Paper} elevation={1} p={3} borderRadius={3}>
    <Typography variant="h5" fontWeight={700} gutterBottom>
      Máy xay cỏ
    </Typography>

    <Typography variant="body2" color="text.secondary" mb={1.5}>
      Thương hiệu:{" "}
      <Box component="span" color="warning.main" fontWeight={500}>
        Máy cadf
      </Box>{" "}
      | Loại: Máy cắt cỏ adf | Xuất xứ: Việt Nam | Công suất: 20000W
    </Typography>

    <Divider sx={{ my: 2 }} />

    <Typography variant="h4" fontWeight={700} color="error.main" gutterBottom>
      Liên hệ báo giá
    </Typography>
    <Typography color="success.main" variant="body2" mb={2}>
      Còn hàng: 92 sản phẩm
    </Typography>

    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2">
          <b>Loại nhiên liệu:</b> Điện
        </Typography>
        <Typography variant="body2">
          <b>Loại động cơ:</b> STEAM
        </Typography>
        <Typography variant="body2">
          <b>Dung tích bình:</b> 60L
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2">
          <b>Kích thước:</b> 80x60x45 cm
        </Typography>
        <Typography variant="body2">
          <b>Trọng lượng:</b> 1500g
        </Typography>
        <Typography variant="body2">
          <b>Bảo hành:</b> Không có
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

      <IconButton>
        <Heart color="#f44336" />
      </IconButton>
    </Stack>
  </Box>
);
