"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";

const product = {
  id: 1,
  name: "Máy xay cỏ",
  description:
    "Máy xay sinh tố công suất lớn, thiết kế hiện đại, dễ sử dụng và dễ vệ sinh.",
  price: 500000,
  stockQuantity: 100,
  power: "2000W",
  fuelType: "Điện",
  imageAvt: "/images/product/product.png",
  imageDetail1: "/images/product/product.png",
  imageDetail2: "/images/product/product.png",
  imageDetail3: "/images/product/product.png",
  engineType: "STEAM",
  weight: 1500,
  dimensions: "80x60x45 cm",
  tankCapacity: 60,
  origin: "Việt Nam",
  warrantyMonths: 24,
  slug: "may_xay_co",
  active: true,
  createdAt: "2025-05-20T11:54:02.448501Z",
  createdBy: "admin@gmail.com",
  updatedAt: "2025-05-21T15:44:32.566968Z",
  updatedBy: "admin@gmail.com",
  productCategory: {
    name: "Máy cắt cỏ adf",
  },
  brand: {
    name: "Máy cadf",
  },
};

const ProductDetailPage = () => {
  const theme = useTheme();
  const detailImages = [
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((img) => !!img);

  return (
    <Box p={4}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Typography
          variant="h4"
          fontWeight={800}
          mb={3}
          textAlign="center"
          sx={{ color: theme.palette.text.primary }}
        >
          📦 Chi tiết sản phẩm
        </Typography>

        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
            width: 140,
            height: 140,
            position: "relative",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Image
            src={product.imageAvt}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>

        {detailImages.length > 0 && (
          <Box
            display="flex"
            gap={2}
            mt={2.5}
            justifyContent="center"
            flexWrap="wrap"
          >
            {detailImages.map((img, i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  width: 70,
                  height: 70,
                  border: `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Image
                  src={img}
                  alt={`Chi tiết ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="space-between"
        >
          <ReadOnlyInput label="Tên sản phẩm" value={product.name} />
          <ReadOnlyInput
            label="Giá"
            value={`${product.price.toLocaleString()}₫`}
          />
          <ReadOnlyInput label="Số lượng tồn" value={product.stockQuantity} />
          <ReadOnlyInput label="Công suất" value={product.power} />
          <ReadOnlyInput label="Động cơ" value={product.engineType} />
          <ReadOnlyInput label="Nhiên liệu" value={product.fuelType} />
          <ReadOnlyInput label="Trọng lượng" value={`${product.weight}g`} />
          <ReadOnlyInput label="Kích thước" value={product.dimensions} />
          <ReadOnlyInput
            label="Dung tích bình"
            value={`${product.tankCapacity}L`}
          />
          <ReadOnlyInput label="Thương hiệu" value={product.brand.name} />
          <ReadOnlyInput
            label="Danh mục"
            value={product.productCategory.name}
          />
          <ReadOnlyInput label="Xuất xứ" value={product.origin} />
          <ReadOnlyInput
            label="Bảo hành"
            value={`${product.warrantyMonths} tháng`}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Mô tả sản phẩm
          </Typography>
          <TextField
            fullWidth
            multiline
            value={product.description}
            minRows={5}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

const ReadOnlyInput = ({ label, value }: { label: string; value: any }) => (
  <Box flexBasis={{ xs: "100%", sm: "48%", md: "32%" }}>
    <Typography
      variant="body2"
      fontWeight={600}
      color="text.secondary"
      gutterBottom
    >
      {label}
    </Typography>
    <TextField
      fullWidth
      size="small"
      value={value}
      InputProps={{ readOnly: true }}
    />
  </Box>
);

export default ProductDetailPage;
