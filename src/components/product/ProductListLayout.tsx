"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Pagination,
  InputBase,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard, { Product } from "../product/ProductCard";
import CategorySidebar from "./CategorySidebar";
import ProductFilterPanel from "./ProductFilterPanel";

const ITEMS_PER_PAGE = 12;

interface Props {
  categories: any[];
  brands: any[];
}

export default function ProductListLayout({ categories, brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState(1);

  const toSlug = (str: string): string => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    const s = searchParams.get("search") || "";
    setSearch(s);
    fetchProducts();
    fetchWishlist();
  }, [searchParams.toString()]);

  const fetchProducts = async () => {
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const price = searchParams.get("price") || "";

    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (brand) query.set("brand", brand);
    if (price) query.set("price", price);

    try {
      const token = localStorage.getItem("accessToken");
      let res;
      if (token != null) {
        res = await fetch(`http://localhost:8080/api/v1/products?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await fetch(`http://localhost:8080/api/v1/products?${query}`);
      }

      const data = await res.json();
      const now = new Date();

      const mapped = data?.data?.result?.map((item: any) => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const isBestSeller = item.totalStock - item.stockQuantity > 10;

        const status: string[] = [];
        if (isNew) status.push("Mới");
        if (isBestSeller) status.push("Bán chạy");

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status,
          sale: item.pricePerUnit < item.price,
          inStock: item.active,
          label: item.active ? "Thêm vào giỏ hàng" : "Hết hàng",
          totalStock: item.totalStock,
          stockQuantity: item.stockQuantity,
          createdAt: item.createdAt,
          rating: item.rating,
          slug: item.slug,
          isFavorite: item.wishListUser === true,
        } as Product;
      });

      setProducts(mapped);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/api/v1/wish_list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const ids =
        data?.data?.result?.map((entry: any) =>
          entry.product ? entry.product.id : entry.id
        ) || [];
      setFavorites(ids);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách yêu thích:", err);
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const isFavorite = favorites.includes(productId);
    setFavorites((prev) =>
      isFavorite ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    try {
      const formData = new FormData();
      formData.append("productId", String(productId));

      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } catch (err) {
      console.error("Lỗi cập nhật yêu thích:", err);
    }
  };

  const updateURLParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`/product?${params.toString()}`);
  };

  const filteredProducts = products
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

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

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
        <CategorySidebar
          categories={categories}
          onSelectCategory={({ slug }: { slug: string }) =>
            updateURLParam("category", slug)
          }
        />
        <ProductFilterPanel
          brands={brands}
          onSelectBrand={({ slug }: { slug: string }) =>
            updateURLParam("brand", slug)
          }
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
            sx={{
              ml: 2,
              border: "1px solid #ccc",
              px: 2,
              borderRadius: 1,
              minWidth: 200,
            }}
          />
        </Box>

        <Grid container spacing={1.5}>
          {" "}
          {/* Reduced spacing */}
          {paginatedProducts.map((item) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={item.id}
              display="flex"
              justifyContent="center"
            >
              <Box sx={{ width: { xs: "100%", sm: 220 } }}>
                <ProductCard
                  product={item}
                  isFavorite={favorites.includes(item.id)}
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
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
