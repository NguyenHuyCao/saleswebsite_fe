"use client";

import { Box, Typography, Skeleton, Fade } from "@mui/material";
import { motion } from "framer-motion";
import FlashSaleSlider from "@/views/home/FlashSaleSlider";
import type { Promotion } from "../types";
import TwoStrokePromoBanner from "./TwoStrokePromoBanner";
import { useState, useEffect } from "react";

/**
 * Nhận danh sách flash promotions từ server (SSR) qua prop.
 * Nếu muốn “tươi” theo thời gian thực, có thể bật auto-refresh nhẹ client-side.
 */
export default function FlashSaleShowcase({
  promotions,
}: {
  promotions: Promotion[];
}) {
  // tuỳ chọn: refresh nhẹ sau render lần đầu để tránh cache CDN
  const [list, setList] = useState<Promotion[] | null>(null);
  useEffect(() => setList(promotions), [promotions]);

  const loading = list === null;

  return (
    <Box sx={{ pt: 8, mb: -5 }}>
      <TwoStrokePromoBanner />

      {loading ? (
        <Box px={2}>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
        </Box>
      ) : list!.length > 0 ? (
        list!.map((promo, index) => (
          <Fade in key={promo.id} timeout={500 + index * 100}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              sx={{ mb: 4 }}
            >
              <FlashSaleSlider promotion={promo} allPromotions={list!} />
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
