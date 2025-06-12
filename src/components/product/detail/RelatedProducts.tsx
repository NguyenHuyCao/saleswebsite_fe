"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import ProductCard, { Product } from "../ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const isTabletOrMobile = useMediaQuery("(max-width:1024px)");

  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems]
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (category?.products?.length) {
      const now = new Date();

      const mapped = category.products.map((item): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;

        return {
          id: item.id,
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status:
            item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
          sale: item.price !== item.pricePerUnit,
          inStock: item.active,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          rating: item.rating,
          createdAt: item.createdAt,
          stockQuantity: item.stockQuantity,
          totalStock: item.totalStock,
          slug: item.slug,
          isFavorite: favoriteIdSet.has(item.id),
        };
      });

      setProducts(mapped);
    }
  }, [category, favoriteIdSet]);

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    // Cập nhật local UI ngay
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

      dispatch(fetchWishlist());
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  const sliderSettings = useMemo(
    () => ({
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
    }),
    [isTabletOrMobile]
  );

  if (!products.length) return null;

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textTransform: "uppercase" }}
      >
        Sản phẩm{" "}
        <Box component="span" color="warning.main">
          liên quan
        </Box>
      </Typography>

      <Slider {...sliderSettings}>
        {products.map((product) => (
          <Box key={product.id} px={1}>
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
