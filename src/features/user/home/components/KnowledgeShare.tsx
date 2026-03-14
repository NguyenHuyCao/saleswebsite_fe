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
  Avatar,
  Container,
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Icons
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Mock data mở rộng
const articles = [
  {
    id: 1,
    title:
      "Cách tận dụng tối đa máy rửa áp lực, mẹo và thủ thuật từ các bậc thầy",
    summary:
      "Máy rửa áp lực là một công cụ cơ khí sử dụng áp lực cao để làm sạch các bề mặt khác nhau...",
    fullContent: "Bài viết chi tiết về cách sử dụng máy rửa áp lực hiệu quả...",
    date: "2024-03-23",
    month: "T08",
    image: "/images/articles/may-cua-la-gi-1.jpg",
    category: "Hướng dẫn",
    author: "Nguyễn Văn A",
    authorAvatar: "/images/authors/author1.jpg",
    views: 1234,
    readTime: 5,
    tags: ["máy rửa áp lực", "mẹo hay", "bảo trì"],
  },
  {
    id: 2,
    title: "Top 10 công cụ phải có trong gói công cụ của bạn",
    summary:
      "Sự thành công trong ngành cơ khí không chỉ đòi hỏi kỹ thuật mà còn phụ thuộc vào kiến thức chuyên môn...",
    date: "2024-03-22",
    month: "T08",
    image: "/images/articles/May-cua-xich-la-gi.png",
    category: "Đánh giá",
    author: "Trần Thị B",
    authorAvatar: "/images/authors/author2.jpg",
    views: 2341,
    readTime: 7,
    tags: ["công cụ", "top 10", "khuyên dùng"],
  },
  {
    id: 3,
    title:
      "Trước bất kỳ dự án nào, hãy quan tâm đến sự an toàn của bạn. Kiểm tra thiết bị mới",
    summary:
      "Ngày càng có nhiều dự án cơ khí lớn nhỏ triển khai trên toàn thế giới...",
    date: "2024-03-21",
    month: "T08",
    image: "/images/articles/Sử dụng máy cưa xích để cưa cây.png",
    category: "An toàn",
    author: "Lê Văn C",
    authorAvatar: "/images/authors/author3.jpg",
    views: 856,
    readTime: 4,
    tags: ["an toàn lao động", "bảo hộ", "kiểm tra"],
  },
  {
    id: 4,
    title: "5 lỗi thường gặp khi sử dụng máy cưa xích và cách khắc phục",
    summary:
      "Máy cưa xích là công cụ mạnh mẽ nhưng cũng tiềm ẩn nhiều rủi ro nếu sử dụng không đúng cách...",
    date: "2024-03-20",
    month: "T08",
    image: "/images/articles/may-cua-xich-loi.jpg",
    category: "Kinh nghiệm",
    author: "Phạm Thị D",
    authorAvatar: "/images/authors/author4.jpg",
    views: 654,
    readTime: 6,
    tags: ["máy cưa xích", "lỗi thường gặp", "sửa chữa"],
  },
];

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function KnowledgeShare() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [currentPage, setCurrentPage] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1,
      },
    }),
  };

  // Kiểm tra scroll buttons
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <motion.div variants={headerVariants}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
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
                  <Typography variant="h5" fontWeight={800} color="#333">
                    Chia sẻ kiến thức
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {articles.length} bài viết về dụng cụ cơ khí
                  </Typography>
                </Box>
              </Stack>

              {/* Pagination Controls */}
              {totalPages > 1 && !isMobile && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      sx={{
                        bgcolor: currentPage === 1 ? "#f5f5f5" : "#ffb700",
                        color: currentPage === 1 ? "#bdbdbd" : "#000",
                        "&:hover": {
                          bgcolor: currentPage === 1 ? "#f5f5f5" : "#f59e0b",
                        },
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
                          currentPage === totalPages ? "#f5f5f5" : "#f25c05",
                        color: currentPage === totalPages ? "#bdbdbd" : "#fff",
                        "&:hover": {
                          bgcolor:
                            currentPage === totalPages ? "#f5f5f5" : "#e64a19",
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {currentPage}/{totalPages}
                  </Typography>
                </Stack>
              )}
            </Box>
          </motion.div>

          {/* Articles Grid */}
          <Grid container spacing={3}>
            {currentArticles.map((article, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                <motion.div
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    onClick={() => router.push(`/news/${article.id}`)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                        "& .MuiCardMedia-root": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {/* Category Badge */}
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

                    {/* Image */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.image}
                      alt={article.title}
                      sx={{
                        transition: "transform 0.5s ease",
                      }}
                    />

                    {/* Content */}
                    <CardContent sx={{ flex: 1, p: 2.5 }}>
                      {/* Meta Info */}
                      <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <CalendarTodayIcon
                            sx={{ fontSize: 14, color: "#999" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(article.date)}
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
                          <Typography variant="caption" color="text.secondary">
                            {article.views}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 14, color: "#999" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {article.readTime} phút
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Title */}
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

                      {/* Summary */}
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

                      {/* Author */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={article.authorAvatar}
                          alt={article.author}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {article.author}
                        </Typography>
                      </Stack>
                    </CardContent>

                    {/* Tags */}
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        gap={0.5}
                      >
                        {article.tags.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "#f5f5f5",
                              fontSize: "0.6rem",
                              height: 20,
                            }}
                          />
                        ))}
                        {article.tags.length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{article.tags.length - 2}
                          </Typography>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
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
              <Typography variant="body2" sx={{ color: "#666" }}>
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

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Button
                variant="outlined"
                onClick={() => router.push("/news")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: "#ffb700",
                  color: "#f25c05",
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#f25c05",
                    bgcolor: "#fff8f0",
                  },
                }}
              >
                Xem tất cả bài viết
              </Button>
            </Box>
          </motion.div>

          {/* Topic Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Divider sx={{ my: 4 }}>
              <Chip
                icon={<LocalOfferIcon />}
                label="Chủ đề phổ biến"
                sx={{
                  bgcolor: "#fff8e1",
                  color: "#f25c05",
                  fontWeight: 600,
                }}
              />
            </Divider>

            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1, justifyContent: "center" }}
            >
              {[
                "Máy cắt cỏ",
                "Máy khoan",
                "Máy mài",
                "Bảo trì",
                "An toàn",
                "Mẹo hay",
              ].map((topic) => (
                <motion.div
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={topic}
                    onClick={() => router.push(`/news?topic=${topic}`)}
                    sx={{
                      bgcolor: "#f5f5f5",
                      "&:hover": {
                        bgcolor: "#ffb700",
                        color: "#000",
                      },
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
}
