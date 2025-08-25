"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BannerFeatureSection = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: { xs: "75vh", md: "85vh" },
        minHeight: 400,
        maxHeight: 700,
      }}
    >
      {/* Background Image */}
      <Image
        src="/images/banner/banner-ab.jpg"
        alt="Banner máy móc cơ khí và 2 thì chính hãng"
        fill
        priority
        style={{
          objectFit: "cover",
          filter: "brightness(0.7)",
        }}
      />
      javascript Sao chép Chỉnh sửa
      {/* Overlay Content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          px: 2,
          zIndex: 2,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Typography
                variant={isMobile ? "h5" : "h3"}
                fontWeight="bold"
                sx={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
              >
                Máy móc 2 thì chính hãng – Công suất bền bỉ
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 700,
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                }}
              >
                Chuyên cung cấp máy cắt, máy cưa, máy phát điện...
                <br />
                Phục vụ từ gia đình đến công nghiệp.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={() => router.push("/product")}
                    sx={{
                      fontWeight: 600,
                      px: 4,
                      minWidth: 200,
                    }}
                  >
                    Khám phá sản phẩm
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    size="large"
                    onClick={() => router.push("/about")}
                    sx={{
                      fontWeight: 600,
                      px: 4,
                      minWidth: 200,
                      borderWidth: 2,
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Về chúng tôi
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default BannerFeatureSection;
