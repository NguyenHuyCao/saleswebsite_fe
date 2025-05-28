"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  Stack,
} from "@mui/material";
import Image from "next/image";

// Sample data
const certifications = [
  "/images/certificate/ce-certification-for-machinaries-and-machine-tools.jpg",
  "/images/certificate/435969446.png",
  "/images/certificate/images.jpeg",
];

const userImages = [
  {
    image: "/images/customer/customer1.jpeg",
    feedback: "Máy Makita rất mạnh và tiết kiệm xăng!",
  },
  {
    image: "/images/customer/customer2.jpeg",
    feedback: "Husqvarna cắt cực nhanh và ổn định.",
  },
  {
    image: "/images/customer/customer3.jpeg",
    feedback: "Stihl khởi động nhẹ và bền bỉ.",
  },
];

const BrandPageFinalSections = () => {
  return (
    <Box px={4} py={6}>
      {/* 5. Certifications & Partners */}
      <Box mb={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          CHỨNG NHẬN & ĐỐI TÁC
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {certifications.map((src, idx) => (
            <Grid size={{ xs: 6, md: 4, lg: 3 }} key={idx}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Image
                  src={src}
                  alt={`certificate-${idx}`}
                  width={200}
                  height={140}
                  style={{ objectFit: "contain" }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 6. User Gallery */}
      <Box mb={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          GÓC NGƯỞI DÙNG
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {userImages.map((user, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Card>
                <CardMedia>
                  <Image
                    src={user.image}
                    alt={`user-${idx}`}
                    width={400}
                    height={260}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography
                    fontSize={14}
                    fontStyle="italic"
                    textAlign="center"
                  >
                    {user.feedback}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 7. Final CTA */}
      <Box
        py={6}
        px={4}
        sx={{
          backgroundImage: "url(/images/banner/banner-may-cat-co.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          borderRadius: 2,
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chọn đúng thương hiệu – Tăng hiệu quả công việc ngay hôm nay
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          mt={3}
        >
          <Button variant="contained" color="warning" size="large">
            Khám phá sản phẩm
          </Button>
          <Button variant="outlined" color="inherit" size="large">
            Liên hệ để được tư vấn thêm
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default BrandPageFinalSections;
