// src/features/user/news/components/NewsDetailView.tsx
"use client";

import {
  Container,
  Grid,
  Box,
  Skeleton,
  Alert,
  Breadcrumbs,
  Typography,
  Paper,
  Chip,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Button,
  Tooltip,
  Fade,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckIcon from "@mui/icons-material/Check";

import { useNewsDetail, useRelatedNews, useNewsList } from "../queries";
import DOMPurify from "isomorphic-dompurify";

const NEWS_CATEGORIES = [
  "Kiến thức kỹ thuật",
  "Tin tức sản phẩm",
  "Hướng dẫn sử dụng",
  "Khuyến mãi & Ưu đãi",
  "Tin tức ngành",
];

const PLACEHOLDER = "/images/banner/banner-ab.jpg";

function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getReadTime(content?: string | null, summary?: string | null): number {
  const text = (content || summary || "").replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function DetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Skeleton variant="text" width={360} height={24} sx={{ mb: 3 }} />
      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Skeleton variant="rounded" width={90} height={28} />
              <Stack direction="row" spacing={2}>
                <Skeleton width={80} height={18} />
                <Skeleton width={70} height={18} />
                <Skeleton width={60} height={18} />
              </Stack>
            </Stack>
            <Skeleton height={44} width="90%" sx={{ mb: 1 }} />
            <Skeleton height={44} width="70%" sx={{ mb: 2.5 }} />
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box>
                <Skeleton width={100} height={18} sx={{ mb: 0.5 }} />
                <Skeleton width={140} height={14} />
              </Box>
            </Stack>
            <Skeleton variant="rounded" sx={{ mb: 3, borderRadius: 2.5, aspectRatio: "16/9" }} />
            <Skeleton variant="rounded" height={80} sx={{ mb: 3, borderRadius: 2 }} />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={22} width={i % 3 === 2 ? "60%" : "100%"} sx={{ mb: 0.75 }} />
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3, mb: 2.5 }} />
          <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

interface Props {
  slug: string;
}

