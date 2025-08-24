"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Pagination,
  InputBase,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import type { Brand, Category, Product } from "../types";

const ITEMS_PER_PAGE = 8;

export default function ProductListLayout({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

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
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/products?${query.toString()}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      const data = await res.json();

      if (!res.ok || !data?.data?.result)
        throw new Error(data?.message || "Không thể tải danh sách sản phẩm.");

      const now = new Date();
      const mapped: Product[] = data.data.result.map((item: any) => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;

        const currentPrice = item.pricePerUnit ?? item.price ?? 0;
        const originalPrice = item.price ?? currentPrice;

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          imageAvt: item.imageAvt,
          imageDetail1: item.imageDetail1 || "",
          imageDetail2: item.imageDetail2 || "",
          imageDetail3: item.imageDetail3 || "",
          price: currentPrice,
          pricePerUnit: currentPrice,
          originalPrice,
          sale: currentPrice < originalPrice,
          inStock: item.active === true && (item.stockQuantity ?? 0) > 0,
          label: item.active ? "Thêm vào giỏ hàng" : "Hết hàng",
          description: item.description || "",
          stockQuantity: item.stockQuantity ?? 0,
          totalStock: item.totalStock ?? 0,
          power: item.power || "N/A",
          fuelType: item.fuelType || "N/A",
          engineType: item.engineType || "N/A",
          weight: item.weight || 0,
          dimensions: item.dimensions || "",
          tankCapacity: item.tankCapacity || 0,
          origin: item.origin || "Không rõ",
          warrantyMonths: item.warrantyMonths || 0,
          createdAt: item.createdAt,
          createdBy: item.createdBy || "",
          updatedAt: item.updatedAt || null,
          updatedBy: item.updatedBy || "",
          rating: item.rating || 0,
          status:
            (item.stockQuantity ?? 0) === 0
              ? ["Hết hàng"]
              : isNew
              ? ["Mới"]
              : [],
          favorite: item.wishListUser === true,
        };
      });

      setProducts(mapped);
      setPage(1);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => toSlug(p.name).includes(toSlug(search)))
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

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    dispatch(fetchWishlist());
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <Box
      display={{ xs: "block", md: "flex" }}
      py={4}
      gap={3}
      px={{ xs: 1, sm: 2 }}
    >
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
                    <ProductCard product={item} />
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
