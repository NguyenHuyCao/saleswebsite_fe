"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Pagination,
  Tooltip,
  Stack,
  Rating,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";

const baseProducts = Array.from({ length: 20 }, (_, i) => ({
  name: `Sản phẩm demo ${i + 1}`,
  image: "/images/product/1534231926-5.jpg",
  price: 1000000 + i * 100000,
  oldPrice: 1200000 + i * 100000,
  tag: i % 2 === 0 ? "Bán chạy" : undefined,
  badge: i % 3 === 0 ? "Sale" : i % 5 === 0 ? "New" : undefined,
}));

const ITEMS_PER_PAGE = 8;

export default function ProductListLayout() {
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<typeof baseProducts>([]);

  useEffect(() => {
    const dataWithRating = baseProducts.map((p) => ({
      ...p,
      rating: Math.floor(Math.random() * 2) + 4,
    }));
    setProducts(dataWithRating);
  }, []);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (index: number) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <Box
      display={{ xs: "block", md: "flex" }}
      px={{ xs: 2, md: 3 }}
      py={4}
      gap={3}
    >
      <Box
        width={{ xs: "100%", md: 260 }}
        mb={{ xs: 3, md: 0 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <CategorySidebar />
        <ProductFilterPanel />
      </Box>

      <Box flex={1}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <Box
                component="img"
                src="/images/product/banner.avif"
                alt="Banner"
                sx={{
                  width: "100%",
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 10 }}>
              <Typography variant="h6" fontWeight="bold">
                Máy hàn điện tử
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sản phẩm chất lượng cao được chọn lọc kỹ lưỡng từ các nhà sản
                xuất uy tín. Dola Tool cung cấp giải pháp tối ưu cho cơ khí.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
          <Typography variant="body2" fontWeight={500}>
            🧮 Xếp theo:
          </Typography>
          <Chip label="Tên A-Z" variant="outlined" clickable />
          <Chip label="Tên Z-A" variant="outlined" clickable />
          <Chip label="Hàng mới" variant="outlined" clickable />
          <Chip label="Giá thấp đến cao" variant="outlined" clickable />
          <Chip label="Giá cao xuống thấp" variant="outlined" clickable />
        </Box>

        <Grid container spacing={2}>
          {paginatedProducts.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                  p: 2,
                  height: "100%",
                }}
              >
                {item.badge && (
                  <Box
                    sx={{
                      bgcolor: "#f25c05",
                      color: "white",
                      px: 1,
                      py: 0.2,
                      fontSize: 12,
                      fontWeight: "bold",
                      position: "absolute",
                      top: 8,
                      left: 8,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
                <Tooltip title="Yêu thích">
                  <Box
                    onClick={() => toggleFavorite(startIndex + idx)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "white",
                      borderRadius: "50%",
                      boxShadow: 1,
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {favorites.includes(startIndex + idx) ? (
                      <FavoriteIcon
                        fontSize="small"
                        sx={{ color: "#f25c05" }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        fontSize="small"
                        sx={{ color: "#f25c05" }}
                      />
                    )}
                  </Box>
                </Tooltip>
                <Box
                  sx={{
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ maxHeight: "100%", objectFit: "contain" }}
                  />
                </Box>
                <Box minHeight={24} mt={1}>
                  {item.tag && (
                    <Box
                      sx={{
                        bgcolor: "#ffb700",
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                        px: 1,
                        borderRadius: 0.5,
                        display: "inline-block",
                      }}
                    >
                      {item.tag}
                    </Box>
                  )}
                </Box>
                <Typography fontSize={14} fontWeight={600} mt={1} height={40}>
                  {item.name}
                </Typography>
                <Rating
                  value={item.rating}
                  readOnly
                  size="small"
                  sx={{ mt: 0.5 }}
                />
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Typography color="#f25c05" fontWeight="bold">
                    {item.price.toLocaleString()}₫
                  </Typography>
                  <Typography
                    fontSize={13}
                    sx={{ textDecoration: "line-through", color: "gray" }}
                  >
                    {item.oldPrice.toLocaleString()}₫
                  </Typography>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: "#ffb700",
                    color: "black",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 14,
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {products.length > ITEMS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
