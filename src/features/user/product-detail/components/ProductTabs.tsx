"use client";

import {
  Box,
  Divider,
  Fade,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Product, Category } from "@/features/user/products/types";

interface Props {
  product: Product;
  category: Category | null;
}

const tabLabels = [
  "Mô tả sản phẩm",
  "Hướng dẫn mua hàng",
  "Chính sách bảo hành và bảo trì",
];

const BASE_IMG = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;
const getImg = (src: string) => (src?.startsWith("http") ? src : `${BASE_IMG}${src}`);

export default function ProductTabs({ product, category }: Props) {
  const [value, setValue] = useState(0);

  const suggestions = useMemo(
    () =>
      category?.products?.filter((p) => p.slug !== product.slug).slice(0, 4) ||
      [],
    [category, product.slug]
  );

  const renderTabContent = (val: number) => {
    switch (val) {
      case 0:
        return (
          <Typography paragraph>
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </Typography>
        );
      case 1:
        return (
          <Box>
            {Array.from({ length: 5 }, (_, i) => (
              <Typography paragraph key={i}>
                <strong>Bước {i + 1}:</strong> Hướng dẫn thực hiện giao dịch mua
                sản phẩm theo quy trình tiêu chuẩn.
              </Typography>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography paragraph fontWeight={600}>
              1. BẢO HÀNH
            </Typography>
            <Typography paragraph>
              Sản phẩm được bảo hành miễn phí nếu còn trong thời hạn bảo hành kể
              từ ngày giao hàng.
            </Typography>
            <Typography paragraph fontWeight={600}>
              1.2 Trường hợp không được bảo hành:
            </Typography>
            <Typography paragraph>
              - Hết hạn hoặc mất phiếu bảo hành.
            </Typography>
            <Typography paragraph fontWeight={600}>
              2. BẢO TRÌ
            </Typography>
            <Typography paragraph>
              Vệ sinh, sửa chữa nhỏ miễn phí theo chính sách riêng của chúng
              tôi.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const SuggestedProductItem = ({
    item,
    index,
  }: {
    item: Product;
    index: number;
  }) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        sx={{
          "&:hover": { transform: "translateX(4px)" },
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 60,
            height: 60,
            borderRadius: 1,
            mr: 2,
            border: "1px solid #eee",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={item.imageAvt ? getImg(item.imageAvt) : "/images/product/default.jpg"}
            alt={item.name}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
            sizes="60px"
          />
        </Box>
        <Box>
          <Typography variant="body2" noWrap fontWeight={500}>
            {item.name}
          </Typography>
          <Typography fontWeight={700} color="error.main" variant="body2">
            {item.price.toLocaleString()}₫
          </Typography>
        </Box>
      </Box>
      {index !== suggestions.length - 1 && <Divider />}
    </motion.div>
  );

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <Box flex={1}>
          <Tabs
            value={value}
            onChange={(_, v) => setValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
              ".MuiTabs-indicator": { height: 3, bgcolor: "#ffc107" },
            }}
          >
            {tabLabels.map((label, i) => (
              <Tab
                key={i}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: value === i ? "#000" : "#888",
                  px: 3,
                }}
              />
            ))}
          </Tabs>
          <Fade in timeout={400}>
            <Box mt={2}>{renderTabContent(value)}</Box>
          </Fade>
        </Box>

        <Box
          sx={{
            width: 300,
            display: { xs: "none", md: "block" },
            borderLeft: "1px solid #eee",
            pl: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color="warning.main"
            mb={2}
            sx={{ textTransform: "uppercase" }}
          >
            Có thể{" "}
            <Box component="span" color="primary.main">
              bạn thích
            </Box>
          </Typography>
          {suggestions.map((item, index) => (
            <SuggestedProductItem key={item.id} item={item} index={index} />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
