// features/user/news/NewsListView.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  ListItemButton,
  ListItemText,
  Skeleton,
  Chip,
  Stack,
  Avatar,
  Button,
  Pagination,
  Breadcrumbs,
  Link,
  Divider,
  IconButton,
  Container,
  Fade,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { categories, newsPosts as seedPosts } from "../data";
import { useNewsList } from "../queries";

// Featured post data (có thể lấy từ API)
const featuredPost = {
  slug: "featured-post",
  title: "Top 10 máy cắt cỏ chạy xăng tốt nhất 2024",
  excerpt:
    "Khám phá những mẫu máy cắt cỏ chạy xăng được ưa chuộng nhất hiện nay, với đánh giá chi tiết về hiệu suất, độ bền và giá cả.",
  image: "/images/news/featured.jpg",
  date: "15/03/2024",
  author: "Nguyễn Văn A",
  authorAvatar: "/images/authors/author1.jpg",
  views: 1234,
  comments: 56,
  category: "Đánh giá sản phẩm",
  tags: ["máy cắt cỏ", "chạy xăng", "top 10"],
};

// Tags cloud data
const popularTags = [
  "máy cắt cỏ",
  "máy khoan",
  "máy mài",
  "máy cưa xích",
  "máy rửa xe",
  "máy phát điện",
  "máy bơm nước",
  "phụ kiện",
  "bảo trì",
  "khuyến mãi",
];

export default function NewsListView() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const pageSize = 9;

  const { data, isLoading } = useNewsList(keyword, page, pageSize);
  const serverPosts = data?.result ?? [];
  const totalPages = data?.meta?.pages ?? 1;
  const list = serverPosts.length ? serverPosts : seedPosts;

  // Filter posts based on category
  const filteredPosts = useMemo(() => {
    let posts = serverPosts.length ? serverPosts : list;

    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    if (keyword) {
      const q = keyword.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q),
      );
    }

    return posts;
  }, [list, keyword, serverPosts.length, selectedCategory]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumb */}
          {/* <motion.div variants={itemVariants}>
            <Breadcrumbs sx={{ mb: 3 }}>
              <Link
                color="inherit"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
                sx={{ cursor: "pointer", "&:hover": { color: "#f25c05" } }}
              >
                Trang chủ
              </Link>
              <Typography color="text.primary">Tin tức</Typography>
            </Breadcrumbs>
          </motion.div> */}

          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  mb: 1,
                }}
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <TextField
                fullWidth
                size="medium"
                placeholder="Tìm kiếm bài viết..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { sm: 400 },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ffb700",
                    },
                  },
                }}
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Lọc:
                </Typography>
                <Chip
                  label="Tất cả"
                  onClick={() => setSelectedCategory(null)}
                  color={selectedCategory === null ? "warning" : "default"}
                  sx={{
                    bgcolor:
                      selectedCategory === null ? "#f25c05" : "transparent",
                    color: selectedCategory === null ? "#fff" : "#666",
                  }}
                />
                {categories.slice(0, 3).map((cat) => (
                  <Chip
                    key={cat.name}
                    label={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    color={
                      selectedCategory === cat.name ? "warning" : "default"
                    }
                    sx={{
                      bgcolor:
                        selectedCategory === cat.name
                          ? "#f25c05"
                          : "transparent",
                      color: selectedCategory === cat.name ? "#fff" : "#666",
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </motion.div>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Featured Post */}
              {!keyword && !selectedCategory && page === 1 && (
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
                    onClick={() => router.push(`/news/${featuredPost.slug}`)}
                  >
                    <Grid container>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                          sx={{
                            position: "relative",
                            height: { xs: 200, md: "100%" },
                          }}
                        >
                          <Image
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <Chip
                            label="Nổi bật"
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
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                              label={featuredPost.category}
                              size="small"
                              sx={{ bgcolor: "#ffb700", color: "#000" }}
                            />
                          </Stack>

                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                          >
                            {featuredPost.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {featuredPost.excerpt}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 2 }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar
                                src={featuredPost.authorAvatar}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography variant="caption">
                                {featuredPost.author}
                              </Typography>
                            </Stack>
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
                                {featuredPost.date}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Stack direction="row" spacing={2}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <VisibilityIcon
                                sx={{ fontSize: 16, color: "#999" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {featuredPost.views}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <CommentIcon
                                sx={{ fontSize: 16, color: "#999" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {featuredPost.comments}
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
                  : filteredPosts.map((post, index) => (
                      <Grid key={post.slug} size={{ xs: 12, sm: 6 }}>
                        <motion.div
                          variants={itemVariants}
                          custom={index}
                          whileHover={cardHover}
                        >
                          <Paper
                            onClick={() => router.push(`/news/${post.slug}`)}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              cursor: "pointer",
                              height: "100%",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                "& .post-image": {
                                  transform: "scale(1.05)",
                                },
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
                                src={post.image}
                                alt={post.title}
                                fill
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
                              {post.excerpt || post.description}
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
                                    {post.date || post.publishedAt}
                                  </Typography>
                                </Stack>
                                {post.views && (
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
                                      {post.views}
                                    </Typography>
                                  </Stack>
                                )}
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
              {!isLoading && filteredPosts.length === 0 && (
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
                    <Stack spacing={1}>
                      {categories.map((cat) => (
                        <ListItemButton
                          key={cat.path}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            router.push(cat.path);
                          }}
                          sx={{
                            borderRadius: 2,
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
                            primary={cat.name}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                          <ArrowForwardIcon
                            className="arrow"
                            sx={{
                              fontSize: 16,
                              opacity: 0,
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
                      {(serverPosts.length ? serverPosts : seedPosts)
                        .slice(0, 5)
                        .map((item, idx) => (
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
                                "&:hover": {
                                  bgcolor: "#fff8f0",
                                },
                              }}
                              onClick={() => router.push(`/news/${item.slug}`)}
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
                                  src={item.image}
                                  alt={item.title}
                                  width={70}
                                  height={70}
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
                                  {item.date || item.publishedAt}
                                </Typography>
                              </Box>
                            </Box>
                          </motion.div>
                        ))}
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Popular Tags */}
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
                          onClick={() => setKeyword(tag)}
                          sx={{
                            bgcolor: "#f5f5f5",
                            "&:hover": {
                              bgcolor: "#ffb700",
                              color: "#000",
                            },
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>

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
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
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
                          "&:hover": {
                            bgcolor: "#f5f5f5",
                          },
                        }}
                      >
                        Đăng ký
                      </Button>
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Advertisement Banner */}
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
                      🎉 Khuyến mãi đặc biệt
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
                      sx={{
                        mt: 1,
                        borderColor: "#ffb700",
                        color: "#f25c05",
                      }}
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
