"use client";

import React, { useRef } from "react";
import {
  Box, Typography, Grid, Chip, Button,
  Paper, Divider, Stack, Skeleton,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useNewsList } from "@/features/user/news/queries";

import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PushPinIcon from "@mui/icons-material/PushPin";

const PLACEHOLDER = "/images/news/placeholder.jpg";
const TRENDING_TOPICS = ["Máy cắt cỏ", "Máy khoan pin", "Máy mài góc", "Máy cưa xích", "Phụ kiện", "Khuyến mãi"];

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function NewsSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { data, isLoading } = useNewsList("", 1, 4);
  const news = data?.result ?? [];
  const featuredNews = news[0];
  const otherNews = news.slice(1, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff" }}>
        <Box>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: { xs: 2, md: 4 } }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ bgcolor: "#f25c05", width: 48, height: 48, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArticleIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>Tin tức & Sự kiện</Typography>
                  <Typography variant="body2" color="text.secondary">Cập nhật những thông tin mới nhất</Typography>
                </Box>
              </Stack>
              <Button onClick={() => router.push("/new")} endIcon={<ArrowForwardIcon />}
                sx={{ color: "#f25c05", fontWeight: 600, textTransform: "none" }}>
                Xem tất cả
              </Button>
            </Stack>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 2 }} />)}
                </Stack>
              </Grid>
            </Grid>
          ) : news.length === 0 ? (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", border: "2px dashed", borderColor: "divider", borderRadius: 3 }}>
              <ArticleIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography color="text.secondary">Chưa có tin tức nào được xuất bản</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {/* Featured */}
              <Grid size={{ xs: 12, md: 7 }}>
                {featuredNews && (
                  <motion.div variants={itemVariants}>
                    <Paper
                      onClick={() => router.push(`/new/${featuredNews.slug}`)}
                      sx={{
                        borderRadius: 3, overflow: "hidden", cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": { boxShadow: "0 8px 24px rgba(242,92,5,0.15)" },
                      }}
                    >
                      <Box sx={{ position: "relative", height: { xs: 240, md: 300 } }}>
                        <Image
                          src={featuredNews.thumbnail || PLACEHOLDER}
                          alt={featuredNews.title}
                          fill style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 60vw"
                          unoptimized
                        />
                        <Box sx={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 1 }}>
                          {featuredNews.category && (
                            <Chip label={featuredNews.category} size="small"
                              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 600, fontSize: "0.7rem", height: 24 }} />
                          )}
                          {featuredNews.pinned && (
                            <Chip icon={<PushPinIcon sx={{ fontSize: 12 }} />} label="Ghim" size="small"
                              sx={{ bgcolor: "#ffb700", color: "#000", fontWeight: 600, fontSize: "0.7rem", height: 24 }} />
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{featuredNews.title}</Typography>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarTodayIcon sx={{ fontSize: 16, color: "#999" }} />
                            <Typography variant="caption" color="text.secondary">
                              {fmtDate(featuredNews.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {featuredNews.viewCount.toLocaleString("vi-VN")} lượt xem
                          </Typography>
                        </Stack>
                        {featuredNews.summary && (
                          <Typography variant="body2" color="text.secondary">{featuredNews.summary}</Typography>
                        )}
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </Grid>

              {/* Other news */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                  {otherNews.map((item, idx) => (
                    <motion.div key={item.id} variants={itemVariants} transition={{ delay: 0.1 + idx * 0.1 }}>
                      <Paper
                        onClick={() => router.push(`/new/${item.slug}`)}
                        sx={{
                          display: "flex", gap: 2, p: 2, borderRadius: 2, cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.3s ease",
                          "&:hover": { boxShadow: "0 4px 16px rgba(242,92,5,0.1)", bgcolor: "action.hover" },
                        }}
                      >
                        <Box sx={{ position: "relative", width: 80, height: 80, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "action.hover" }}>
                          <Image
                            src={item.thumbnail || PLACEHOLDER}
                            alt={item.title} fill style={{ objectFit: "cover" }} sizes="80px" unoptimized
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            {item.category && (
                              <Chip label={item.category} size="small"
                                sx={{ bgcolor: "action.selected", fontSize: "0.6rem", height: 20 }} />
                            )}
                          </Stack>
                          <Typography fontWeight={600} fontSize={14}
                            sx={{ mb: 0.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {item.title}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="caption" color="text.secondary">{fmtDate(item.createdAt)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.viewCount.toLocaleString("vi-VN")} lượt xem
                            </Typography>
                          </Stack>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* Trending Topics */}
          <motion.div variants={itemVariants} transition={{ delay: 0.5 }}>
            <Divider sx={{ my: 4 }}>
              <Chip icon={<LocalFireDepartmentIcon />} label="Chủ đề được quan tâm"
                sx={{ bgcolor: "action.hover", color: "#f25c05", fontWeight: 600 }} />
            </Divider>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
              {TRENDING_TOPICS.map((topic) => (
                <motion.div key={topic} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Chip label={topic} onClick={() => router.push(`/new?q=${topic}`)}
                    sx={{ "&:hover": { bgcolor: "#f25c05", color: "#fff" }, transition: "all 0.3s", cursor: "pointer" }} />
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
