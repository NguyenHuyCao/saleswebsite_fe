// warranty/components/WarrantyHeroSection.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Container,
  Chip,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";

export default function WarrantyHeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background:
            "radial-gradient(circle at 30% 50%, #fff 0%, transparent 50%)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ py: { xs: 6, md: 8 }, position: "relative" }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Chip
                icon={<VerifiedIcon />}
                label="BẢO HÀNH CHÍNH HÃNG"
                sx={{
                  bgcolor: "#ffb700",
                  color: "#000",
                  fontWeight: 700,
                  mb: 3,
                }}
              />

              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Bảo hành nhanh chóng
                <Box
                  component="span"
                  sx={{ color: "#ffb700", display: "block" }}
                >
                  An tâm sử dụng
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 3,
                  fontWeight: 400,
                }}
              >
                Theo dõi bảo hành sản phẩm bạn đã mua – minh bạch, chính xác và
                thuận tiện!
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="#warranty-lookup"
                  endIcon={<ArrowDownwardIcon />}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    "&:hover": { bgcolor: "#f59e0b" },
                  }}
                >
                  Tra cứu bảo hành
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#warranty-request"
                  sx={{
                    borderColor: "#fff",
                    color: "#fff",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#ffb700",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Yêu cầu bảo hành
                </Button>
              </Stack>

              {/* Quick Features */}
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="#ffb700">
                    12-36
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Tháng bảo hành
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="#ffb700">
                    24/7
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Hỗ trợ
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="#ffb700">
                    100%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Chính hãng
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? 250 : 400,
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
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
}