export default function NewsDetailView({ slug }: Props) {
  const router = useRouter();
  const { data: post, isLoading, error } = useNewsDetail(slug);
  const { data: relatedPosts = [] } = useRelatedNews(slug, post?.category ?? undefined, 3);
  const { data: latestData } = useNewsList("", 1, 5);
  const latestPosts = latestData?.result ?? [];

  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [showMobileShare, setShowMobileShare] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
      setShowBackTop(scrolled > 420);
      setShowMobileShare(scrolled > 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) return <DetailSkeleton />;

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
          Không tìm thấy bài viết. Vui lòng thử lại hoặc quay về trang tin tức.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/new")}
          sx={{ borderColor: "#f25c05", color: "#f25c05", borderRadius: 2, textTransform: "none" }}
        >
          Quay lại tin tức
        </Button>
      </Container>
    );
  }

  const readTime = getReadTime(post.content, post.summary);
  const tags = parseTags(post.tags);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openShare = (shareUrl: string) =>
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=480");

  const shareOnFacebook = () =>
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  const shareOnTelegram = () =>
    openShare(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`);
  const shareOnWhatsApp = () =>
    openShare(`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${url}`)}`);

  return (
    <>
      {/* ── Reading progress bar ── */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${readProgress}%`,
          bgcolor: "#f25c05",
          zIndex: 1400,
          transition: "width 0.1s linear",
          borderRadius: "0 2px 2px 0",
        }}
        aria-hidden="true"
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>

          {/* ── Breadcrumb ── */}
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 15 }} />}
            sx={{ mb: 3 }}
            aria-label="breadcrumb"
          >
            <NextLink
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "inherit",
                textDecoration: "none",
                fontSize: "0.85rem",
              }}
            >
              <HomeIcon sx={{ fontSize: 15 }} />
              Trang chủ
            </NextLink>
            <NextLink
              href="/new"
              style={{ color: "inherit", textDecoration: "none", fontSize: "0.85rem" }}
            >
              Tin tức
            </NextLink>
            <Typography
              color="text.primary"
              sx={{ maxWidth: { xs: 160, sm: 340 }, fontSize: "0.85rem" }}
              noWrap
            >
              {post.title}
            </Typography>
          </Breadcrumbs>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* ════ Main Content ════ */}
            <Grid size={{ xs: 12, md: 8 }}>

              {/* Article paper */}
              <Paper
                component="article"
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  mb: 3,
                  border: "1px solid #ebebeb",
                  "@media print": { border: "none", p: 0, boxShadow: "none" },
                }}
              >
                {/* Category & meta row */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ mb: 2.5 }}
                >
                  <Chip
                    label={post.category || "Tin tức"}
                    size="small"
                    sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, px: 0.5 }}
                  />
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CalendarTodayIcon sx={{ fontSize: 13, color: "#bbb" }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AccessTimeIcon sx={{ fontSize: 13, color: "#bbb" }} />
                      <Typography variant="caption" color="text.secondary">
                        {readTime} phút đọc
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <VisibilityIcon sx={{ fontSize: 13, color: "#bbb" }} />
                      <Typography variant="caption" color="text.secondary">
                        {post.viewCount ?? 0} lượt xem
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {/* H1 Title */}
                <Typography
                  component="h1"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: "1.55rem", sm: "1.85rem", md: "2rem" },
                    lineHeight: 1.3,
                    mb: 2.5,
                    color: "#111",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {post.title}
                </Typography>

                {/* Author */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#f25c05",
                      fontSize: "1rem",
                      fontWeight: 700,
                    }}
                  >
                    {(post.createdBy ?? "C").charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: "0.875rem", lineHeight: 1.3 }}>
                      {post.createdBy || "Cường Hoa"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Chuyên gia tư vấn máy công cụ
                    </Typography>
                  </Box>
                </Stack>

                {/* Hero image — aspect ratio 16:9 */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 2.5,
                    overflow: "hidden",
                    mb: 3,
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <Image
                    src={post.thumbnail || PLACEHOLDER}
                    alt={post.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 700px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                {/* Summary / lead paragraph */}
                {post.summary && (
                  <Box
                    sx={{
                      fontStyle: "italic",
                      color: "#444",
                      bgcolor: "#fff8f0",
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      borderLeft: "4px solid #f25c05",
                      mb: 3.5,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      lineHeight: 1.75,
                    }}
                  >
                    {post.summary}
                  </Box>
                )}

                {/* ── Article body ── */}
                <Box
                  sx={{
                    lineHeight: 1.9,
                    fontSize: { xs: "0.975rem", sm: "1.05rem" },
                    color: "#2a2a2a",
                    "& > *:first-of-type": { mt: 0 },
                    "& p": { mb: 2, mt: 0 },
                    "& h2": {
                      fontSize: { xs: "1.25rem", md: "1.45rem" },
                      fontWeight: 800,
                      mt: "2.5rem",
                      mb: "1rem",
                      color: "#111",
                      borderBottom: "2px solid #f25c05",
                      pb: "0.5rem",
                      lineHeight: 1.3,
                    },
                    "& h3": {
                      fontSize: { xs: "1.05rem", md: "1.2rem" },
                      fontWeight: 700,
                      mt: "2rem",
                      mb: "0.75rem",
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                    },
                    "& h4": {
                      fontSize: "1rem",
                      fontWeight: 700,
                      mt: "1.5rem",
                      mb: "0.5rem",
                      color: "#222",
                    },
                    "& img": {
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      display: "block",
                      mx: "auto",
                      my: "1.75rem",
                    },
                    "& figure": {
                      mx: 0,
                      my: "1.75rem",
                      textAlign: "center",
                      "& figcaption": {
                        fontSize: "0.82rem",
                        color: "#888",
                        mt: "0.5rem",
                        fontStyle: "italic",
                      },
                    },
                    "& blockquote": {
                      borderLeft: "4px solid #f25c05",
                      bgcolor: "#fff8f0",
                      p: "1rem 1.25rem",
                      fontStyle: "italic",
                      color: "#555",
                      my: "1.75rem",
                      borderRadius: "0 8px 8px 0",
                      "& p": { mb: 0 },
                    },
                    "& ul": { pl: "1.5rem", mb: "1.25rem", mt: 0 },
                    "& ol": { pl: "1.5rem", mb: "1.25rem", mt: 0 },
                    "& li": { mb: "0.4rem", lineHeight: 1.75 },
                    "& a": { color: "#f25c05", textUnderlineOffset: 3, fontWeight: 500 },
                    "& a:hover": { color: "#e64a19" },
                    "& strong": { fontWeight: 700, color: "#111" },
                    "& em": { fontStyle: "italic" },
                    "& hr": { border: "none", borderTop: "1px solid #eee", my: "2rem" },
                    "& table": {
                      width: "100%",
                      borderCollapse: "collapse",
                      mb: "1.5rem",
                      fontSize: "0.9rem",
                      overflowX: "auto",
                      display: "block",
                    },
                    "& th, & td": {
                      border: "1px solid #e0e0e0",
                      px: "0.75rem",
                      py: "0.5rem",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    },
                    "& th": { bgcolor: "#f8f8f8", fontWeight: 700, color: "#333" },
                    "& tr:nth-of-type(even)": { bgcolor: "#fafafa" },
                    "& pre": {
                      bgcolor: "#f4f4f4",
                      border: "1px solid #e8e8e8",
                      p: "1rem",
                      borderRadius: "8px",
                      overflowX: "auto",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      mb: "1.5rem",
                    },
                    "& code": {
                      bgcolor: "#f0f0f0",
                      px: "0.35rem",
                      py: "0.1rem",
                      borderRadius: "4px",
                      fontSize: "0.875em",
                      fontFamily: "monospace",
                    },
                    "& pre code": { bgcolor: "transparent", p: 0, fontSize: "inherit" },
                    "@media print": { fontSize: "12pt", lineHeight: 1.6 },
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }}
                  />
                </Box>

                {/* Tags */}
                {tags.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Stack direction="row" alignItems="center" flexWrap="wrap" useFlexGap gap={1}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocalOfferIcon sx={{ fontSize: 15, color: "#bbb" }} />
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          Chủ đề:
                        </Typography>
                      </Stack>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onClick={() => router.push(`/new?q=${encodeURIComponent(tag)}`)}
                          sx={{
                            bgcolor: "#f5f5f5",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            transition: "all 0.18s",
                            "&:hover": { bgcolor: "#fff0e6", color: "#f25c05" },
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Share (inside article, desktop) */}
                <Divider sx={{ my: 3 }} />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ShareIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={700}>
                      Chia sẻ bài viết
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Chia sẻ Facebook" arrow>
                      <IconButton
                        onClick={shareOnFacebook}
                        aria-label="Chia sẻ lên Facebook"
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: "#1877f2",
                          color: "#fff",
                          "&:hover": { bgcolor: "#166fe5" },
                        }}
                      >
                        <FacebookIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chia sẻ Telegram" arrow>
                      <IconButton
                        onClick={shareOnTelegram}
                        aria-label="Chia sẻ lên Telegram"
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: "#26A5E4",
                          color: "#fff",
                          "&:hover": { bgcolor: "#229ed9" },
                        }}
                      >
                        <TelegramIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chia sẻ WhatsApp" arrow>
                      <IconButton
                        onClick={shareOnWhatsApp}
                        aria-label="Chia sẻ lên WhatsApp"
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: "#25D366",
                          color: "#fff",
                          "&:hover": { bgcolor: "#20bd59" },
                        }}
                      >
                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={copied ? "Đã sao chép!" : "Sao chép link"} arrow>
                      <IconButton
                        onClick={handleCopyLink}
                        aria-label="Sao chép link bài viết"
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: copied ? "#4caf50" : "#f25c05",
                          color: "#fff",
                          transition: "background-color 0.3s",
                          "&:hover": { bgcolor: copied ? "#43a047" : "#e64a19" },
                        }}
                      >
                        {copied ? (
                          <CheckIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>

              {/* ── Related Posts ── */}
              {relatedPosts.length > 0 && (
                <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: "1px solid #ebebeb" }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: "#f25c05", borderRadius: 1 }} />
                    <Typography variant="h6" fontWeight={800}>
                      Bài viết liên quan
                    </Typography>
                  </Stack>
                  <Grid container spacing={2.5}>
                    {relatedPosts.map((item) => (
                      <Grid key={item.slug} size={{ xs: 12, sm: 4 }}>
                        <NextLink
                          href={`/new/${item.slug}`}
                          style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                        >
                          <Paper
                            elevation={2}
                            sx={{
                              borderRadius: 2.5,
                              overflow: "hidden",
                              height: "100%",
                              cursor: "pointer",
                              transition: "box-shadow 0.3s ease, transform 0.18s ease",
                              "&:hover": {
                                boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                                transform: "translateY(-4px)",
                                "& .rel-title": { color: "#f25c05" },
                              },
                            }}
                          >
                            <Box sx={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", bgcolor: "#f5f5f5" }}>
                              <Image
                                src={item.thumbnail || PLACEHOLDER}
                                alt={item.title}
                                fill
                                unoptimized
                                sizes="(max-width: 600px) 50vw, 220px"
                                style={{ objectFit: "cover" }}
                              />
                              {item.category && (
                                <Chip
                                  label={item.category}
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    left: 8,
                                    bgcolor: "rgba(0,0,0,0.52)",
                                    color: "#fff",
                                    fontSize: "0.65rem",
                                    height: 20,
                                    fontWeight: 600,
                                    backdropFilter: "blur(4px)",
                                  }}
                                />
                              )}
                            </Box>
                            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                              <Typography
                                className="rel-title"
                                variant="body2"
                                fontWeight={700}
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  fontSize: "0.83rem",
                                  lineHeight: 1.45,
                                  mb: 1,
                                  transition: "color 0.2s",
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <CalendarTodayIcon sx={{ fontSize: 11, color: "#bbb" }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Paper>
                        </NextLink>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Grid>

            {/* ════ Sidebar ════ */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                spacing={2.5}
                sx={{
                  position: { md: "sticky" },
                  top: { md: 80 },
                  maxHeight: { md: "calc(100vh - 100px)" },
                  overflowY: { md: "auto" },
                  pb: { md: 2 },
                  /* Hide scrollbar on sidebar but keep scrolling */
                  "&::-webkit-scrollbar": { width: 0 },
                  scrollbarWidth: "none",
                }}
              >
                {/* Reading progress indicator — sidebar */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #ebebeb",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: "0.82rem" }}>
                      Tiến độ đọc
                    </Typography>
                    <Typography variant="caption" color="#f25c05" fontWeight={700}>
                      {Math.round(readProgress)}%
                    </Typography>
                  </Stack>
                  <Box sx={{ bgcolor: "#f0f0f0", borderRadius: 10, height: 6, overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: `${readProgress}%`,
                        bgcolor: "#f25c05",
                        borderRadius: 10,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 13, color: "#bbb" }} />
                    <Typography variant="caption" color="text.secondary">
                      {readTime} phút đọc
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mx: 0.5 }}>·</Typography>
                    <VisibilityIcon sx={{ fontSize: 13, color: "#bbb" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.viewCount ?? 0} lượt xem
                    </Typography>
                  </Stack>
                </Paper>

                {/* Categories */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #ebebeb" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocalOfferIcon sx={{ fontSize: 16, color: "#f25c05" }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
                      Danh mục
                    </Typography>
                  </Stack>
                  <Stack spacing={0.25}>
                    {NEWS_CATEGORIES.map((cat) => {
                      const isActive = post.category === cat;
                      return (
                        <NextLink
                          key={cat}
                          href={`/new?category=${encodeURIComponent(cat)}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1.5,
                              py: 0.9,
                              borderRadius: 2,
                              bgcolor: isActive ? "#fff8f0" : "transparent",
                              transition: "background-color 0.18s",
                              "&:hover": {
                                bgcolor: "#fff8f0",
                                "& .arrow-cat": { opacity: 1, transform: "translateX(3px)" },
                                "& .cat-label": { color: "#f25c05" },
                              },
                            }}
                          >
                            <Typography
                              className="cat-label"
                              variant="body2"
                              fontWeight={isActive ? 700 : 500}
                              sx={{
                                color: isActive ? "#f25c05" : "text.primary",
                                fontSize: "0.875rem",
                                transition: "color 0.18s",
                              }}
                            >
                              {cat}
                            </Typography>
                            <ArrowForwardIcon
                              className="arrow-cat"
                              sx={{
                                fontSize: 14,
                                opacity: isActive ? 1 : 0,
                                color: "#f25c05",
                                transition: "opacity 0.18s, transform 0.18s",
                              }}
                            />
                          </Box>
                        </NextLink>
                      );
                    })}
                  </Stack>
                </Paper>

                {/* Latest Posts */}
                {latestPosts.length > 0 && (
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #ebebeb" }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: "1rem" }}>
                      Bài viết mới nhất
                    </Typography>
                    <Stack spacing={0}>
                      {latestPosts.slice(0, 5).map((item, i) => {
                        const isCurrent = item.slug === slug;
                        return (
                          <NextLink
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
                                  i < Math.min(latestPosts.length, 5) - 1
                                    ? "1px solid #f3f3f3"
                                    : "none",
                                opacity: isCurrent ? 0.55 : 1,
                                pointerEvents: isCurrent ? "none" : "auto",
                                "&:hover": {
                                  "& .latest-title": { color: "#f25c05" },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 1.5,
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  bgcolor: "#f5f5f5",
                                }}
                              >
                                <Image
                                  src={item.thumbnail || PLACEHOLDER}
                                  alt={item.title}
                                  width={60}
                                  height={60}
                                  unoptimized
                                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  className="latest-title"
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    mb: 0.5,
                                    fontSize: "0.8rem",
                                    lineHeight: 1.4,
                                    transition: "color 0.18s",
                                    color: isCurrent ? "#f25c05" : "inherit",
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </NextLink>
                        );
                      })}
                    </Stack>
                  </Paper>
                )}

                {/* CTA — View all news */}
                <NextLink href="/new" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: "#e8e8e8",
                      color: "text.secondary",
                      borderRadius: 2.5,
                      py: 1.25,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#f25c05",
                        color: "#f25c05",
                        bgcolor: "#fff8f0",
                      },
                    }}
                  >
                    Xem tất cả tin tức
                  </Button>
                </NextLink>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </motion.div>

      {/* ── Mobile floating share bar ── */}
      <Fade in={showMobileShare}>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid #ebebeb",
            px: 2,
            py: 1.25,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            "@media print": { display: "none" },
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ flexShrink: 0 }}>
            Chia sẻ:
          </Typography>
          <Stack direction="row" spacing={1} flex={1} justifyContent="center">
            <IconButton
              onClick={shareOnFacebook}
              size="small"
              sx={{ bgcolor: "#1877f2", color: "#fff", width: 36, height: 36, "&:hover": { bgcolor: "#166fe5" } }}
            >
              <FacebookIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              onClick={shareOnTelegram}
              size="small"
              sx={{ bgcolor: "#26A5E4", color: "#fff", width: 36, height: 36, "&:hover": { bgcolor: "#229ed9" } }}
            >
              <TelegramIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              onClick={shareOnWhatsApp}
              size="small"
              sx={{ bgcolor: "#25D366", color: "#fff", width: 36, height: 36, "&:hover": { bgcolor: "#20bd59" } }}
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              onClick={handleCopyLink}
              size="small"
              sx={{
                bgcolor: copied ? "#4caf50" : "#f25c05",
                color: "#fff",
                width: 36,
                height: 36,
                transition: "background-color 0.3s",
                "&:hover": { bgcolor: copied ? "#43a047" : "#e64a19" },
              }}
            >
              {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Stack>
          {/* Mobile read progress mini */}
          <Typography variant="caption" fontWeight={700} color="#f25c05" sx={{ flexShrink: 0, minWidth: 32, textAlign: "right" }}>
            {Math.round(readProgress)}%
          </Typography>
        </Box>
      </Fade>

      {/* ── Back to top button ── */}
      <Fade in={showBackTop}>
        <Tooltip title="Lên đầu trang" placement="left" arrow>
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Lên đầu trang"
            sx={{
              position: "fixed",
              bottom: { xs: 72, md: 28 },
              right: { xs: 16, md: 28 },
              zIndex: 1100,
              width: 44,
              height: 44,
              bgcolor: "#f25c05",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(242,92,5,0.35)",
              transition: "background-color 0.2s, transform 0.2s",
              "&:hover": {
                bgcolor: "#e64a19",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(242,92,5,0.4)",
              },
              "@media print": { display: "none" },
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Fade>
    </>
  );
}
