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

// Ảnh minh họa đã xoá nền
const imagePath = "/images/pages/unauthozied.png";

// Wrapper full màn hình, không scroll
const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: "#FFF8E1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  overflow: "hidden",
}));

// KHÔNG còn khung trắng
const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  textAlign: "center",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const Img = styled(motion.img)(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxHeight: 280,
  objectFit: "contain",
  margin: theme.spacing(4, 0),
  [theme.breakpoints.down("sm")]: {
    maxHeight: 220,
  },
}));

const Unauthorized = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BoxWrapper>
          <Typography
            variant={isMobile ? "h3" : "h1"}
            fontWeight="bold"
            sx={{ color: "#FFB700" }}
          >
            401
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#000",
              fontWeight: 500,
            }}
          >
            KHÔNG ĐƯỢC PHÉP TRUY CẬP
          </Typography>

          <Typography variant="body2" sx={{ color: "#444", mt: 1 }}>
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp
            tục.
          </Typography>

          <Img
            src={imagePath}
            alt="Minh họa không được phép truy cập"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#FFB700",
                  color: "#000",
                  px: 4,
                  py: 1.5,
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

            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#FFB700",
                  color: "#D35300",
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#D35300",
                    color: "#fff",
                    bgcolor: "#D35300",
                  },
                }}
              >
                Đăng nhập
              </Button>
            </Link>
          </Box>
        </BoxWrapper>
      </motion.div>
    </Wrapper>
  );
};

Unauthorized.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Unauthorized;
