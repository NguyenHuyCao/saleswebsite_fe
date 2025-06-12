"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Pagination,
  InputBase,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard, { Product } from "../product/ProductCard";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

const ITEMS_PER_PAGE = 8;

interface Props {
  categories: any[];
  brands: any[];
}

export default function ProductListLayout({ categories, brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems]
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toSlug = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const query = new URLSearchParams();

      ["category", "brand", "price"].forEach((key) => {
        const value = searchParams.get(key);
        if (value) query.set(key, value);
      });

      const res = await fetch(
        `http://localhost:8080/api/v1/products?${query.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.data?.result) {
        throw new Error("Không thể tải danh sách sản phẩm.");
      }

      const now = new Date();

      const mapped = data.data.result.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const isHot = item.totalStock - item.stockQuantity > 10;

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status: [...(isNew ? ["Mới"] : []), ...(isHot ? ["Bán chạy"] : [])],
          sale: item.pricePerUnit < item.price,
          inStock: item.active,
          label: item.active ? "Thêm vào giỏ hàng" : "Hết hàng",
          totalStock: item.totalStock,
          stockQuantity: item.stockQuantity,
          createdAt: item.createdAt,
          rating: item.rating,
          slug: item.slug,
          isFavorite: item.wishListUser === true,
        };
      });

      setProducts(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("productId", String(productId));

      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      dispatch(fetchWishlist());
    } catch (err) {
      console.error("Lỗi yêu thích:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => toSlug(p.title).includes(toSlug(search)))
      .sort((a, b) => {
        if (sortType === "newest")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sortType === "asc") return a.price - b.price;
        if (sortType === "desc") return b.price - a.price;
        return 0;
      });
  }, [products, search, sortType]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchWishlist());
    fetchProducts();
  }, [searchParams.toString()]);

  return (
    <Box
      display={{ xs: "block", md: "flex" }}
      py={4}
      gap={3}
      px={{ xs: 1, sm: 2 }}
    >
      {/* Sidebar */}
      <Box
        width={{ xs: "100%", md: 250 }}
        mb={{ xs: 3, md: 0 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <CategorySidebar categories={categories} />
        <ProductFilterPanel brands={brands} />
      </Box>

      {/* Product content */}
      <Box flex={1}>
        <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
          <Typography variant="body2" fontWeight={500}>
            Xếp theo:
          </Typography>
          <Chip label="Hàng mới" onClick={() => setSortType("newest")} />
          <Chip label="Giá thấp đến cao" onClick={() => setSortType("asc")} />
          <Chip
            label="Giá cao xuống thấp"
            onClick={() => setSortType("desc")}
          />
          <InputBase
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              ml: 2,
              border: "1px solid #ccc",
              px: 2,
              borderRadius: 1,
              minWidth: 200,
              "&:focus-within": { borderColor: "#ffb700" },
            }}
          />
        </Box>

        {loading ? (
          <Box py={8} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box py={8} textAlign="center">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={1.5}>
              {paginated.map((item) => (
                <Grid
                  key={item.id}
                  size={{ xs: 6, sm: 4, md: 3 }}
                  display="flex"
                  justifyContent="center"
                >
                  <Box sx={{ width: "100%", maxWidth: 240 }}>
                    <ProductCard
                      product={item}
                      isFavorite={favoriteIdSet.has(item.id)}
                      onToggleFavorite={() => handleToggleFavorite(item.id)}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length > ITEMS_PER_PAGE && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  siblingCount={0}
                  boundaryCount={1}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
