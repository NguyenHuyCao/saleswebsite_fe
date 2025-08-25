"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrations from "@/components/misc/FooterIllustrations";

// ===== Styled Components =====

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  textAlign: "center",
  padding: theme.spacing(3),
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const MotionImageWrapper = styled(motion.div)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(2, 0),
  maxHeight: 280,
  [theme.breakpoints.down("sm")]: {
    maxHeight: 200,
  },
}));

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

// ===== Component =====

const Error404 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className="content-center"
      sx={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        bgcolor: "#FFF8E1",
        px: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
            404
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 1,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              color: "#000",
            }}
          >
            Không tìm thấy trang
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
            chuyển.
          </Typography>

          <MotionImageWrapper
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/images/pages/fixmachine.png"
              alt="Hình minh họa lỗi 404"
              width={500}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </MotionImageWrapper>

          <Link href="/" passHref legacyBehavior>
            <Button
              variant="contained"
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
            alt="Hình cây trang trí"
            src="/images/pages/tree.png"
            loading="lazy"
          />
        }
      />
    </Box>
  );
};

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Error404;
