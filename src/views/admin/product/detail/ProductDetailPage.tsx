"use client";

import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

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

const ProductDetailPage = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setProduct({
            ...data.data,
            imageAvt: "/images/favicon.png",
            imageDetail1: "/images/favicon.png",
            imageDetail2: "/images/favicon.png",
            imageDetail3: "/images/favicon.png",
          });
        }
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  if (!product) return <Typography>Đang tải dữ liệu...</Typography>;

  const detailImages = [
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((img) => !!img);

  return (
    <Paper sx={{ p: 6 }} elevation={4}>
      <Typography variant="h5" fontWeight={550} mb={4}>
        Thông tin sản phẩm
      </Typography>

      <Box display="flex" gap={3} mb={4} flexWrap="wrap">
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            width: 150,
            height: 150,
            position: "relative",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Image
            src={product.imageAvt}
            alt="Ảnh đại diện"
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap">
          {detailImages.map((img: string, i: number) => (
            <Box
              key={i}
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                width: 80,
                height: 80,
                border: `1px solid ${theme.palette.divider}`,
                position: "relative",
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
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={4}
        justifyContent="space-between"
      >
        <ReadOnlyInput label="Tên sản phẩm" value={product.name} />
        <ReadOnlyInput
          label="Giá"
          value={`${product.price.toLocaleString()}₫`}
        />
        <ReadOnlyInput label="Tồn kho" value={product.stockQuantity} />
        <ReadOnlyInput label="Công suất" value={product.power} />
        <ReadOnlyInput label="Loại động cơ" value={product.engineType} />
        <ReadOnlyInput label="Nhiên liệu" value={product.fuelType} />
        <ReadOnlyInput label="Trọng lượng" value={`${product.weight}g`} />
        <ReadOnlyInput label="Kích thước" value={product.dimensions} />
        <ReadOnlyInput label="Dung tích" value={`${product.tankCapacity}L`} />
        <ReadOnlyInput label="Thương hiệu" value={product.brand.name} />
        <ReadOnlyInput label="Danh mục" value={product.productCategory.name} />
        <ReadOnlyInput label="Xuất xứ" value={product.origin} />
        <ReadOnlyInput
          label="Bảo hành"
          value={`${product.warrantyMonths} tháng`}
        />
        <Box flexBasis={{ xs: "100%", sm: "48%", md: "32%" }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.secondary"
            gutterBottom
          >
            Trạng thái
          </Typography>
          <Chip
            label={product.active ? "Đang hoạt động" : "Ngừng hoạt động"}
            color={product.active ? "success" : "default"}
            variant="filled"
            sx={{ fontWeight: 600, px: 2, py: 0.5, fontSize: 13 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h6" mb={1.5} fontWeight={700}>
        Mô tả sản phẩm
      </Typography>
      <TextField
        fullWidth
        multiline
        value={product.description}
        minRows={5}
        InputProps={{ readOnly: true }}
      />
    </Paper>
  );
};

export default ProductDetailPage;
