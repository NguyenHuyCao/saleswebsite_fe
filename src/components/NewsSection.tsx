"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box px={3} py={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        TIN TỨC <span style={{ color: "#ffb700" }}>Mới NHẤT</span>
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <CardMedia
              component="img"
              height="260"
              image={news[0].image}
              alt={news[0].title}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography fontWeight={600} fontSize={16} mb={1}>
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            {news.slice(1).map((item, idx) => (
              <Grid size={{ xs: 12 }} key={idx}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {item.title}
                    </Typography>
                    <Typography fontSize={13} color="#f25c05" mb={0.5}>
                      Ngày đăng: {item.date}
                    </Typography>
                    <Typography fontSize={13} color="text.secondary">
                      {item.excerpt}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewsSection;
