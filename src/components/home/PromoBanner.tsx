"use client";

import React from "react";
import { Box, Typography, Button, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PromoBanner = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 6,
          backgroundColor: "#000",
          color: "white",
        }}
      >
        <Grid container alignItems="stretch">
          {/* Left Side: Content */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              p: { xs: 4, md: 6 },
              backgroundImage: "url(/images/banner/ima.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              minHeight: { xs: 280, md: 400 },
              display: "flex",
              alignItems: "center",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(0,0,0,0.55)",
                borderRadius: 16,
                padding: "24px 32px",
                maxWidth: 360,
                backdropFilter: "blur(4px)",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  bgcolor: "#ffb700",
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                1.550.000Đ
              </Typography>

              <Typography
                variant="h4"
                fontWeight={900}
                mt={2}
                sx={{ color: "#fff" }}
              >
                Khuyến mãi
              </Typography>
              <Typography
                variant="h5"
                fontWeight={400}
                sx={{ color: "#fff", mt: 0.5 }}
              >
                Pin DEWALT
              </Typography>

              <Button
                variant="contained"
                onClick={() => router.push("/product")}
                sx={{
                  mt: 3,
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#ffb700",
                  },
                }}
              >
                Xem ngay
              </Button>
            </motion.div>
          </Grid>

          {/* Right Side: Banner image */}
          {!isMobile && (
            <Grid
              size={{ md: 6 }}
              sx={{
                backgroundImage: "url(/images/banner/imagesbanner.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: 400,
                transition: "transform 0.4s ease",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
            />
          )}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default PromoBanner;
