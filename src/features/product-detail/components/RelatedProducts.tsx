"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/products/components/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
// import type { Category, Product } from "@/product/types";

export default function RelatedProductsSlick({
  category,
}: {
  category: Category | null;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const isTabletOrMobile = useMediaQuery("(max-width:1024px)");
  const wishlistItems = useSelector((state: AppState) => state.wishlist.result);
  const favoriteIdSet = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems]
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (category?.products?.length) {
      const now = new Date();
      const mapped = category.products.map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        const cp = item.pricePerUnit ?? item.price ?? 0;
        const op = item.price ?? cp;

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          imageAvt: item.imageAvt,
          imageDetail1: item.imageDetail1 || "",
          imageDetail2: item.imageDetail2 || "",
          imageDetail3: item.imageDetail3 || "",
          price: cp,
          pricePerUnit: cp,
          originalPrice: op,
          sale: cp < op,
          inStock: item.active === true && (item.stockQuantity ?? 0) > 0,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          stockQuantity: item.stockQuantity ?? 0,
          totalStock: item.totalStock ?? 0,
          power: item.power || "",
          fuelType: item.fuelType || "",
          engineType: item.engineType || "",
          weight: item.weight || 0,
          dimensions: item.dimensions || "",
          tankCapacity: item.tankCapacity ?? 0,
          origin: item.origin || "",
          warrantyMonths: item.warrantyMonths ?? 0,
          createdAt: item.createdAt,
          createdBy: item.createdBy || "",
          updatedAt: item.updatedAt || null,
          updatedBy: item.updatedBy || "",
          rating: item.rating || 0,
          status:
            (item.stockQuantity ?? 0) === 0
              ? ["Hết hàng"]
              : isNew
              ? ["Mới"]
              : [],
          favorite: favoriteIdSet.has(item.id),
          description: item.description || "",
        };
      });
      setProducts(mapped);
    }
  }, [category, favoriteIdSet]);

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
          settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false },
        },
        {
          breakpoint: 600,
          settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
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
              mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${category?.slug}`}
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
}
