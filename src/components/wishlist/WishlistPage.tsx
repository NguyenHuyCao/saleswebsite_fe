"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import ProductCard, { Product } from "@/components/product/ProductCard";

const ITEMS_PER_PAGE = 15; // Tùy số lượng để phân trang phù hợp

const wishlistItems: Product[] = [
  {
    title: "Máy cưa xích điện Kenmax",
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    rating: 4.8,
    price: 1500000,
    originalPrice: 1800000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: true,
  },
  {
    title: "Máy cưa xích điện Kenmax",
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    rating: 4.8,
    price: 1500000,
    originalPrice: 1800000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: true,
  },
  {
    title: "Máy cưa xích điện Kenmax",
    image: "/images/product/12.jpg",
    status: ["Mới", "Bán chạy"],
    rating: 4.8,
    price: 1500000,
    originalPrice: 1800000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: true,
  },
  {
    title: "Máy cắt sắt Dewalt D28730-B1",
    image: "/images/product/12.jpg",
    status: ["Mới"],
    rating: 4.0,
    price: 2920000,
    originalPrice: 3500000,
    inStock: false,
    label: "Hết hàng",
    sale: true,
  },
  {
    title: "Máy khoan Bosch GSB 550",
    image: "/images/product/12.jpg",
    status: [],
    rating: 4.5,
    price: 990000,
    originalPrice: 1200000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: false,
  },
  {
    title: "Máy hàn điện tử Jasic ZX7",
    image: "/images/product/12.jpg",
    status: ["Bán chạy"],
    rating: 5,
    price: 1100000,
    originalPrice: 1400000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: true,
  },
  {
    title: "Tời quay tay Kenbo cao cấp",
    image: "/images/product/12.jpg",
    status: ["Mới"],
    rating: 3.5,
    price: 859000,
    originalPrice: 1210000,
    inStock: false,
    label: "Hết hàng",
    sale: true,
  },
  {
    title: "Máy phát cỏ Honda GX35",
    image: "/images/product/12.jpg",
    status: ["Bán chạy"],
    rating: 4.2,
    price: 2500000,
    originalPrice: 2750000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: false,
  },
  {
    title: "Máy khoan pin Makita",
    image: "/images/product/12.jpg",
    status: ["Mới"],
    rating: 4.6,
    price: 2200000,
    originalPrice: 2600000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: true,
  },
  {
    title: "Máy cắt gạch Bosch",
    image: "/images/product/12.jpg",
    status: [],
    rating: 4.1,
    price: 1450000,
    originalPrice: 1750000,
    inStock: true,
    label: "Thêm vào giỏ",
    sale: false,
  },
];

const WishlistPage = () => {
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<Product[]>([]);

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedItems(wishlistItems.slice(start, end));
  }, [page]);

  const pageCount = Math.ceil(wishlistItems.length / ITEMS_PER_PAGE);

  return (
    <Box mt={6} mb={10}>
      <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
        DANH SÁCH <span style={{ color: "#ffb700" }}>YÊU THÍCH</span>
      </Typography>

      {wishlistItems.length === 0 ? (
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
