"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Container,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";

// Icons
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const news = [
  {
    id: 1,
    title: "Khám phá các công cụ tăng năng suất 2023",
    date: "23/08/2023",
    excerpt:
      "Năm mới đang đến gần, đây là thời điểm lý tưởng để nâng cấp dụng cụ cơ khí của bạn với những công nghệ mới nhất...",
    image: "/images/news/images.jpeg",
    category: "Công nghệ mới",
    views: 1234,
    isNew: true,
  },
  {
    id: 2,
    title: "TOP 5 máy mài pin nhỏ tốt nhất hiện nay",
    date: "23/08/2023",
    excerpt:
      "Công nghệ pin đang thay đổi cách chúng ta sử dụng dụng cụ cơ khí. Dưới đây là top 5 máy mài pin đáng mua nhất...",
    image: "/images/news/images.jpeg",
    category: "Đánh giá",
    views: 856,
    isNew: true,
  },
  {
    id: 3,
    title: "Thử nghiệm gói dụng cụ điện mới 2023",
    date: "22/08/2023",
    excerpt:
      "Hòa vào xu hướng công nghiệp 4.0, các thương hiệu dụng cụ cơ khí đã cho ra mắt nhiều sản phẩm cải tiến...",
    image: "/images/news/images.jpeg",
    category: "Thử nghiệm",
    views: 567,
    isNew: false,
  },
  {
    id: 4,
    title: "5 lời khuyên trước khi mua dụng cụ cầm tay",
    date: "21/08/2023",
    excerpt:
      "Dụng cụ cầm tay là khoản đầu tư lâu dài. Hãy tham khảo những lời khuyên từ chuyên gia trước khi quyết định mua...",
    image: "/images/news/z2818887202266_c1eb1e8b1e19c647d4fb8dc49f910cac.jpg",
    category: "Kinh nghiệm",
    views: 345,
    isNew: false,
  },
];

export default function NewsSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const featuredNews = news[0];
  const otherNews = news.slice(1, 4);

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

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const trendingTopics = [
    "Máy cắt cỏ",
    "Máy khoan pin",
    "Máy mài góc",
    "Máy cưa xích",
    "Phụ kiện",
    "Khuyến mãi",
  ];

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    bgcolor: "#f25c05",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArticleIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="#333">
                    Tin tức & Sự kiện
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cập nhật những thông tin mới nhất
                  </Typography>
                </Box>
              </Stack>

              <Button
                onClick={() => router.push("/news")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: "#f25c05",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { gap: 1 },
                }}
              >
                Xem tất cả
              </Button>
            </Stack>
          </motion.div>

          {/* Featured News - Layout 2 cột */}
          <Grid container spacing={3}>
            {/* Main Featured */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  onClick={() => router.push(`/new/${featuredNews.id}`)}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(242,92,5,0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{ position: "relative", height: { xs: 240, md: 300 } }}
                  >
                    <Box
                      component="img"
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={featuredNews.category}
                        size="small"
                        sx={{
                          bgcolor: "#f25c05",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 24,
                        }}
                      />
                      {featuredNews.isNew && (
                        <Chip
                          icon={<FiberNewIcon sx={{ fontSize: 14 }} />}
                          label="Mới"
                          size="small"
                          sx={{
                            bgcolor: "#ffb700",
                            color: "#000",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {featuredNews.title}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: "#999" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {featuredNews.date}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {featuredNews.views} lượt xem
                      </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {featuredNews.excerpt}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Other News - List */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                {otherNews.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                  >
                    <Paper
                      onClick={() => router.push(`/new/${item.id}`)}
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 16px rgba(242,92,5,0.1)",
                          bgcolor: "#fff8f0",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 0.5 }}
                        >
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              bgcolor: "#f5f5f5",
                              fontSize: "0.6rem",
                              height: 20,
                            }}
                          />
                          {item.isNew && (
                            <Chip
                              label="Mới"
                              size="small"
                              sx={{
                                bgcolor: "#ffb700",
                                fontSize: "0.6rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Stack>

                        <Typography
                          fontWeight={600}
                          fontSize={14}
                          sx={{
                            mb: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.views} lượt xem
                          </Typography>
                        </Stack>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Trending Topics */}
          <motion.div variants={itemVariants} transition={{ delay: 0.5 }}>
            <Divider sx={{ my: 4 }}>
              <Chip
                icon={<LocalFireDepartmentIcon />}
                label="Chủ đề được quan tâm"
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
              sx={{
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {trendingTopics.map((topic, idx) => (
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
                      color: "#333",
                      "&:hover": {
                        bgcolor: "#f25c05",
                        color: "#fff",
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
