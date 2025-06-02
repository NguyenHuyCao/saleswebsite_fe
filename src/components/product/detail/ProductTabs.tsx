"use client";

import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  imageAvt: string | null;
  stockQuantity: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface ProductTabsProps {
  product: Product;
  category: Category | null;
}

const tabLabels = [
  "Mô tả sản phẩm",
  "Hướng dẫn mua hàng",
  "Chính sách bảo hành và bảo trì",
];

export const ProductTabs = ({ product, category }: ProductTabsProps) => {
  const [value, setValue] = useState(0);
  const suggestions =
    category?.products.filter((p) => p.slug !== product.slug) || [];

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <Box flex={1}>
          <Tabs
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: value === index ? "#000" : "#888",
                  borderBottom: value === index ? "3px solid #ffc107" : "none",
                  transition: "all 0.3s",
                  px: 3,
                }}
              />
            ))}
          </Tabs>

          <Box mt={2}>
            {value === 0 && (
              <Typography paragraph>
                {product.description || "Chưa có mô tả."}
              </Typography>
            )}
            {value === 1 && (
              <Box>
                {[1, 2, 3, 4, 5].map((step) => (
                  <Typography paragraph key={step}>
                    <strong>Bước {step}:</strong> Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit.
                  </Typography>
                ))}
              </Box>
            )}
            {value === 2 && (
              <Box>
                <Typography paragraph>
                  <b>1. BẢO HÀNH</b>
                </Typography>
                <Typography paragraph>
                  Sản phẩm được bảo hành miễn phí nếu còn thời hạn bảo hành tính
                  từ ngày giao hàng.
                </Typography>
                <Typography paragraph>
                  <b>1.2 Trường hợp không được bảo hành:</b>
                </Typography>
                <Typography paragraph>
                  - Hết hạn hoặc mất phiếu bảo hành.
                </Typography>
                <Typography paragraph>
                  <b>2. BẢO TRÌ</b>
                </Typography>
                <Typography paragraph>
                  Vệ sinh, sửa chữa nhỏ miễn phí theo chính sách.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            width: 300,
            display: { xs: "none", md: "block" },
            borderLeft: "1px solid #eee",
            pl: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="warning.main" mb={2}>
            CÓ THỂ{" "}
            <Box component="span" color="primary.main">
              BẠN THÍCH
            </Box>
          </Typography>
          {suggestions.map((item) => (
            <Box key={item.id} display="flex" alignItems="center" mb={2}>
              <Box
                component="img"
                src={item.imageAvt || "/images/product/default.jpg"}
                alt={item.name}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body2" noWrap>
                  {item.name}
                </Typography>
                <Typography fontWeight={700} color="error.main" variant="body2">
                  {item.price.toLocaleString()}₫
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
