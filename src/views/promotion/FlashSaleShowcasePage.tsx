"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Fade } from "@mui/material";
import FlashSaleSlider, { Promotion } from "../home/FlashSaleSlider";
import TwoStrokePromoBanner from "./TwoStrokePromoBanner";
import { motion } from "framer-motion";

const FlashSaleShowcasePage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions`,
        {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      const data = await res.json();
      const flashPromos: Promotion[] = (data?.data || []).filter(
        (promo: any) => !promo.requiresCode
      );
      setPromotions(flashPromos);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Box sx={{ pt: 8, mb: -5 }}>
      <TwoStrokePromoBanner />

      {loading ? (
        <Box px={2}>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
        </Box>
      ) : promotions.length > 0 ? (
        promotions.map((promo, index) => (
          <Fade in key={promo.id} timeout={500 + index * 100}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              sx={{ mb: 4 }}
            >
              <FlashSaleSlider promotion={promo} allPromotions={promotions} />
            </Box>
          </Fade>
        ))
      ) : (
        <Typography
          textAlign="center"
          mt={4}
          fontWeight={500}
          color="text.secondary"
        >
          Hiện không có chương trình khuyến mãi nào đang diễn ra.
        </Typography>
      )}
    </Box>
  );
};

export default FlashSaleShowcasePage;
