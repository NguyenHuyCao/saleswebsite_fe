"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FlashSaleSlider, { Promotion } from "@/components/home/FlashSaleSlider";

const FlashSaleShowcasePage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/promotions", {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json();
      const flashPromos: Promotion[] = (data?.data || []).filter(
        (promo: any) => !promo.requiresCode
      );
      setPromotions(flashPromos);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight={700} gutterBottom>
        🔥 KHUYẾN MÃI HẤP DẪN HÔM NAY 🔥
      </Typography>

      {promotions.map((promo) => (
        <FlashSaleSlider
          key={promo.id}
          promotion={promo}
          allPromotions={promotions}
        />
      ))}
    </Box>
  );
};

export default FlashSaleShowcasePage;
