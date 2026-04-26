"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Rating,
  useTheme,
  useMediaQuery,
  Zoom,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      style={{ flexShrink: 0 }}
    >
      <Paper
        onClick={() => router.push(`/product/detail?name=${item.slug}`)}
        elevation={2}
        sx={{
          width: { xs: 140, sm: 160, md: 175 },
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          p: { xs: 1.5, sm: 2 },
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.3s ease, transform 0.18s ease",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
            transform: "translateY(-4px)",
          },
          "&:hover .rv-img": {
            transform: "scale(1.04)",
          },
        }}
      >
        {/* Image — same structure as ProductCard */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            mb: 1.5,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#f7f7f7",
          }}
        >
          {hasDiscount && (
            <Zoom in style={{ transitionDelay: "100ms" }}>
              <Chip
                label={`-${item.discountPercent}%`}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 2,
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                }}
              />
            </Zoom>
          )}
          <Image
            className="rv-img"
            src={item.imageAvt}
            alt={`${item.name} — máy công cụ chính hãng`}
            fill
            sizes="(max-width: 600px) 140px, 175px"
            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
          />
        </Box>

        {/* Info — same Stack structure as ProductCard */}
        <Stack spacing={0.75}>
          {/* Status placeholder — reserves space like ProductCard */}
          <Box sx={{ minHeight: 20 }}>
            {!item.inStock && (
              <Box
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 0.8,
                  color: "#fff",
                  bgcolor: "#9e9e9e",
                  display: "inline-block",
                }}
              >
                Hết hàng
              </Box>
            )}
          </Box>

          {/* Name */}
          <Typography
            fontWeight={600}
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: { xs: 36, sm: 40 },
              lineHeight: 1.4,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {item.name}
          </Typography>

          {/* Price — strikethrough always rendered to reserve space */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={700} color="#f25c05" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
              {item.price.toLocaleString()}₫
            </Typography>
            <Typography
              sx={{
                textDecoration: "line-through",
                color: "#999",
                visibility: hasDiscount ? "visible" : "hidden",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
              }}
            >
              {item.originalPrice.toLocaleString()}₫
            </Typography>
          </Stack>

          {/* Rating — always reserves 22px height */}
          <Box sx={{ minHeight: 22 }}>
            {typeof item.rating === "number" && item.rating > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Rating
                  value={item.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                  sx={{ color: "#ffb700" }}
                />
                <Typography variant="caption" color="text.secondary">
                  ({item.rating})
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
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

  if (!mounted || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
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
            <Typography variant="caption" sx={{ color: "#bbb", fontStyle: "italic" }}>
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

          {items.length >= 6 && !isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 175,
                  aspectRatio: "1/1",
                  borderRadius: 3,
                  border: "1px dashed #ffb700",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#fff8e1" },
                  transition: "background-color 0.2s",
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 20, color: "#f25c05" }} />
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
