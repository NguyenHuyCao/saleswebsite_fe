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
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

export default function BrandPageFinalSections() {
  const router = useRouter();

  return (
    <Box px={4} py={6}>
      {/* 1. Chứng nhận & đối tác */}
      <Box mb={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          CHỨNG NHẬN & ĐỐI TÁC
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {certifications.map((src, idx) => (
            <Grid size={{xs:6, md:4, lg:3}}  key={idx}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Chứng nhận ${idx + 1}`}
                    width={200}
                    height={140}
                    style={{ objectFit: "contain" }}
                    priority={idx === 0}
                  />
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 2. Góp ý người dùng */}
      <Box mb={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          GÓC NGƯỜI DÙNG
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {userImages.map((user, idx) => (
            <Grid size={{xs:12, sm:6, md:4}}  key={idx}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia>
                    <Image
                      src={user.image}
                      alt={`Khách hàng ${idx + 1}`}
                      width={400}
                      height={260}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography
                      fontSize={14}
                      fontStyle="italic"
                      textAlign="center"
                      color="text.secondary"
                    >
                      “{user.feedback}”
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 3. CTA cuối trang */}
      <Box
        py={6}
        px={4}
        sx={{
          backgroundImage: "url(/images/banner/banner-may-cat-co.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.55)",
            zIndex: 1,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={2}
            color="white"
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            Chọn đúng thương hiệu – Tăng hiệu quả công việc ngay hôm nay
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            mt={3}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="warning"
                size="large"
                onClick={() => router.push("/product")}
                sx={{ fontWeight: 600, px: 4 }}
              >
                Khám phá sản phẩm
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => router.push("/contact")}
                sx={{
                  fontWeight: 600,
                  px: 4,
                  borderWidth: 2,
                  color: "white",
                  borderColor: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                Liên hệ để được tư vấn thêm
              </Button>
            </motion.div>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
