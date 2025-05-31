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

const articles = [
  {
    title:
      "Cách tận dụng tối đa máy rửa áp lực, mẹo và thủ thuật từ các bậc thầy.",
    summary:
      "Máy rửa áp lực là một công cụ cơ khí sử dụng áp lực cao để làm sạch các bề mặt khác nhau, tránh bề mặt dễ bị hỏng...",
    date: "23",
    month: "T08",
    image: "/images/articles/may-cua-la-gi-1.jpg",
  },
  {
    title: "Top 10 công cụ phải có trong gói công cụ của bạn",
    summary:
      "Sự thành công trong ngành cơ khí không chỉ đòi hỏi kỹ thuật mà còn phụ thuộc vào kiến thức chuyên môn...",
    date: "23",
    month: "T08",
    image: "/images/articles/May-cua-xich-la-gi.png",
  },
  {
    title:
      "Trước bất kỳ dự án nào, hãy quan tâm đến sự an toàn của bạn. Kiểm tra thiết bị mới",
    summary:
      "Ngày càng có nhiều dự án cơ khí lớn nhỏ triển khai trên toàn thế giới...",
    date: "23",
    month: "T08",
    image: "/images/articles/Sử dụng máy cưa xích để cưa cây.png",
  },
];

const KnowledgeShare = () => {
  const router = useRouter();

  return (
    <Box px={3} py={5}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        CHIA SẺ <span style={{ color: "#ffb700" }}>KIẾN THỨC</span>
      </Typography>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box onClick={() => router.push("/new")} sx={{ cursor: "pointer" }}>
              <Card
                sx={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  ":hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      ":hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#f25c05",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 14,
                      lineHeight: 1.2,
                    }}
                  >
                    {article.date}
                    <br />
                    {article.month}
                  </Box>
                </Box>
                <CardContent>
                  <Typography
                    fontWeight={700}
                    fontSize={16}
                    sx={{
                      mb: 1,
                      transition: "color 0.3s",
                      ":hover": { color: "#f25c05" },
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {article.summary}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KnowledgeShare;
