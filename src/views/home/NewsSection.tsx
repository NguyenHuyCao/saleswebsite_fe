"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const news = [
  {
    title:
      "Khám phá các công cụ để tăng năng suất của bạn vào năm 2023, khuyến mãi hấp dẫn! Đừng bỏ lỡ nó",
    date: "23/08/2023",
    excerpt:
      "Năm mới đang đến gần và đây là thời điểm lý tưởng để cải thiện hiệu suất làm việc của bạn trong lĩnh vực cơ khí...",
    image: "/images/news/images (2).jpeg",
  },
  {
    title: "TOP 5 máy mài pin nhỏ, hãy xem ngay!",
    date: "23/08/2023",
    excerpt:
      "Công nghệ ngày càng phát triển đã tạo ra những dụng cụ cơ khí tiện ích...",
    image: "/images/news/images (1).jpeg",
  },
  {
    title:
      "Đã thử nghiệm gói dụng cụ điện mới năm 2023! Kiểm tra kết quả của chúng tôi trên Equipo",
    date: "23/08/2023",
    excerpt: "Hòa vào xu hướng công nghiệp 4.0, các công ty dụng cụ cơ khí...",
    image: "/images/news/images.jpeg",
  },
  {
    title:
      "Chuyên gia thấu hiểu 5 lời khuyên quan trọng trước khi mua dụng cụ cầm tay",
    date: "23/08/2023",
    excerpt:
      "Dụng cụ cầm tay là những dụng cụ không thể thiếu trong việc thực hiện các công việc cơ khí...",
    image: "/images/news/z2818887202266_c1eb1e8b1e19c647d4fb8dc49f910cac.jpg",
  },
];

const NewsSection = () => {
  const router = useRouter();

  const handleClick = (index: number) => {
    router.push(`/new?newID=${index}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start with opacity 0
      animate={{ opacity: 1 }} // Fade in to opacity 1
      transition={{ duration: 1 }} // Transition duration of 1 second
    >
      <Box px={3} py={5}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          TIN TỨC <span style={{ color: "#ffb700" }}>MỚI NHẤT</span>
        </Typography>

        <Grid container spacing={3}>
          {/* Tin nổi bật */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleClick(0)}
              style={{ cursor: "pointer" }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  height="260"
                  image={news[0].image}
                  alt={news[0].title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography fontWeight={700} fontSize={16} mb={1}>
                    {news[0].title}
                  </Typography>
                  <Typography fontSize={13} color="#f25c05" mb={1}>
                    Ngày đăng: {news[0].date}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {news[0].excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Các tin còn lại */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {news.slice(1).map((item, idx) => (
                <Grid size={{ xs: 12 }} key={idx}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleClick(idx + 1)}
                    style={{ cursor: "pointer", display: "flex", gap: 16 }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography fontWeight={600} fontSize={14} mb={0.5}>
                        {item.title}
                      </Typography>
                      <Typography fontSize={13} color="#f25c05" mb={0.5}>
                        Ngày đăng: {item.date}
                      </Typography>
                      <Typography fontSize={13} color="text.secondary">
                        {item.excerpt}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default NewsSection;
