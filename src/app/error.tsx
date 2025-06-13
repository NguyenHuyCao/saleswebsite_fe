"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import { motion } from "framer-motion";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrations from "@/views/misc/FooterIllustrations";

// Box gói nội dung chính – KHÔNG còn khung trắng
const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  textAlign: "center",
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Ảnh minh họa
const Img = styled(motion.img)(({ theme }) => ({
  width: "100%",
  maxHeight: 450,
  objectFit: "contain",
  margin: `${theme.spacing(6)} auto`,
  [theme.breakpoints.down("sm")]: {
    maxHeight: 320,
  },
}));

// Hình cây trang trí
const TreeIllustration = styled("img")(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: "5rem",
  width: 200,
  [theme.breakpoints.down("md")]: {
    width: 150,
    bottom: 0,
  },
  [theme.breakpoints.down("sm")]: {
    width: 120,
  },
}));

const Error500 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className="content-center"
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        px: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#FFF8E1",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BoxWrapper>
          {/* <Typography
            variant={isMobile ? "h3" : "h1"}
            color="error"
            fontWeight="bold"
          >
            500
          </Typography> */}

          <Typography
            variant="h5"
            sx={{
              mt: 1,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              color: "#000",
            }}
          >
            Lỗi máy chủ nội bộ
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau hoặc quay về
            trang chủ.
          </Typography>

          <Img
            src="/images/pages/moto.png"
            alt="Hình minh họa lỗi máy chủ"
            loading="lazy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                px: 6,
                py: 1.5,
                bgcolor: "#FFB700",
                color: "#000",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#D35300",
                  color: "#fff",
                },
              }}
            >
              Quay về trang chủ
            </Button>
          </Link>
        </BoxWrapper>
      </motion.div>

      <FooterIllustrations
        image={
          <TreeIllustration
            alt="Hình trang trí"
            src="/images/pages/tree-3.png"
            loading="lazy"
          />
        }
      />
    </Box>
  );
};

Error500.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Error500;
