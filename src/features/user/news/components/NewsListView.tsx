// features/user/news/components/NewsListView.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useNewsList } from "../queries";

const NEWS_CATEGORIES = [
  "Kiến thức kỹ thuật",
  "Tin tức sản phẩm",
  "Hướng dẫn sử dụng",
  "Khuyến mãi & Ưu đãi",
  "Tin tức ngành",
];

const PLACEHOLDER = "https://placehold.co/600x400?text=No+Image";

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
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function NewsListView() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const pageSize = 9;

  const { data, isLoading } = useNewsList(
    keyword,
    page,
    pageSize,
    selectedCategory,
  );
  const posts = data?.result ?? [];
  const totalPages = data?.meta?.pages ?? 1;

  // First pinned (or first) post on page 1 with no filters = featured
  const showFeatured = !keyword && !selectedCategory && page === 1;
  const featuredPost = showFeatured && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  // Collect tags from current page results
  const popularTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => parseTags(p.tags).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 12);
  }, [posts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const cardHover = {
    y: -8,
    boxShadow: "0 20px 30px rgba(242,92,5,0.15)",
    transition: { type: "spring", stiffness: 300 },
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setPage(1);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, mb: 1 }}
              >
                Tin tức & Sự kiện
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                Cập nhật những thông tin mới nhất về dụng cụ cơ khí, công nghệ
                và khuyến mãi
              </Typography>
            </Box>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Search row */}
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
                  transition: "border-color 0.2s, box-shadow 0.2s",
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
                  value={keyword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleKeywordChange(e.target.value)
                  }
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
                {keyword && (
                  <Box
                    component="button"
                    onClick={() => handleKeywordChange("")}
                    sx={{
                      border: "none",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      color: "text.disabled",
                      display: "flex",
                      alignItems: "center",
                      p: 0.5,
                      borderRadius: "50%",
                      "&:hover": { bgcolor: "action.hover", color: "text.secondary" },
                    }}
                  >
                    ✕
                  </Box>
                )}
              </Box>

              {/* Category filter row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ mr: 0.5, flexShrink: 0 }}
                >
                  Danh mục:
                </Typography>
                {["Tất cả", ...NEWS_CATEGORIES].map((cat) => {
                  const isActive =
                    cat === "Tất cả" ? !selectedCategory : selectedCategory === cat;
                  return (
                    <Box
                      key={cat}
                      onClick={() =>
                        handleCategorySelect(cat === "Tất cả" ? "" : cat)
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
                        "&:hover": {
                          borderColor: "#f25c05",
                          color: isActive ? "#fff" : "#f25c05",
                          bgcolor: isActive ? "#e64a19" : "rgba(242,92,5,0.06)",
                        },
                      }}
                    >
                      {cat}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </motion.div>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      mb: 4,
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid #ffb700",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 20px 30px rgba(242,92,5,0.15)",
                      },
                    }}
                    onClick={() => router.push(`/new/${featuredPost.slug}`)}
                  >
                    <Grid container>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            position: "relative",
                            height: { xs: 200, md: "100%" },
                            minHeight: { md: 260 },
                          }}
                        >
                          <Image
                            src={featuredPost.thumbnail || PLACEHOLDER}
                            alt={featuredPost.title}
                            fill
                            unoptimized
                            style={{ objectFit: "cover" }}
                          />
                          <Chip
                            label={featuredPost.pinned ? "Nổi bật" : "Tin tức"}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              bgcolor: "#f25c05",
                              color: "#fff",
                              fontWeight: 700,
                              zIndex: 2,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 3 }}>
                          <Chip
                            label={featuredPost.category || "Tin tức"}
                            size="small"
                            sx={{ bgcolor: "#ffb700", color: "#000", mb: 2 }}
                          />
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                            {featuredPost.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {featuredPost.summary}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <CalendarTodayIcon
                                sx={{ fontSize: 14, color: "#999" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(featuredPost.createdAt)}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <VisibilityIcon
                                sx={{ fontSize: 14, color: "#999" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {featuredPost.viewCount ?? 0}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              )}

              {/* Posts Grid */}
              <Grid container spacing={3}>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Grid key={i} size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ p: 2, borderRadius: 3 }}>
                          <Skeleton
                            variant="rounded"
                            height={180}
                            sx={{ mb: 2, borderRadius: 2 }}
                          />
                          <Skeleton height={28} width="80%" sx={{ mb: 1 }} />
                          <Skeleton height={20} width="60%" sx={{ mb: 2 }} />
                          <Stack direction="row" spacing={2}>
                            <Skeleton height={16} width={40} />
                            <Skeleton height={16} width={40} />
                          </Stack>
                        </Paper>
                      </Grid>
                    ))
                  : gridPosts.map((post, index) => (
                      <Grid key={post.slug} size={{ xs: 12, sm: 6 }}>
                        <motion.div
                          variants={itemVariants}
                          custom={index}
                          whileHover={cardHover}
                        >
                          <Paper
                            onClick={() => router.push(`/new/${post.slug}`)}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              cursor: "pointer",
                              height: "100%",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                "& .post-image": { transform: "scale(1.05)" },
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                height: 180,
                                mb: 2,
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={post.thumbnail || PLACEHOLDER}
                                alt={post.title}
                                fill
                                unoptimized
                                className="post-image"
                                style={{
                                  objectFit: "cover",
                                  transition: "transform 0.5s ease",
                                }}
                              />
                              {post.category && (
                                <Chip
                                  label={post.category}
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 12,
                                    left: 12,
                                    bgcolor: "#ffb700",
                                    color: "#000",
                                    fontWeight: 600,
                                    zIndex: 2,
                                  }}
                                />
                              )}
                            </Box>

                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                mb: 1,
                                fontSize: "1rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
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
                              }}
                            >
                              {post.summary}
                            </Typography>

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Stack direction="row" spacing={1.5}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.5}
                                >
                                  <AccessTimeIcon
                                    sx={{ fontSize: 14, color: "#999" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatDate(post.createdAt)}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={0.5}
                                >
                                  <VisibilityIcon
                                    sx={{ fontSize: 14, color: "#999" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {post.viewCount ?? 0}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <IconButton size="small" sx={{ color: "#999" }}>
                                <ShareIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
              </Grid>

              {/* Empty State */}
              {!isLoading && gridPosts.length === 0 && !featuredPost && (
                <Fade in>
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Không tìm thấy bài viết
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vui lòng thử lại với từ khóa khác
                    </Typography>
                  </Box>
                </Fade>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                    size="large"
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

            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                {/* Categories */}
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 3, border: "1px solid #f0f0f0" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 2, color: "#f25c05" }}
                    >
                      Danh mục
                    </Typography>
                    <Stack spacing={0.5}>
                      {NEWS_CATEGORIES.map((cat) => (
                        <ListItemButton
                          key={cat}
                          selected={selectedCategory === cat}
                          onClick={() => handleCategorySelect(cat)}
                          sx={{
                            borderRadius: 2,
                            "&.Mui-selected": { bgcolor: "#fff8f0" },
                            "&:hover": {
                              bgcolor: "#fff8f0",
                              "& .arrow": {
                                opacity: 1,
                                transform: "translateX(5px)",
                              },
                            },
                          }}
                        >
                          <ListItemText
                            primary={cat}
                            slotProps={{ primary: { fontWeight: 500 } }}
                          />
                          <ArrowForwardIcon
                            className="arrow"
                            sx={{
                              fontSize: 16,
                              opacity: selectedCategory === cat ? 1 : 0,
                              transition: "all 0.3s",
                              color: "#f25c05",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Latest Posts */}
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 3, border: "1px solid #f0f0f0" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 2, color: "#f25c05" }}
                    >
                      Bài viết mới nhất
                    </Typography>
                    <Stack spacing={2}>
                      {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <Box key={i} display="flex" gap={1.5}>
                              <Skeleton
                                variant="rounded"
                                width={70}
                                height={70}
                                sx={{ flexShrink: 0 }}
                              />
                              <Box flex={1}>
                                <Skeleton height={18} sx={{ mb: 0.5 }} />
                                <Skeleton height={14} width="60%" />
                              </Box>
                            </Box>
                          ))
                        : posts.slice(0, 5).map((item) => (
                            <motion.div
                              key={item.slug}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box
                                display="flex"
                                gap={1.5}
                                sx={{
                                  cursor: "pointer",
                                  p: 1,
                                  borderRadius: 2,
                                  "&:hover": { bgcolor: "#fff8f0" },
                                }}
                                onClick={() =>
                                  router.push(`/new/${item.slug}`)
                                }
                              >
                                <Box
                                  sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Image
                                    src={item.thumbnail || PLACEHOLDER}
                                    alt={item.title}
                                    width={70}
                                    height={70}
                                    unoptimized
                                    style={{
                                      objectFit: "cover",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatDate(item.createdAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            </motion.div>
                          ))}
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Popular Tags — chỉ hiện khi có tags từ API */}
                {popularTags.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2, color: "#f25c05" }}
                      >
                        Từ khóa phổ biến
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        gap={1}
                      >
                        {popularTags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onClick={() => handleKeywordChange(tag)}
                            sx={{
                              bgcolor: "#f5f5f5",
                              "&:hover": { bgcolor: "#ffb700", color: "#000" },
                              cursor: "pointer",
                            }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </motion.div>
                )}

                {/* Newsletter Signup */}
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f25c05, #ffb700)",
                      color: "#fff",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                    >
                      <EmailIcon sx={{ fontSize: 32 }} />
                      <Typography variant="h6" fontWeight={700}>
                        Đăng ký nhận tin
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                      Nhận thông tin khuyến mãi và bài viết mới nhất qua email
                    </Typography>
                    <Stack spacing={1}>
                      <TextField
                        size="small"
                        placeholder="Email của bạn"
                        fullWidth
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.3)",
                            },
                            "&:hover fieldset": { borderColor: "#fff" },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: "#fff",
                          color: "#f25c05",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                      >
                        Đăng ký
                      </Button>
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Promotion Banner */}
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "#f5f5f5",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => router.push("/promotion")}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#f25c05"
                      gutterBottom
                    >
                      Khuyến mãi đặc biệt
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Giảm đến 30% cho đơn hàng đầu tiên
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 1, borderColor: "#ffb700", color: "#f25c05" }}
                    >
                      Xem ngay
                    </Button>
                  </Paper>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
}
