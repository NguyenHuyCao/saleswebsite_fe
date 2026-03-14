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
import type { Brand, Category, Product } from "../types";

// Định nghĩa interface cho API response
interface ApiResponse {
  result?: any[];
  items?: any[];
  rows?: any[];
  data?: any[];
}

const mapProduct = (item: any, nowMs: number): Product => {
  const isNew =
    (nowMs - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30;
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
    description: item.description || "",
    price: currentPrice,
    pricePerUnit: currentPrice,
    originalPrice,
    sale: currentPrice < originalPrice,
    inStock: (item.stockQuantity ?? 0) > 0,
    label: (item.stockQuantity ?? 0) > 0 ? "Thêm vào giỏ hàng" : "Hết hàng",
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
      (item.stockQuantity ?? 0) === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
    favorite: item.wishListUser === true,
  };
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
        px: { xs: 1, sm: 2 },
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
