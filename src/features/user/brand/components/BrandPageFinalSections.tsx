"use client";

import React from "react";
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
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

import VerifiedIcon from "@mui/icons-material/Verified";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShieldIcon from "@mui/icons-material/Shield";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhoneIcon from "@mui/icons-material/Phone";

const certifications = [
  {
    image: "/images/certificate/ce-certification-for-machinaries-and-machine-tools.jpg",
    name: "CE Certification",
    issuer: "European Union",
    year: "2023",
    description: "Chứng nhận an toàn cho máy móc thiết bị",
  },
  {
    image: "/images/certificate/435969446.png",
    name: "ISO 9001:2015",
    issuer: "ISO",
    year: "2024",
    description: "Hệ thống quản lý chất lượng quốc tế",
  },
  {
    image: "/images/certificate/images.jpeg",
    name: "GS Mark",
    issuer: "TÜV SÜD",
    year: "2023",
    description: "Chứng nhận an toàn sản phẩm Đức",
  },
];

const userFeedbacks = [
  {
    image: "/images/customer/customer1.jpeg",
    name: "Nguyễn Văn An",
    role: "Thợ cơ khí chuyên nghiệp",
    feedback: "Máy Honda rất mạnh và tiết kiệm xăng! Tôi đã dùng 5 năm nay vẫn rất bền.",
    rating: 5,
    date: "15/03/2024",
    verified: true,
  },
  {
    image: "/images/customer/customer2.jpeg",
    name: "Trần Thị Bình",
    role: "Chủ xưởng mộc",
    feedback: "Husqvarna cắt cực nhanh và ổn định. Rất hài lòng với chất lượng.",
    rating: 5,
    date: "12/03/2024",
    verified: true,
  },
  {
    image: "/images/customer/customer3.jpeg",
    name: "Lê Văn Cường",
    role: "Công nhân xây dựng",
    feedback: "Stihl khởi động nhẹ và bền bỉ. Đã dùng được 2 năm chưa hỏng lần nào.",
    rating: 4,
    date: "10/03/2024",
    verified: false,
  },
];

const trustStats = [
  { icon: <ShieldIcon />,    value: "100%",   label: "Chính hãng" },
  { icon: <AccessTimeIcon />,value: "6+",     label: "Năm kinh nghiệm" },
  { icon: <GroupsIcon />,    value: "5.000+", label: "Khách hàng" },
  { icon: <VerifiedIcon />,  value: "12 tháng", label: "Bảo hành" },
];

export default function BrandPageFinalSections() {
  const router = useRouter();

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
      {/* 1. TRUST BADGES */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {trustStats.map((stat, idx) => (
          <Grid key={idx} size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "#fff8f0",
                borderRadius: 4,
                border: "1px solid #ffb700",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(242,92,5,0.15)",
                },
              }}
            >
              <Box sx={{ color: "#f25c05", fontSize: 40, mb: 1, display: "flex", justifyContent: "center" }}>
                {stat.icon}
              </Box>
              <Typography variant="h5" fontWeight={800} color="#f25c05">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 2. CHỨNG NHẬN & ĐỐI TÁC */}
      <Box sx={{ mb: 8 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                bgcolor: "#f25c05",
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VerifiedIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#333">
                Chứng nhận & Đối tác
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Được công nhận bởi các tổ chức uy tín
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={`${certifications.length} chứng nhận`}
            size="small"
            sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, border: "1px solid #ffb700" }}
          />
        </Stack>

        <Grid container spacing={3}>
          {certifications.map((cert, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(242,92,5,0.12)",
                    borderColor: "#ffb700",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    bgcolor: "#fafafa",
                    borderRadius: 3,
                    p: 2,
                  }}
                >
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    width={160}
                    height={80}
                    style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                  {cert.name}
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {cert.issuer}
                  </Typography>
                  <Chip label={cert.year} size="small" sx={{ height: 20, fontSize: "0.6rem", bgcolor: "#f5f5f5" }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {cert.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 3. GÓC NGƯỜI DÙNG */}
      <Box sx={{ mb: 8 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                bgcolor: "#f25c05",
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormatQuoteIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#333">
                Góc người dùng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chia sẻ từ khách hàng thực tế
              </Typography>
            </Box>
          </Stack>
          <Rating value={4.8} readOnly precision={0.1} size="small" />
        </Stack>

        <Grid container spacing={3}>
          {userFeedbacks.map((user, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(242,92,5,0.12)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardMedia sx={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  {user.verified && (
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                      label="Đã xác minh"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#4caf50",
                        color: "#fff",
                        zIndex: 2,
                        height: 24,
                      }}
                    />
                  )}
                </CardMedia>
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.role}
                      </Typography>
                    </Box>
                    <Rating value={user.rating} readOnly size="small" />
                  </Stack>

                  <Box sx={{ position: "relative", mb: 2 }}>
                    <FormatQuoteIcon
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: -5,
                        fontSize: 30,
                        color: "#ffb700",
                        opacity: 0.3,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 3, fontStyle: "italic", lineHeight: 1.6 }}
                    >
                      "{user.feedback}"
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {user.date}
                    </Typography>
                    {user.verified && (
                      <Chip
                        label="Khách hàng thân thiết"
                        size="small"
                        sx={{ height: 20, fontSize: "0.6rem", bgcolor: "#f5f5f5" }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 4. CTA CUỐI TRANG */}
      <Paper
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          backgroundImage: "url(/images/banner/banner-may-cat-co.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(242,92,5,0.92) 0%, rgba(255,183,0,0.82) 100%)",
            zIndex: 1,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 2, p: { xs: 4, md: 6 }, color: "#fff" }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.25)",
                }}
              >
                Chọn đúng thương hiệu
              </Typography>
              <Typography
                variant="h4"
                sx={{ mb: 3, fontSize: { xs: "1.1rem", md: "1.4rem" }, opacity: 0.95 }}
              >
                Tăng hiệu quả công việc ngay hôm nay
              </Typography>

              <Stack direction="row" sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Chip
                  icon={<LocalOfferIcon />}
                  label="Giá niêm yết, không phát sinh"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid #fff" }}
                />
                <Chip
                  icon={<ShieldIcon />}
                  label="Bảo hành 12 tháng"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid #fff" }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label="Giao hàng toàn quốc"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid #fff" }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => router.push("/product")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#fff",
                    color: "#f25c05",
                    fontWeight: 700,
                    py: 1.5,
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  Khám phá sản phẩm
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  component="a"
                  href="tel:0392923392"
                  startIcon={<PhoneIcon />}
                  sx={{
                    borderColor: "#fff",
                    borderWidth: 2,
                    color: "#fff",
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "#fff" },
                  }}
                >
                  0392 923 392
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
