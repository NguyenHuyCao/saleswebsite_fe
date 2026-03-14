"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import ProductCard from "@/features/user/products/components/ProductCard";
import type { Product } from "@/features/user/products/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = { products: Product[] };

export default function NewProductSection({ products }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(products.length);

  const slidesToShow = isMobile ? 2 : isTablet ? 3 : 5;

  // Luôn hiển thị pagination nếu có nhiều hơn 1 trang
  const totalPages = Math.ceil(products.length / slidesToShow);
  const currentPage = Math.floor(currentSlide / slidesToShow) + 1;

  // Settings cho slider
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: !isTablet,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
    },
    afterChange: (current: number) => {
      setCurrentSlide(current);
    },
    // Không cần onInit nữa
  };

  // Cập nhật totalSlides khi products thay đổi
  useEffect(() => {
    setTotalSlides(products.length);
  }, [products]);

  // Xử lý khi không có sản phẩm
  if (!products?.length) {
    return (
      <Box sx={{ px: 2, py: 5, textAlign: "center", color: "text.secondary" }}>
        Chưa có sản phẩm mới.
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 5 }}>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{
          position: "relative",
          display: "inline-block",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            bgcolor: "#ffb700",
            borderRadius: 2,
          },
        }}
      >
        SẢN PHẨM <span style={{ color: "#ffb700" }}>MỚI</span>
      </Typography>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {products.map((product) => (
          <Box key={product.id} px={1}>
            <ProductCard
              product={product}
              mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?sort=createdAt,desc`}
            />
          </Box>
        ))}
      </Slider>

      {/* Pagination - Hiển thị ngay lập tức nếu có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            gap: 2,
          }}
        >
          {/* Mobile: Thanh progress bar */}
          {isMobile ? (
            <Box
              sx={{
                width: "100%",
                maxWidth: 280,
                height: 4,
                bgcolor: "#f0f0f0",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${((currentSlide + slidesToShow) / totalSlides) * 100}%`,
                  height: "100%",
                  bgcolor: "#f25c05",
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          ) : (
            /* Desktop/Tablet: Pagination dots */
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {Array.from({ length: totalPages }).map((_, index) => {
                const isActive = index === currentPage - 1;

                return (
                  <Box
                    key={index}
                    onClick={() => {
                      if (sliderRef.current) {
                        sliderRef.current.slickGoTo(index * slidesToShow);
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: isActive ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: isActive ? "#f25c05" : "#ffb700",
                        opacity: isActive ? 1 : 0.4,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Box>
                );
              })}

              {/* Hiển thị số trang */}
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  color: "#666",
                  fontWeight: 500,
                  bgcolor: "#f5f5f5",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 4,
                }}
              >
                {currentPage}/{totalPages}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Debug - Tạm thời hiển thị để kiểm tra (có thể xóa sau) */}
      {/* <Box sx={{ mt: 2, textAlign: "center", color: "gray" }}>
        Debug: {products.length} sản phẩm, {totalPages} trang, trang {currentPage}
      </Box> */}
    </Box>
  );
}
