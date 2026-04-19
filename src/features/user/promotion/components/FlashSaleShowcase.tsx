"use client";

import { Box, Typography, Skeleton, Fade, Chip } from "@mui/material";
import { motion } from "framer-motion";
import FlashSaleSlider from "./FlashSaleSlider";
import type { Promotion } from "../types";
import TwoStrokePromoBanner from "./TwoStrokePromoBanner";
import { useState, useEffect } from "react";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import BoltIcon from "@mui/icons-material/Bolt";

export default function FlashSaleShowcase({
  promotions,
}: {
  promotions: Promotion[] | null;
}) {
  const [list, setList] = useState<Promotion[] | null>(null);

  useEffect(() => setList(promotions), [promotions]);

  const loading = list === null;

  return (
    <Box sx={{ pt: 8, mb: -5, position: "relative" }}>
      {/* Banner quảng cáo */}
      <TwoStrokePromoBanner />

      {/* Header section với hiệu ứng */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          mt: 6,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #f25c05, #ffb700)",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(242, 92, 5, 0.3)",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  boxShadow: "0 8px 16px rgba(242, 92, 5, 0.3)",
                },
                "50%": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 24px rgba(242, 92, 5, 0.4)",
                },
                "100%": {
                  transform: "scale(1)",
                  boxShadow: "0 8px 16px rgba(242, 92, 5, 0.3)",
                },
              },
            }}
          >
            <LocalFireDepartmentIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                background: "linear-gradient(135deg, #f25c05, #ffb700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              FLASH SALE
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <BoltIcon sx={{ fontSize: 16, color: "#ffb700" }} />
              Ưu đãi sốc - Số lượng có hạn
            </Typography>
          </Box>
        </Box>

        {/* Chip hiển thị số lượng khuyến mãi */}
        {!loading && list!.length > 0 && (
          <Chip
            label={`${list!.length} chương trình`}
            size="small"
            sx={{
              bgcolor: "#fff8e1",
              color: "#f25c05",
              fontWeight: 600,
              border: "1px solid #ffb700",
              borderRadius: 2,
            }}
          />
        )}
      </Box>

      {/* Nội dung chính */}
      {loading ? (
        <Box px={2}>
          <Skeleton
            variant="rounded"
            height={360}
            sx={{
              borderRadius: 4,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "-200% 0" },
                "100%": { backgroundPosition: "200% 0" },
              },
            }}
          />
        </Box>
      ) : list!.length > 0 ? (
        <Box sx={{ position: "relative" }}>
          {/* Danh sách các flash sale */}
          {list!.map((promo, index) => (
            <Fade in key={promo.id} timeout={500 + index * 100}>
              <Box
                component={motion.div}

                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                sx={{
                  mb: 5,
                  position: "relative",
                  "&:not(:last-child):after": {
                    content: '""',
                    position: "absolute",
                    bottom: -20,
                    left: "10%",
                    width: "80%",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, #ffb700, transparent)",
                  },
                }}
              >
                <FlashSaleSlider promotion={promo} allPromotions={list!} />
              </Box>
            </Fade>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            p: 6,
            bgcolor: "#fafafa",
            borderRadius: 4,
            border: "1px dashed #ffb700",
          }}
        >
          <LocalFireDepartmentIcon
            sx={{ fontSize: 48, color: "#ffb700", opacity: 0.5, mb: 2 }}
          />
          <Typography fontWeight={500} color="text.secondary">
            Hiện không có chương trình khuyến mãi nào đang diễn ra.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hãy quay lại sau để săn những ưu đãi hấp dẫn!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
