"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getRVItems, type RVItem } from "@/lib/utils/recentlyViewed";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function RVCard({ item, index }: { item: RVItem; index: number }) {
  const router = useRouter();
  const hasDiscount = (item.discountPercent ?? 0) > 0;

  return (
    <motion.div

      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      style={{ flexShrink: 0 }}
    >
      <Paper
        onClick={() => router.push(`/product/detail?name=${item.slug}`)}
        elevation={0}
        sx={{
          width: { xs: 130, sm: 155, md: 170 },
          borderRadius: 2.5,
          overflow: "hidden",
          cursor: "pointer",
          border: "1px solid rgba(0,0,0,0.07)",
          transition: "box-shadow 0.2s, border-color 0.2s",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(242,92,5,0.12)",
            borderColor: "rgba(242,92,5,0.2)",
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            bgcolor: "#f7f7f7",
            overflow: "hidden",
          }}
        >
          {hasDiscount && (
            <Chip
              label={`-${item.discountPercent}%`}
              size="small"
              sx={{
                position: "absolute",
                top: 6,
                left: 6,
                zIndex: 2,
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.6rem",
                height: 18,
              }}
            />
          )}
          <Image
            src={item.imageAvt}
            alt={item.name}
            fill
            sizes="170px"
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Info */}
        <Box sx={{ p: 1.25 }}>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#333",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.35,
              mb: 0.75,
              minHeight: 36,
            }}
          >
            {item.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography
              fontWeight={700}
              sx={{ color: "#f25c05", fontSize: "0.8rem" }}
            >
              {item.price.toLocaleString()}₫
            </Typography>
            {hasDiscount && (
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: "#aaa",
                  textDecoration: "line-through",
                }}
              >
                {item.originalPrice.toLocaleString()}₫
              </Typography>
            )}
          </Stack>
          {!item.inStock && (
            <Chip
              label="Hết hàng"
              size="small"
              sx={{ mt: 0.5, height: 16, fontSize: "0.58rem", bgcolor: "#f5f5f5", color: "#999" }}
            />
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function RecentlyViewedSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [items, setItems] = useState<RVItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getRVItems());
  }, []);

  // Không render trên server hoặc khi không có lịch sử
  if (!mounted || items.length === 0) return null;

  return (
    <motion.div

      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff" }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                bgcolor: "#f5f5f5",
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HistoryIcon sx={{ color: "#666", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} color="#333" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                Đã xem gần đây
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {items.length} sản phẩm
              </Typography>
            </Box>
          </Stack>

          {!isMobile && (
            <Typography
              variant="caption"
              sx={{ color: "#bbb", fontStyle: "italic" }}
            >
              Lưu trên thiết bị này
            </Typography>
          )}
        </Stack>

        {/* Horizontal scroll */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-track": { bgcolor: "#f5f5f5", borderRadius: 2 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#ffb700", borderRadius: 2 },
          }}
        >
          {items.map((item, idx) => (
            <RVCard key={item.id} item={item} index={idx} />
          ))}

          {/* View more hint if many items */}
          {items.length >= 6 && !isMobile && (
            <motion.div

              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 170,
                  aspectRatio: "1/1",
                  borderRadius: 2.5,
                  border: "1px dashed #ffb700",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  cursor: "pointer",
                  color: "#f25c05",
                  "&:hover": { bgcolor: "#fff8e1" },
                  transition: "background-color 0.2s",
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
                <Typography variant="caption" fontWeight={600} color="#f25c05">
                  Xem tất cả
                </Typography>
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
