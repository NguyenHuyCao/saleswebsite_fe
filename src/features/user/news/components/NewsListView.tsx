// features/user/news/components/NewsListView.tsx
"use client";

import React, { useMemo, useState, useCallback, Suspense } from "react";
import {
  Box,
  Typography,
  Paper,
  ListItemButton,
  ListItemText,
  Skeleton,
  Chip,
  Stack,
  Button,
  Pagination,
  IconButton,
  Container,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import { useNewsList } from "../queries";
import { useDebounce } from "@/lib/hooks/useDebounce";

const NEWS_CATEGORIES = [
  "Kiến thức kỹ thuật",
  "Tin tức sản phẩm",
  "Hướng dẫn sử dụng",
  "Khuyến mãi & Ưu đãi",
  "Tin tức ngành",
];

const PLACEHOLDER = "/images/banner/banner-ab.jpg";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function getReadTime(content?: string | null, summary?: string | null): number {
  const text = (content || summary || "").replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

function NewsListSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, md: 4 } }}>
        <Skeleton variant="text" width={240} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={84} sx={{ mb: 3, borderRadius: 3 }} />
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6 }}>
              <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

function NewsListContent() {
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const keyword = useDebounce(inputValue, 400);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => searchParams.get("category") ?? ""
  );
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const pageSize = 9;

  const { data, isLoading } = useNewsList(keyword, page, pageSize, selectedCategory);
  const posts = data?.result ?? [];
  const totalPages = data?.meta?.pages ?? 1;

  const showFeatured = !keyword && !selectedCategory && page === 1;
  const featuredPost = showFeatured && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  const popularTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => parseTags(p.tags).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 12);
  }, [posts]);

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  }, []);

  const handleInputChange = useCallback((val: string) => {
    setInputValue(val);
    setPage(1);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setInputValue(tag);
    setSelectedCategory("");
    setPage(1);
  }, []);

  const handleShareCard = useCallback(
    async (slug: string, title: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const url = `${window.location.origin}/new/${slug}`;
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch {
          /* user cancelled */
        }
      } else {
        await navigator.clipboard.writeText(url);
        setSnackbar({ open: true, message: "Đã sao chép link bài viết!", severity: "success" });
      }
    },
    []
  );

  const handleSubscribe = useCallback(async () => {
    if (!email.includes("@")) {
      setSnackbar({
        open: true,
        message: "Email không hợp lệ, vui lòng kiểm tra lại.",
        severity: "error",
      });
      return;
    }
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubscribing(false);
    setEmail("");
    setSnackbar({ open: true, message: "Đăng ký nhận tin thành công!", severity: "success" });
  }, [email]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, md: 4 } }}>
        {/* Page Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Box sx={{ width: 4, height: 32, bgcolor: "#f25c05", borderRadius: 1 }} />
              <Typography
                component="h1"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}
              >
                Tin tức & Kiến thức
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ pl: "20px" }}>
              Cập nhật thông tin mới nhất về máy công cụ 2 thì, hướng dẫn sử dụng và khuyến mãi
            </Typography>
          </Box>
        </motion.div>

        {/* Search & Filter */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Paper
            elevation={0}
            sx={{
              mb: { xs: 3, md: 4 },
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Search input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                bgcolor: "action.hover",
                borderRadius: 2,
                px: 2,
                py: 0.5,
                border: "1.5px solid transparent",
                transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
                "&:focus-within": {
                  borderColor: "#f25c05",
                  boxShadow: "0 0 0 3px rgba(242,92,5,0.1)",
                  bgcolor: "background.paper",
                },
              }}
            >
              <SearchIcon sx={{ color: "text.disabled", flexShrink: 0 }} />
              <Box
                component="input"
                placeholder="Tìm kiếm bài viết..."
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e.target.value)
                }
                aria-label="Tìm kiếm bài viết tin tức"
                sx={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  bgcolor: "transparent",
                  fontSize: "0.95rem",
                  color: "text.primary",
                  py: 1,
                  "&::placeholder": { color: "text.disabled" },
                }}
              />
              {inputValue && (
                <IconButton
                  size="small"
                  onClick={() => handleInputChange("")}
                  aria-label="Xóa tìm kiếm"
                  sx={{ color: "text.disabled", p: 0.5 }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            {/* Category chips */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ mr: 0.5, flexShrink: 0 }}
              >
                Danh mục:
              </Typography>
              {["Tất cả", ...NEWS_CATEGORIES].map((cat) => {
                const isActive = cat === "Tất cả" ? !selectedCategory : selectedCategory === cat;
                return (
                  <Box
                    key={cat}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCategorySelect(cat === "Tất cả" ? "" : cat)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCategorySelect(cat === "Tất cả" ? "" : cat)
                    }
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: 10,
                      fontSize: "0.8rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      border: "1.5px solid",
                      borderColor: isActive ? "#f25c05" : "divider",
                      bgcolor: isActive ? "#f25c05" : "background.paper",
                      color: isActive ? "#fff" : "text.secondary",
                      transition: "all 0.18s ease",
                      userSelect: "none",
                      outline: "none",
                      "&:hover": {
                        borderColor: "#f25c05",
                        color: isActive ? "#fff" : "#f25c05",
                        bgcolor: isActive ? "#e64a19" : "rgba(242,92,5,0.05)",
                      },
                      "&:focus-visible": { boxShadow: "0 0 0 2px rgba(242,92,5,0.4)" },
                    }}
                  >
                    {cat}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </motion.div>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* ── Main Content ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Link
                  href={`/new/${featuredPost.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      mb: { xs: 3, md: 4 },
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "box-shadow 0.3s ease, transform 0.18s ease",
                      "&:hover": {
                        boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                        transform: "translateY(-4px)",
                        "& .featured-title": { color: "#f25c05" },
                      },
                    }}
                  >
                    <Grid container>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            position: "relative",
                            height: { xs: 220, sm: "100%" },
                            minHeight: { sm: 280 },
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={featuredPost.thumbnail || PLACEHOLDER}
                            alt={featuredPost.title}
                            fill
                            unoptimized
                            priority
                            sizes="(max-width: 600px) 100vw, 50vw"
                            style={{ objectFit: "cover" }}
                          />
                          <Chip
                            label={featuredPost.pinned ? "Nổi bật" : (featuredPost.category || "Tin tức")}
                            size="small"
                            icon={
                              featuredPost.pinned ? (
                                <WhatshotIcon sx={{ fontSize: "14px !important", color: "#fff !important" }} />
                              ) : undefined
                            }
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              bgcolor: "#f25c05",
                              color: "#fff",
                              fontWeight: 700,
                              zIndex: 2,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            p: { xs: 2.5, sm: 3 },
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          {featuredPost.category && (
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              sx={{ color: "#f25c05", mb: 1, display: "block", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.72rem" }}
                            >
                              {featuredPost.category}
                            </Typography>
                          )}
                          <Typography
                            className="featured-title"
                            variant="h5"
                            fontWeight={700}
                            sx={{
                              mb: 1.5,
                              fontSize: { xs: "1.1rem", sm: "1.2rem" },
                              lineHeight: 1.45,
                              transition: "color 0.2s",
                            }}
                          >
                            {featuredPost.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: 1.65,
                              fontSize: "0.875rem",
                            }}
                          >
                            {featuredPost.summary}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: "auto" }} flexWrap="wrap" useFlexGap>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <CalendarTodayIcon sx={{ fontSize: 12, color: "#bbb" }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(featuredPost.createdAt)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <AccessTimeIcon sx={{ fontSize: 12, color: "#bbb" }} />
                              <Typography variant="caption" color="text.secondary">
                                {getReadTime(featuredPost.content, featuredPost.summary)} phút đọc
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <VisibilityIcon sx={{ fontSize: 12, color: "#bbb" }} />
                              <Typography variant="caption" color="text.secondary">
                                {featuredPost.viewCount ?? 0}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Link>
              </motion.div>
            )}

            {/* Posts Grid */}
            <Grid container spacing={2.5}>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6 }}>
                      <Paper
                        sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}
                        elevation={0}
                      >
                        <Skeleton variant="rectangular" height={190} />
                        <Box sx={{ p: 2 }}>
                          <Skeleton height={13} width={72} sx={{ mb: 1 }} />
                          <Skeleton height={20} width="90%" sx={{ mb: 0.5 }} />
                          <Skeleton height={20} width="65%" sx={{ mb: 1.5 }} />
                          <Skeleton height={13} width="95%" sx={{ mb: 0.5 }} />
                          <Skeleton height={13} width="75%" sx={{ mb: 2 }} />
                          <Stack direction="row" spacing={2}>
                            <Skeleton height={12} width={56} />
                            <Skeleton height={12} width={48} />
                            <Skeleton height={12} width={36} />
                          </Stack>
                        </Box>
                      </Paper>
                    </Grid>
                  ))
                : gridPosts.map((post, index) => (
                    <Grid key={post.slug} size={{ xs: 12, sm: 6 }}>
                      <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={index + 3}
                        style={{ height: "100%" }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            cursor: "pointer",
                            transition: "box-shadow 0.3s ease, transform 0.18s ease",
                            "&:hover": {
                              boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                              transform: "translateY(-4px)",
                              "& .card-title": { color: "#f25c05" },
                            },
                          }}
                        >
                          {/* Invisible full-card link for SEO */}
                          <Link
                            href={`/new/${post.slug}`}
                            style={{ position: "absolute", inset: 0, zIndex: 1 }}
                            aria-label={`Đọc bài: ${post.title}`}
                          />

                          {/* Thumbnail */}
                          <Box
                            sx={{
                              position: "relative",
                              height: { xs: 180, sm: 195 },
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={post.thumbnail || PLACEHOLDER}
                              alt={post.title}
                              fill
                              unoptimized
                              sizes="(max-width: 600px) 100vw, 380px"
                              style={{ objectFit: "cover" }}
                            />
                            {post.category && (
                              <Chip
                                label={post.category}
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 10,
                                  left: 10,
                                  bgcolor: "rgba(0,0,0,0.52)",
                                  color: "#fff",
                                  fontWeight: 600,
                                  zIndex: 2,
                                  fontSize: "0.68rem",
                                  height: 22,
                                  backdropFilter: "blur(4px)",
                                }}
                              />
                            )}
                          </Box>

                          {/* Content */}
                          <Box
                            sx={{
                              p: { xs: 2, sm: 2.5 },
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <Typography
                              className="card-title"
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                mb: 1,
                                fontSize: { xs: "0.9rem", sm: "0.975rem" },
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.45,
                                transition: "color 0.2s",
                              }}
                            >
                              {post.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 2,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontSize: "0.82rem",
                                lineHeight: 1.65,
                              }}
                            >
                              {post.summary}
                            </Typography>

                            {/* Meta footer */}
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mt: "auto" }}
                            >
                              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                <Stack direction="row" alignItems="center" spacing={0.4}>
                                  <CalendarTodayIcon sx={{ fontSize: 12, color: "#c0c0c0" }} />
                                  <Typography variant="caption" color="text.disabled">
                                    {formatDate(post.createdAt)}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.4}>
                                  <AccessTimeIcon sx={{ fontSize: 12, color: "#c0c0c0" }} />
                                  <Typography variant="caption" color="text.disabled">
                                    {getReadTime(post.content, post.summary)} phút
                                  </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.4}>
                                  <VisibilityIcon sx={{ fontSize: 12, color: "#c0c0c0" }} />
                                  <Typography variant="caption" color="text.disabled">
                                    {post.viewCount ?? 0}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <IconButton
                                size="small"
                                onClick={(e) => handleShareCard(post.slug, post.title, e)}
                                aria-label={`Chia sẻ bài viết ${post.title}`}
                                sx={{
                                  zIndex: 2,
                                  color: "#ccc",
                                  "&:hover": { color: "#f25c05", bgcolor: "rgba(242,92,5,0.08)" },
                                }}
                              >
                                <ShareIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
            </Grid>

            {/* Empty State */}
            {!isLoading && gridPosts.length === 0 && !featuredPost && (
              <Fade in>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 10,
                    border: "2px dashed #eee",
                    borderRadius: 4,
                  }}
                >
                  <BookmarkBorderIcon sx={{ fontSize: 48, color: "#ddd", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không tìm thấy bài viết
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Vui lòng thử lại với từ khóa hoặc danh mục khác
                  </Typography>
                  {(keyword || selectedCategory) && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        handleInputChange("");
                        setSelectedCategory("");
                      }}
                      sx={{ borderColor: "#f25c05", color: "#f25c05" }}
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                </Box>
              </Fade>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                  shape="rounded"
                  size="medium"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        bgcolor: "#f25c05",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e64a19" },
                      },
                    },
                  }}
                />
              </Stack>
            )}
          </Grid>

          {/* ── Sidebar ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 80 } }}>
              {/* Categories */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e8e8e8" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocalOfferIcon sx={{ fontSize: 18, color: "#f25c05" }} />
                    <Typography variant="h6" fontWeight={700}>
                      Danh mục
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    {NEWS_CATEGORIES.map((cat) => (
                      <ListItemButton
                        key={cat}
                        selected={selectedCategory === cat}
                        onClick={() => handleCategorySelect(cat)}
                        sx={{
                          borderRadius: 2,
                          py: 0.8,
                          "&.Mui-selected": {
                            bgcolor: "#fff8f0",
                            "& .MuiListItemText-primary": { color: "#f25c05", fontWeight: 700 },
                          },
                          "&:hover": {
                            bgcolor: "#fafafa",
                            "& .arrow-icon": { opacity: 1, transform: "translateX(4px)" },
                          },
                        }}
                      >
                        <ListItemText
                          primary={cat}
                          slotProps={{ primary: { fontSize: "0.875rem", fontWeight: 500 } }}
                        />
                        <ArrowForwardIcon
                          className="arrow-icon"
                          sx={{
                            fontSize: 15,
                            opacity: selectedCategory === cat ? 1 : 0,
                            transition: "opacity 0.2s, transform 0.2s",
                            color: "#f25c05",
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>

              {/* Latest Posts */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e8e8e8" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Bài viết mới nhất
                  </Typography>
                  <Stack spacing={0}>
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <Box key={i} display="flex" gap={1.5} sx={{ py: 1.5 }}>
                            <Skeleton
                              variant="rounded"
                              width={64}
                              height={64}
                              sx={{ flexShrink: 0, borderRadius: 2 }}
                            />
                            <Box flex={1}>
                              <Skeleton height={14} sx={{ mb: 0.5 }} />
                              <Skeleton height={14} width="70%" sx={{ mb: 0.5 }} />
                              <Skeleton height={12} width="40%" />
                            </Box>
                          </Box>
                        ))
                      : posts.slice(0, 5).map((item, i) => (
                          <Link
                            key={item.slug}
                            href={`/new/${item.slug}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Box
                              display="flex"
                              gap={1.5}
                              sx={{
                                py: 1.5,
                                borderBottom:
                                  i < Math.min(posts.length, 5) - 1 ? "1px solid #f3f3f3" : "none",
                                "&:hover": {
                                  "& .sidebar-post-title": { color: "#f25c05" },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                <Image
                                  src={item.thumbnail || PLACEHOLDER}
                                  alt={item.title}
                                  width={64}
                                  height={64}
                                  unoptimized
                                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  className="sidebar-post-title"
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    mb: 0.5,
                                    fontSize: "0.82rem",
                                    lineHeight: 1.4,
                                    transition: "color 0.2s",
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Link>
                        ))}
                  </Stack>
                </Paper>
              </motion.div>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e8e8e8" }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Từ khóa phổ biến
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                      {popularTags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onClick={() => handleTagClick(tag)}
                          sx={{
                            bgcolor: "#f5f5f5",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            transition: "background-color 0.18s, color 0.18s",
                            "&:hover": { bgcolor: "#fff0e6", color: "#f25c05" },
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>
              )}

              {/* Newsletter */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f25c05 0%, #ffb700 100%)",
                    color: "#fff",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <EmailIcon sx={{ fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
                      Đăng ký nhận tin
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, fontSize: "0.82rem" }}>
                    Nhận thông tin khuyến mãi và bài viết mới nhất qua email
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      component="input"
                      type="email"
                      placeholder="Email của bạn..."
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) =>
                        e.key === "Enter" && handleSubscribe()
                      }
                      aria-label="Nhập email đăng ký nhận tin"
                      sx={{
                        width: "100%",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: "1.5px solid rgba(255,255,255,0.35)",
                        bgcolor: "rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontSize: "0.875rem",
                        outline: "none",
                        "&::placeholder": { color: "rgba(255,255,255,0.65)" },
                        "&:focus": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.22)" },
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={subscribing}
                      onClick={handleSubscribe}
                      sx={{
                        bgcolor: "#fff",
                        color: "#f25c05",
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#fff8e1", boxShadow: "none" },
                        "&:disabled": { bgcolor: "rgba(255,255,255,0.65)" },
                      }}
                    >
                      {subscribing ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>

              {/* Promo Banner */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
                <Link href="/promotion" style={{ textDecoration: "none" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "#fff8f0",
                      border: "1.5px solid #f8d5b8",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "box-shadow 0.25s, border-color 0.25s",
                      "&:hover": {
                        boxShadow: "0 4px 16px rgba(242,92,5,0.1)",
                        borderColor: "#f25c05",
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} color="#f25c05" gutterBottom>
                      🔥 Khuyến mãi đặc biệt
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: "0.85rem" }}
                    >
                      Flash sale máy công cụ — Giảm đến 30%
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 1,
                        bgcolor: "#f25c05",
                        color: "#fff",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#e64a19", boxShadow: "none" },
                      }}
                    >
                      Xem ưu đãi
                    </Button>
                  </Paper>
                </Link>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function NewsListView() {
  return (
    <Suspense fallback={<NewsListSkeleton />}>
      <NewsListContent />
    </Suspense>
  );
}
