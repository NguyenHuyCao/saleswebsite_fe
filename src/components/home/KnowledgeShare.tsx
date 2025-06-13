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

const articles = [
  {
    title:
      "Cách tận dụng tối đa máy rửa áp lực, mẹo và thủ thuật từ các bậc thầy.",
    summary:
      "Máy rửa áp lực là một công cụ cơ khí sử dụng áp lực cao để làm sạch các bề mặt khác nhau...",
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
    <motion.div
      initial={{ opacity: 0 }} // Start with opacity 0
      animate={{ opacity: 1 }} // Fade in to opacity 1
      transition={{ duration: 1 }} // Transition duration of 1 second
    >
      <Box px={3} py={5}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          CHIA SẺ <span style={{ color: "#ffb700" }}>KIẾN THỨC</span>
        </Typography>

        <Grid container spacing={3}>
          {articles.map((article, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() =>
                  router.push(
                    `/new?article=${encodeURIComponent(article.title)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <Card
                  sx={{
                    transition: "box-shadow 0.3s ease",
                    borderRadius: 2,
                    ":hover": {
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
                        transition: "transform 0.4s ease",
                        ":hover": {
                          transform: "scale(1.05)",
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
                        fontWeight: "bold",
                        fontSize: 14,
                        textAlign: "center",
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
                      mb={1}
                      sx={{
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
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default KnowledgeShare;
