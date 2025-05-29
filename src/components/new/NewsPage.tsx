"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";

const newsPosts = [
  {
    title: "Khám phá các công cụ để tăng năng suất của bạn vào năm 2023",
    date: "23/08/2023",
    image: "/images/news/images (1).jpeg",
  },
  {
    title: "TOP 5 máy mài pin nhỏ, hãy xem ngay!",
    date: "23/08/2023",
    image: "/images/news/images (2).jpeg",
  },
  {
    title:
      "Đã thử nghiệm gói dụng cụ điện mới năm 2023! Kiểm tra kết quả của chúng tôi",
    date: "23/08/2023",
    image: "/images/news/cat-gx35-500x667-1.jpg",
  },
  {
    title: "Chuyên gia thấu hiểu 5 lời khuyên quan trọng trước khi mua dụng cụ",
    date: "23/08/2023",
    image: "/images/news/images.jpeg",
  },
  {
    title:
      "Xem bộ sưu tập phụ kiện công cụ mới của chúng tôi, khuyến mãi hấp dẫn",
    date: "23/08/2023",
    image: "/images/news/z2818887202266_c1eb1e8b1e19c647d4fb8dc49f910cac.jpg",
  },
  {
    title: "Hãy sẵn sàng cho đợt giảm giá mùa hè! Giảm giá lớn cho các công cụ",
    date: "23/08/2023",
    image:
      "/images/news/6670636fbeca91b81a58a6f9_Deere-company-tractor-banner.jpg",
  },
];

const NewsPage = () => {
  return (
    <Box px={3} py={6}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Tin tức
      </Typography>

      {/* Search bar */}
      <Box maxWidth={500} mb={4}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm bài viết..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {newsPosts.map((post, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    ":hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box mb={1}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={240}
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </Box>
                  <Typography fontWeight={600} fontSize={16} gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.date}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#ffb700">
              Danh mục tin tức
            </Typography>
            <List>
              {[
                "Trang chủ",
                "Giới thiệu",
                "Sản phẩm",
                "Sản phẩm khuyến mãi",
                "Tin tức",
                "Liên hệ",
                "Câu hỏi thường gặp",
              ].map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#ffb700" mb={2}>
              Tin mới nhất
            </Typography>
            {newsPosts.slice(0, 5).map((item, idx) => (
              <Box key={idx} display="flex" gap={1} mb={2}>
                <Box>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={60}
                    height={60}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                </Box>
                <Box>
                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography fontSize={12} color="gray">
                    {item.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewsPage;
