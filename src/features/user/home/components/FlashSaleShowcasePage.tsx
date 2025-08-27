"use client";

import React from "react";
import { Box, Typography, Skeleton, Fade } from "@mui/material";
import TwoStrokePromoBanner from "./TwoStrokePromoBanner";
import { motion } from "framer-motion";
import type { Promotion } from "../types";
import FlashSaleSlider from "./FlashSaleSlider";

type Props = { promotions?: Promotion[]; loading?: boolean };

export default function FlashSaleShowcasePage({
  promotions = [], // <- mặc định là mảng rỗng để không còn union undefined
  loading = false,
}: Props) {
  return (
    <Box sx={{ pt: 8, mb: -5 }}>
      <TwoStrokePromoBanner />

      {loading ? (
        <Box px={2}>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
        </Box>
      ) : promotions.length > 0 ? (
        promotions.map((promo, index) => (
          <Fade in key={String(promo.id)} timeout={500 + index * 100}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              sx={{ mb: 4 }}
            >
              {/* promotions đã chắc chắn là Promotion[] nhờ default ở trên */}
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
}
