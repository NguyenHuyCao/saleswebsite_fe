"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Pagination,
  Alert,
  useMediaQuery,
  useTheme,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { api } from "@/lib/api/http";
import { useProductFilters } from "../hooks";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";
import ProductSearchBar from "./ProductSearchBar";
import ProductGrid from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { mapProduct } from "@/lib/utils/productMapper";
import type { Brand, Category, Product } from "../types";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

interface ApiResponse {
  result?: any[];
  items?: any[];
  rows?: any[];
  data?: any[];
}

const PRICE_LABELS: Record<string, string> = {
  "0_1000000":       "Dưới 1 triệu",
  "1000000_2000000": "1 – 2 triệu",
  "2000000_5000000": "2 – 5 triệu",
  "5000000_":        "Trên 5 triệu",
};

export default function ProductListLayout({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Scroll to #products whenever filter params change (skip initial render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page,
    setPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
    handleSearch,
    handleSort,
  } = useProductFilters(products);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        ["category", "brand", "price"].forEach((key) => {
          const value = searchParams.get(key);
          if (value) query.set(key, value);
        });

        const path = `/api/v1/products?${query.toString()}`;
        const payload = await api.get<any[] | ApiResponse>(path);

        let raw: any[] = [];
        if (Array.isArray(payload)) {
          raw = payload;
        } else {
          const response = payload as ApiResponse;
          raw = response?.result ?? response?.items ?? response?.rows ?? response?.data ?? [];
        }

        const nowMs = Date.now();
        setProducts(raw.map((item) => mapProduct(item, nowMs)));
      } catch (err: any) {
        setError(err?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Active filter params
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const priceParam = searchParams.get("price");

  const categoryName = categoryParam
    ? categories.find((c) => c.slug === categoryParam)?.name
    : null;
  const brandName = brandParam
    ? brands.find((b) => b.slug === brandParam)?.name ?? brandParam
    : null;
  const priceName = priceParam ? PRICE_LABELS[priceParam] : null;

  const hasFilters = !!(categoryName || brandName || priceName);

  const clearFilter = useCallback(
    (key: "category" | "brand" | "price") => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.replace(`/product?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const clearAllFilters = useCallback(() => {
    router.replace("/product", { scroll: false });
  }, [router]);

  // Page range for display
  const startItem = products.length === 0 ? 0 : (page - 1) * 8 + 1;
  const endItem = Math.min(page * 8, filteredProducts.length);

  return (
    <Box sx={{ display: { xs: "block", md: "flex" }, gap: 3, py: { xs: 2, md: 3 } }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: 240 },
          mb: { xs: 2, md: 0 },
          flexShrink: 0,
          position: { md: "sticky" },
          top: { md: 80 },
          height: { md: "fit-content" },
        }}
      >
        <CategorySidebar categories={categories} />
        <Box sx={{ mt: { xs: 0, md: 2 } }}>
          <ProductFilterPanel brands={brands} />
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Active filter chips */}
        {hasFilters && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            alignItems="center"
          >
            <FilterListIcon sx={{ fontSize: 18, color: "#f25c05" }} />
            <Typography variant="caption" fontWeight={600} color="#f25c05">
              Đang lọc:
            </Typography>
            {categoryName && (
              <Chip
                label={`Danh mục: ${categoryName}`}
                size="small"
                onDelete={() => clearFilter("category")}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{ bgcolor: "#fff8e1", color: "#e65100", border: "1px solid #ffb700", fontWeight: 500 }}
              />
            )}
            {brandName && (
              <Chip
                label={`Thương hiệu: ${brandName}`}
                size="small"
                onDelete={() => clearFilter("brand")}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{ bgcolor: "#fff8e1", color: "#e65100", border: "1px solid #ffb700", fontWeight: 500 }}
              />
            )}
            {priceName && (
              <Chip
                label={`Giá: ${priceName}`}
                size="small"
                onDelete={() => clearFilter("price")}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{ bgcolor: "#fff8e1", color: "#e65100", border: "1px solid #ffb700", fontWeight: 500 }}
              />
            )}
            <Chip
              label="Xóa tất cả"
              size="small"
              onClick={clearAllFilters}
              sx={{
                bgcolor: "transparent",
                border: "1px solid #f25c05",
                color: "#f25c05",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { bgcolor: "#fff0e6" },
              }}
            />
          </Stack>
        )}

        <ProductSearchBar onSearch={handleSearch} onSort={handleSort} />

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Result count */}
            {!loading && filteredProducts.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                Hiển thị {startItem}–{endItem} / {filteredProducts.length} sản phẩm
              </Typography>
            )}

            {filteredProducts.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  textAlign: "center",
                  border: "2px dashed #f0f0f0",
                  borderRadius: 4,
                  bgcolor: "#fafafa",
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy sản phẩm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
                {hasFilters && (
                  <Chip
                    label="Xóa bộ lọc"
                    onClick={clearAllFilters}
                    sx={{ mt: 2, bgcolor: "#f25c05", color: "#fff", fontWeight: 600, cursor: "pointer" }}
                  />
                )}
              </Box>
            ) : (
              <ProductGrid products={paginatedProducts} />
            )}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        bgcolor: "#f25c05",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e64a19" },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
