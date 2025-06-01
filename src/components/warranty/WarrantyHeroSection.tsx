"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import Image from "next/image";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const WarrantyHeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#e0f2ff",
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 10 },
        textAlign: "center",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <Container>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700} color="#0d47a1" mb={2}>
              Bảo hành nhanh chóng – An tâm sử dụng
            </Typography>
            <Typography
              variant="h6"
              fontWeight={500}
              color="text.primary"
              sx={{ mb: 3 }}
            >
              Theo dõi bảo hành sản phẩm bạn đã mua – minh bạch, chính xác và
              thuận tiện!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Tất cả sản phẩm đều được bảo hành theo đơn hàng bạn đã đặt. Kiểm
              tra tình trạng và gửi yêu cầu bảo hành chỉ với vài cú click.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowDownwardIcon />}
              sx={{ textTransform: "none", fontWeight: 600 }}
              href="#warranty-check"
            >
              Tra cứu bảo hành
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: isMobile ? 220 : 360,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <Image
                src="/images/warranty/Milwaukee-Linkedin-banner_2_.webp"
                alt="Technician working"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WarrantyHeroSection;
