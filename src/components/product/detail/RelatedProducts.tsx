"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import ProductCard, { Product } from "../ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RawProduct {
  id: number;
  name: string;
  imageAvt: string | null;
  price: number;
  pricePerUnit: number;
  slug: string;
  stockQuantity: number;
  totalStock: number;
  rating: number;
  active: boolean;
  createdAt: string;
  wishListUser: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: RawProduct[];
}

interface RelatedProductsProps {
  category: Category | null;
}

const RelatedProductsSlick: React.FC<RelatedProductsProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const isTabletOrMobile = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    if (category?.products) {
      const now = new Date();
      const mapped = category.products.map((item): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const status =
          item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [];

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status,
          sale: item.price !== item.pricePerUnit,
          inStock: item.active,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          rating: item.rating,
          createdAt: item.createdAt,
          stockQuantity: item.stockQuantity,
          totalStock: item.totalStock,
          slug: item.slug,
          isFavorite: item.wishListUser === true,
        };
      });
      setProducts(mapped);
    }
  }, [category]);

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
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
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: !isTabletOrMobile,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        SẢN PHẨM{" "}
        <Box component="span" color="warning.main">
          LIÊN QUAN
        </Box>
      </Typography>

      <Slider {...settings}>
        {products.map((product, index) => (
          <Box key={index} px={1}>
            <ProductCard
              product={product}
              isFavorite={product.isFavorite}
              onToggleFavorite={() => toggleWishlist(product.id)}
            />
          </Box>
        ))}
      </Slider>

      {isTabletOrMobile && (
        <Typography
          fontSize={13}
          color="gray"
          textAlign="center"
          mt={1}
          sx={{ fontStyle: "italic" }}
        >
          Vuốt để xem thêm sản phẩm ➡️
        </Typography>
      )}
    </Box>
  );
};

export default RelatedProductsSlick;
