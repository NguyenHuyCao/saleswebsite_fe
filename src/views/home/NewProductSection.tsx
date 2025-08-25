"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme, Fade } from "@mui/material";
import Slider from "react-slick";
import ProductCard from "../product/ProductCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewProductSectionSlick: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchNewProducts();
    dispatch(fetchWishlist());
  }, [dispatch]);

  const fetchNewProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?sort=createdAt,desc`,
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
            name: item.name,
            price: item.pricePerUnit,
            pricePerUnit: item.pricePerUnit,
            originalPrice: item.price,
            imageAvt: item.imageAvt,
            imageDetail1: item.imageDetail1,
            imageDetail2: item.imageDetail2,
            imageDetail3: item.imageDetail3,
            description: item.description,
            status,
            sale: item.price !== item.pricePerUnit,
            inStock: item.active === true,
            label: item.active ? "Thêm vào giỏ" : "Hết hàng",
            rating: item.rating || 0,
            createdAt: item.createdAt,
            stockQuantity: item.stockQuantity,
            totalStock: item.totalStock,
            slug: item.slug,
            power: item.power || "N/A",
            fuelType: item.fuelType || "N/A",
            engineType: item.engineType || "N/A",
            weight: item.weight || 0,
            dimensions: item.dimensions || "",
            tankCapacity: item.tankCapacity || 0,
            origin: item.origin || "Không rõ",
            warrantyMonths: item.warrantyMonths || 0,
            createdBy: item.createdBy || "",
            updatedAt: item.updatedAt || null,
            updatedBy: item.updatedBy || null,
            favorite: item.wishListUser === true,
          };
        }) || [];

      setProducts(mapped);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm mới:", err);
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 5,
    slidesToScroll: 1,
    arrows: !isTablet,
  };

  return (
    <Box sx={{ px: 2, py: 5 }}>
      <Fade in timeout={600}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
          textAlign={isMobile ? "center" : "left"}
        >
          SẢN PHẨM{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: "#ffb700" }}
          >
            Mới
          </motion.span>
        </Typography>
      </Fade>

      {products.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          Không có sản phẩm mới nào để hiển thị.
        </Typography>
      ) : (
        <>
          <Slider {...settings}>
            {products.map((product, index) => (
              <Box key={index} px={1}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    mutateKey={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?sort=createdAt,desc`}
                  />
                </motion.div>
              </Box>
            ))}
          </Slider>

          {isTablet && (
            <Fade in timeout={600}>
              <Typography
                fontSize={13}
                color="gray"
                textAlign="center"
                mt={1}
                sx={{
                  fontStyle: "italic",
                  animation: "slideLeft 1.5s infinite",
                  "@keyframes slideLeft": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-6px)" },
                  },
                }}
              >
                Vuốt để xem thêm sản phẩm ➡️
              </Typography>
            </Fade>
          )}
        </>
      )}
    </Box>
  );
};

export default NewProductSectionSlick;
