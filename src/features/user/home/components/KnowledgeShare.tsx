"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
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

export default function KnowledgeShare() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
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
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Box
                    component="img"
                    src={article.image}
                    alt={article.title}
                    sx={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography
                      fontWeight={700}
                      fontSize={16}
                      mb={0.5}
                      sx={{ ":hover": { color: "#f25c05" } }}
                    >
                      {article.title}
                    </Typography>
                    <Typography fontSize={13} color="#f25c05" mb={0.5}>
                      {article.date}/{article.month}
                    </Typography>
                    <Typography fontSize={14} color="text.secondary">
                      {article.summary}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}
