"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import ProductCard, { Product } from "@/components/product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

const ITEMS_PER_PAGE = 15;

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const [page, setPage] = useState(1);

  const allItems: Product[] = useMemo(() => {
    const now = new Date();
    return wishlistItems.map((item: any) => {
      const createdAt = new Date(item.createdAt);
      const isNew =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
      const isHot = item.totalStock - item.stockQuantity > 10;
      const status = [];
      if (isNew) status.push("Mới");
      if (isHot) status.push("Bán chạy");

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
        inStock: item.stockQuantity > 0,
        label: item.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng",
        rating: item.rating || 0,
        slug: item.slug,
        createdAt: item.createdAt,
        stockQuantity: item.stockQuantity,
        totalStock: item.totalStock,
        isFavorite: true,
      };
    });
  }, [wishlistItems]);

  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedItems(allItems.slice(start, end));
  }, [page, allItems]);

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để xoá khỏi yêu thích.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", String(productId));
      await fetch("http://localhost:8080/api/v1/wish_list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Gọi lại danh sách yêu thích mới từ backend để đảm bảo đồng bộ
      dispatch(fetchWishlist());
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm yêu thích:", error);
    }
  };

  const pageCount = Math.ceil(allItems.length / ITEMS_PER_PAGE);

  return (
    <Box mt={6} mb={10}>
      <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
        DANH SÁCH <span style={{ color: "#ffb700" }}>YÊU THÍCH</span>
      </Typography>

      {allItems.length === 0 ? (
        <Typography textAlign="center">
          Danh sách yêu thích của bạn trống.
        </Typography>
      ) : (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
            gap={2}
            rowGap={4}
            justifyContent="center"
          >
            {displayedItems.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                isFavorite
                onToggleFavorite={() => toggleWishlist(product.id!)}
              />
            ))}
          </Box>

          {pageCount > 1 && (
            <Box mt={5} display="flex" justifyContent="center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default WishlistPage;
