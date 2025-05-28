"use client";

import React from "react";
import Slider from "react-slick";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const testimonials = [
  {
    name: "Anh Minh",
    job: "Nông dân – Lâm Đồng",
    avatar: "/images/customer/customer1.jpeg",
    comment:
      "Máy 2 thì chạy bền, khởi động nhẹ nhàng. Làm vườn cả ngày không lo hỏng hóc.",
  },
  {
    name: "Chị Hương",
    job: "Thợ xây – Hà Nội",
    avatar: "/images/customer/customer2.jpeg",
    comment:
      "Tôi chọn dòng máy này vì dễ dùng và tiết kiệm nhiên liệu. Rất hài lòng!",
  },
  {
    name: "Anh Tuấn",
    job: "Kỹ sư cơ khí – Đà Nẵng",
    avatar: "/images/customer/customer3.jpeg",
    comment:
      "Cấu tạo đơn giản, dễ bảo trì. Rất phù hợp cho công trình nhỏ và vừa.",
  },
];

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <Box py={6} px={4} bgcolor="#f9f9f9">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="primary"
      >
        Ý KIẾN KHÁCH HÀNG
      </Typography>
      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <Box key={i} px={2}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                position: "relative",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={t.avatar}
                  alt={t.name}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography fontWeight={600}>{t.name}</Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {t.job}
                  </Typography>
                </Box>
              </Box>
              <Typography fontSize={15} fontStyle="italic">
                “{t.comment}”
              </Typography>
            </Paper>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TestimonialsSection;
