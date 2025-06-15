"use client";

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
import { motion } from "framer-motion";

const WarrantyHeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      sx={{
        position: "relative",
        backgroundColor: "#e0f2ff",
        px: { xs: 2, md: 6 },
        py: { xs: 6, md: 10 },
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <Container>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                color="#0d47a1"
                mb={2}
                textAlign={{ xs: "center", md: "left" }}
              >
                Bảo hành nhanh chóng – An tâm sử dụng
              </Typography>
              <Typography
                variant="h6"
                fontWeight={500}
                color="text.primary"
                mb={3}
                textAlign={{ xs: "center", md: "left" }}
              >
                Theo dõi bảo hành sản phẩm bạn đã mua – minh bạch, chính xác và
                thuận tiện!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mb={4}
                textAlign={{ xs: "center", md: "left" }}
              >
                Tất cả sản phẩm đều được bảo hành theo đơn hàng bạn đã đặt. Kiểm
                tra tình trạng và gửi yêu cầu bảo hành chỉ với vài cú click.
              </Typography>
              <Box textAlign={{ xs: "center", md: "left" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowDownwardIcon />}
                  href="#warranty-check"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    transition: "all 0.3s",
                    ":hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  Tra cứu bảo hành
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? 240 : 360,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <Image
                  src="/images/warranty/Milwaukee-Linkedin-banner_2_.webp"
                  alt="Kỹ thuật viên đang kiểm tra sản phẩm"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WarrantyHeroSection;
