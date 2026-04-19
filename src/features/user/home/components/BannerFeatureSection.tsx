"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BannerFeatureSection() {
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
      <Image
        src="/images/banner/banner-ab.jpg"
        alt="Banner máy móc cơ khí và 2 thì chính hãng"
        fill
        priority
        style={{ objectFit: "cover", filter: "brightness(0.7)" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
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

              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
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

              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
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

              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.55, ease: "easeOut" }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                justifyContent="center"
                alignItems="center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    size={isMobile ? "medium" : "large"}
                    onClick={() => router.push("/product")}
                    sx={{ fontWeight: 600, px: { xs: 3, sm: 4 }, minWidth: { xs: 180, sm: "auto" } }}
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
                    size={isMobile ? "medium" : "large"}
                    onClick={() => router.push("/about")}
                    sx={{
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      borderWidth: 2,
                      color: "white",
                      borderColor: "white",
                      minWidth: { xs: 180, sm: "auto" },
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
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
}
