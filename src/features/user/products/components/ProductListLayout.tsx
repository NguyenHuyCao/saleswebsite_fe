// components/product/ProductListLayout.tsx (FIXED TYPE ERRORS)
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Pagination,
  Alert,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
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
import type { Brand, Category } from "../types";

// Định nghĩa interface cho API response
interface ApiResponse {
  result?: any[];
  items?: any[];
  rows?: any[];
  data?: any[];
}

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
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page,
    setPage,
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
        // SỬA: Thêm type cho api.get
        const payload = await api.get<any[] | ApiResponse>(path);

        let raw: any[] = [];

        if (Array.isArray(payload)) {
          raw = payload;
        } else {
          const response = payload as ApiResponse;
          raw =
            response?.result ??
            response?.items ??
            response?.rows ??
            response?.data ??
            [];
        }

        const nowMs = Date.now();
        const mapped = raw.map((item) => mapProduct(item, nowMs));
        setProducts(mapped);
      } catch (err: any) {
        setError(err?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: { xs: "block", md: "flex" },
        gap: 3,
        py: 4,
      }}
    >
      {/* Sidebar */}
      <Slide direction="right" in timeout={500}>
        <Box
          sx={{
            width: { xs: "100%", md: 240 },
            mb: { xs: 3, md: 0 },
            position: { md: "sticky" },
            top: { md: 20 },
            height: { md: "fit-content" },
          }}
        >
          <CategorySidebar categories={categories} />
          <ProductFilterPanel brands={brands} />
        </Box>
      </Slide>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <ProductSearchBar onSearch={handleSearch} onSort={handleSort} />

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            <ProductGrid products={paginatedProducts} />

            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 5,
                  mb: 2,
                }}
              >
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
