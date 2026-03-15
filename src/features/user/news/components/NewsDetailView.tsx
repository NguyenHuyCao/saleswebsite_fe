// src/features/new/components/NewsDetailView.tsx
"use client";

import {
  Container,
  Grid,
  Box,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Typography,
  Paper,
  Chip,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useNewsDetail, useRelatedNews, useNewsList } from "../queries";
import { categories } from "../data";
import { useState } from "react";

interface Props {
  slug: string;
}

export default function NewsDetailView({ slug }: Props) {
  const router = useRouter();
  const { data: post, isLoading, error } = useNewsDetail(slug);
  const { data: relatedPosts = [] } = useRelatedNews(slug, post?.category, 3);
  const { data: latestPosts } = useNewsList("", 1, 5);

  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={30} />
        <Skeleton variant="text" height={30} />
        <Skeleton variant="text" height={30} />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Không tìm thấy bài viết. Vui lòng quay lại sau.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push("/new")}
          sx={{ mt: 2, bgcolor: "#f25c05" }}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
      "_blank",
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${post.title} - ${url}`)}`,
      "_blank",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            color="inherit"
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Trang chủ
          </Link>
          <Link
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/new")}
          >
            Tin tức
          </Link>
          <Typography color="text.primary" sx={{ maxWidth: 300 }} noWrap>
            {post.title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Hero Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              {/* Category & Meta */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Chip
                  label={post.category || "Tin tức"}
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: "#999" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.date || post.publishedAt}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <VisibilityIcon sx={{ fontSize: 16, color: "#999" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.views || 0} lượt xem
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CommentIcon sx={{ fontSize: 16, color: "#999" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.comments || 0} bình luận
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Title */}
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </Typography>

              {/* Author */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Avatar src={post.authorAvatar} sx={{ width: 48, height: 48 }}>
                  {post.author?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>
                    {post.author || "Admin"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chuyên gia tư vấn
                  </Typography>
                </Box>
              </Stack>

              {/* Featured Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 250, md: 400 },
                  borderRadius: 3,
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </Box>

              {/* Excerpt */}
              {post.excerpt && (
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    color: "#666",
                    bgcolor: "#f5f5f5",
                    p: 2,
                    borderRadius: 2,
                    borderLeft: "4px solid #f25c05",
                    mb: 3,
                  }}
                >
                  {post.excerpt}
                </Typography>
              )}

              {/* Content */}
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  color: "#333",
                  "& p": { mb: 2 },
                  "& h2": {
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    mt: 3,
                    mb: 2,
                    color: "#f25c05",
                  },
                  "& h3": {
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    mt: 2,
                    mb: 1.5,
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 2,
                    my: 2,
                  },
                  "& blockquote": {
                    borderLeft: "4px solid #f25c05",
                    bgcolor: "#f5f5f5",
                    p: 2,
                    fontStyle: "italic",
                    my: 2,
                  },
                  "& ul, & ol": {
                    pl: 3,
                    mb: 2,
                  },
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
              </Box>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Chủ đề liên quan:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onClick={() => router.push(`/new?tag=${tag}`)}
                          sx={{
                            bgcolor: "#f5f5f5",
                            "&:hover": { bgcolor: "#ffb700" },
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Paper>

            {/* Share Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShareIcon sx={{ color: "#f25c05" }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Chia sẻ bài viết
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={shareOnFacebook}
                    sx={{
                      bgcolor: "#1877f2",
                      color: "#fff",
                      "&:hover": { bgcolor: "#166fe5" },
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    onClick={shareOnTelegram}
                    sx={{
                      bgcolor: "#26A5E4",
                      color: "#fff",
                      "&:hover": { bgcolor: "#229ed9" },
                    }}
                  >
                    <TelegramIcon />
                  </IconButton>
                  <IconButton
                    onClick={shareOnWhatsApp}
                    sx={{
                      bgcolor: "#25D366",
                      color: "#fff",
                      "&:hover": { bgcolor: "#20bd59" },
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleCopyLink}
                    sx={{
                      bgcolor: "#f25c05",
                      color: "#fff",
                      "&:hover": { bgcolor: "#e64a19" },
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Stack>
              </Stack>
              {copied && (
                <Typography
                  variant="caption"
                  color="success.main"
                  sx={{ mt: 1, display: "block", textAlign: "right" }}
                >
                  Đã sao chép link!
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Categories */}
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
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
                    <Box
                      key={cat.name}
                      onClick={() => router.push(cat.path)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "#fff8f0",
                          "& .arrow": {
                            transform: "translateX(5px)",
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Typography variant="body2">{cat.name}</Typography>
                      <ArrowForwardIcon
                        className="arrow"
                        sx={{
                          fontSize: 16,
                          opacity: 0,
                          transition: "all 0.3s",
                          color: "#f25c05",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* Latest Posts */}
              {latestPosts?.result && latestPosts.result.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2, color: "#f25c05" }}
                  >
                    Bài viết mới nhất
                  </Typography>
                  <Stack spacing={2}>
                    {latestPosts.result.slice(0, 5).map((item) => (
                      <Box
                        key={item.slug}
                        onClick={() => router.push(`/new/${item.slug}`)}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          cursor: "pointer",
                          p: 1,
                          borderRadius: 2,
                          "&:hover": { bgcolor: "#fff8f0" },
                        }}
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
                              overflow: "hidden",
                              mb: 0.5,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 12, color: "#999" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.date || item.publishedAt}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2, color: "#f25c05" }}
                  >
                    Bài viết liên quan
                  </Typography>
                  <Stack spacing={2}>
                    {relatedPosts.map((item) => (
                      <Box
                        key={item.slug}
                        onClick={() => router.push(`/new/${item.slug}`)}
                        sx={{
                          cursor: "pointer",
                          p: 1,
                          borderRadius: 2,
                          "&:hover": { bgcolor: "#fff8f0" },
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          variant="body2"
                          gutterBottom
                        >
                          {item.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={item.category || "Tin tức"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.6rem",
                              bgcolor: "#f5f5f5",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
