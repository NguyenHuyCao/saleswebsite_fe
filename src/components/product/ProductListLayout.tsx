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
  InputBase,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter, useSearchParams } from "next/navigation";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";
import Image from "next/image";

interface ProductIprop {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  tags?: string[];
  badge?: string;
  rating?: number;
  createdAt?: string;
  slug?: string;
  active: boolean;
  wishListUser: boolean;
}

interface Props {
  categories: any[];
  brands: any[];
}

const ITEMS_PER_PAGE = 8;

export default function ProductListLayout({ categories, brands }: Props) {
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductIprop[]>([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFilterUrl = () => {
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const price = searchParams.get("price") || "";
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (price) params.set("price", price);
    return `http://localhost:8080/api/v1/products?${params.toString()}`;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(getFilterUrl());
        const data = await res.json();
        const now = new Date();
        const mapped = data?.data?.result.map((item: any) => {
          const createdAt = new Date(item.createdAt);
          const isNew =
            (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
          const isBestSeller = item.totalStock - item.stockQuantity > 10;

          const tags: string[] = [];
          if (isNew) tags.push("Mới");
          if (isBestSeller) tags.push("Bán chạy");

          return {
            id: item.id,
            name: item.name,
            image: item.imageAvt
              ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
              : "/images/product/placeholder.jpg",
            price: item.pricePerUnit,
            oldPrice: item.price,
            rating: item.rating || 0,
            tags,
            badge: item.stockQuantity === 0 ? "Hết hàng" : undefined,
            createdAt: item.createdAt,
            slug: item.slug,
            active: item.active,
            wishListUser: item.wishListUser,
          };
        });
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    }
    fetchProducts();
  }, [searchParams.toString()]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const toggleFavorite = (index: number) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const normalized = (text: string) =>
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filteredProducts = products
    .filter((product) => normalized(product.name).includes(normalized(search)))
    .sort((a, b) => {
      if (sortType === "newest") {
        return (
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
      if (sortType === "asc") return a.price - b.price;
      if (sortType === "desc") return b.price - a.price;
      return 0;
    });

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const updateURLParam = (key: string, value: string) => {
    const current = new URLSearchParams(window.location.search);
    current.set(key, value);
    const newUrl = `/product?${current.toString()}`;
    router.push(newUrl);
  };

  return (
    <Box display={{ xs: "block", md: "flex" }} py={4} gap={3}>
      <Box
        width={{ xs: "100%", md: 260 }}
        mb={{ xs: 3, md: 0 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <CategorySidebar
          categories={categories}
          onSelectCategory={(slug) => updateURLParam("category", slug)}
        />
        <ProductFilterPanel
          brands={brands}
          onSelectBrand={(slug) => updateURLParam("brand", slug)}
          onSelectPrice={(range) => updateURLParam("price", range)}
        />
      </Box>

      <Box flex={1}>
        <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
          <Typography variant="body2" fontWeight={500}>
            Xếp theo:
          </Typography>
          <Chip
            label="Hàng mới"
            variant="outlined"
            onClick={() => setSortType("newest")}
          />
          <Chip
            label="Giá thấp đến cao"
            variant="outlined"
            onClick={() => setSortType("asc")}
          />
          <Chip
            label="Giá cao xuống thấp"
            variant="outlined"
            onClick={() => setSortType("desc")}
          />
          <InputBase
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 2, border: "1px solid #ccc", px: 2, borderRadius: 1 }}
          />
        </Box>

        <Grid container spacing={2}>
          {paginatedProducts.map((item, idx) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={2}
                sx={{ p: 2, position: "relative", cursor: "pointer" }}
                onClick={() => router.push(`/product/detail?name=${item.slug}`)}
              >
                {item.badge && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "#f25c05",
                      color: "white",
                      px: 1,
                      py: 0.2,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
                <Tooltip title="Yêu thích">
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(startIndex + idx);
                    }}
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
                    }}
                  >
                    {item.wishListUser ||
                    favorites.includes(startIndex + idx) ? (
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
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box
                  minHeight={24}
                  mt={1}
                  display="flex"
                  gap={1}
                  flexWrap="wrap"
                >
                  {item.tags?.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        bgcolor: tag === "Mới" ? "red" : "#ffb700",
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                        px: 1,
                        borderRadius: 0.5,
                        display: "inline-block",
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
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
                  disabled={!item.active}
                >
                  {item.active ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length > ITEMS_PER_PAGE && (
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
