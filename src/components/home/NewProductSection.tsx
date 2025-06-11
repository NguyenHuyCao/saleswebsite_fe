"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ProductCard, { Product } from "../product/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

const NewProductSectionSlick: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const isTabletOrMobile = useMediaQuery("(max-width:1024px)");
  const dispatch = useDispatch<AppDispatch>();

  const fetchNewProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        "http://localhost:8080/api/v1/products?sort=createdAt,desc",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      const json = await res.json();
      const now = new Date();
      const mapped =
        json?.data?.result?.map((item: any): Product => {
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
            inStock: item.active === true,
            label: item.active ? "Thêm vào giỏ" : "Hết hàng",
            rating: item.rating || 0,
            createdAt: item.createdAt,
            stockQuantity: item.stockQuantity,
            totalStock: item.totalStock,
            slug: item.slug,
            isFavorite: item.wishListUser === true,
          };
        }) || [];
      setProducts(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm mới:", err);
    }
  };

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      dispatch(fetchWishlist());
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  useEffect(() => {
    fetchNewProducts();
    dispatch(fetchWishlist());
  }, [dispatch]);

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
      <Typography variant="h5" fontWeight="bold" mb={2}>
        SẢN PHẨM <span style={{ color: "#ffb700" }}>Mới</span>
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

export default NewProductSectionSlick;
