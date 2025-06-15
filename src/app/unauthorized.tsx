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
import Image from "next/image";
import BlankLayout from "src/@core/layouts/BlankLayout";

// ========== Styled Components ==========

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: "#FFF8E1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  overflow: "hidden",
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  textAlign: "center",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const MotionImageWrapper = styled(motion.div)(({ theme }) => ({
  width: "100%",
  maxHeight: 280,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.down("sm")]: {
    maxHeight: 220,
  },
}));

// ========== Main Component ==========

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

          <MotionImageWrapper
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/images/pages/unauthozied.png"
              alt="Minh họa không được phép truy cập"
              width={500}
              height={280}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              priority={false}
            />
          </MotionImageWrapper>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Link href="/" passHref legacyBehavior>
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

            <Link href="/login" passHref legacyBehavior>
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
