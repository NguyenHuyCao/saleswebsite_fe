"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import ProductCard, { Product } from "@/components/product/ProductCard";

const ITEMS_PER_PAGE = 15;

const WishlistPage = () => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để xem danh sách yêu thích.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/wish_list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data?.data?.result) {
        setAllItems([]);
        return;
      }

      const now = new Date();

      const mapped: Product[] = data.data.result.map((item: any) => {
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
        };
      });

      setAllItems(mapped);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedItems(allItems.slice(start, end));
  }, [page, allItems]);

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
              <ProductCard key={index} product={product} />
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
