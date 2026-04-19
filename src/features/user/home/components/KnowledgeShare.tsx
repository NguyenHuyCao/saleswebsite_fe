"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useNewsList } from "@/features/user/news/queries";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const PLACEHOLDER = "/images/news/placeholder.jpg";

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const parseTags = (tags?: string | null): string[] =>
  tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

export default function KnowledgeShare() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch "Kiến thức kỹ thuật" & "Hướng dẫn sử dụng" bài viết
  const { data, isLoading } = useNewsList("", 1, 12, "Kiến thức kỹ thuật");
  const { data: guideData } = useNewsList("", 1, 12, "Hướng dẫn sử dụng");

  // Merge results, remove duplicates, limit to 12
  const raw = [...(data?.result ?? []), ...(guideData?.result ?? [])];
  const seen = new Set<number>();
  const articles = raw
    .filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .slice(0, 12);

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const headerVariants = {
    hidden: { y: -16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: i * 0.08,
      },
    }),
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
          <motion.div variants={headerVariants}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: { xs: 2, md: 4 },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    bgcolor: "#f25c05",
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 12px rgba(242,92,5,0.2)",
                  }}
                >
                  <MenuBookIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Chia sẻ kiến thức
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {articles.length > 0
                      ? `${articles.length} bài viết hướng dẫn`
                      : "Bài viết hướng dẫn sử dụng"}
                  </Typography>
                </Box>
              </Stack>

              {totalPages > 1 && !isMobile && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      sx={{
                        bgcolor: currentPage === 1 ? "action.hover" : "#ffb700",
                        color: currentPage === 1 ? "text.disabled" : "#000",
                        "&:hover": { bgcolor: "#f59e0b" },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      sx={{
                        bgcolor:
                          currentPage === totalPages
                            ? "action.hover"
                            : "#f25c05",
                        color:
                          currentPage === totalPages ? "text.disabled" : "#fff",
                        "&:hover": { bgcolor: "#e64a19" },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {currentPage}/{totalPages}
                  </Typography>
                </Stack>
              )}
            </Box>
          </motion.div>

          {/* Content */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))
            ) : articles.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <MenuBookIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography color="text.secondary">
                    Chưa có bài viết nào
                  </Typography>
                  <Button
                    onClick={() => router.push("/new")}
                    sx={{ mt: 2, color: "#f25c05" }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Xem tất cả tin tức
                  </Button>
                </Box>
              </Grid>
            ) : (
              currentArticles.map((article, index) => {
                const tags = parseTags(article.tags);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id} sx={{ display: "flex" }}>
                    <motion.div
                      variants={cardVariants}
                      custom={index}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        onClick={() => router.push(`/new/${article.slug}`)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          transition: "box-shadow 0.25s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(242,92,5,0.13)",
                            "& .MuiCardMedia-root": {
                              transform: "scale(1.03)",
                            },
                          },
                        }}
                      >
                        {article.category && (
                          <Chip
                            label={article.category}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              zIndex: 2,
                              bgcolor: "#f25c05",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 24,
                            }}
                          />
                        )}

                        <CardMedia
                          component="img"
                          height="200"
                          image={article.thumbnail || PLACEHOLDER}
                          alt={article.title}
                          sx={{ transition: "transform 0.5s ease" }}
                        />

                        <CardContent sx={{ flex: 1, p: 2.5 }}>
                          <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <CalendarTodayIcon
                                sx={{ fontSize: 14, color: "text.disabled" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {fmtDate(article.createdAt)}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <VisibilityIcon
                                sx={{ fontSize: 14, color: "text.disabled" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {article.viewCount.toLocaleString("vi-VN")}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              mb: 1,
                              fontSize: "1rem",
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              "&:hover": { color: "#f25c05" },
                            }}
                          >
                            {article.title}
                          </Typography>

                          {article.summary && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 2,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {article.summary}
                            </Typography>
                          )}

                          {article.createdBy && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Tác giả: {article.createdBy}
                              </Typography>
                            </Stack>
                          )}
                        </CardContent>

                        {tags.length > 0 && (
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                              gap={0.5}
                            >
                              {tags.slice(0, 2).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    bgcolor: "action.selected",
                                    fontSize: "0.6rem",
                                    height: 20,
                                  }}
                                />
                              ))}
                              {tags.length > 2 && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  +{tags.length - 2}
                                </Typography>
                              )}
                            </Stack>
                          </CardActions>
                        )}
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })
            )}
          </Grid>

          {/* Mobile Pagination */}
          {isMobile && totalPages > 1 && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ mt: 4 }}
            >
              <IconButton
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                size="small"
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {currentPage}/{totalPages}
              </Typography>
              <IconButton
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                size="small"
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          )}

          {/* View All */}
          <motion.div

            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, md: 5 } }}>
              <Button
                variant="outlined"
                onClick={() => router.push("/new")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: "#ffb700",
                  color: "#f25c05",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  "&:hover": {
                    bgcolor: "#f25c05",
                    color: "#fff",
                    borderColor: "#f25c05",
                  },
                }}
              >
                Xem tất cả bài viết
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
