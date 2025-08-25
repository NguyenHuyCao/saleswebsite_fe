"use client";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { motion } from "framer-motion";

export default function ContactCTA() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        mt: 6,
        mb: 5,
        p: { xs: 4, md: 6 },
        color: "#fff",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        textAlign: isMobile ? "center" : "left",
        backgroundImage:
          "url('/images/banner/cognitive-scienc-minor-banner-7.jpg.2.2x.generic.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
          zIndex: 1,
        },
      }}
    >
      <Box zIndex={2} maxWidth={isMobile ? "100%" : "60%"}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ textTransform: "uppercase", mb: 1 }}
        >
          Bạn cần được tư vấn thêm?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Đội ngũ kỹ thuật viên và tư vấn viên của chúng tôi luôn sẵn sàng hỗ
          trợ bạn.
        </Typography>
      </Box>

      <Box zIndex={2}>
        <Link href="/contact" passHref>
          <Button
            variant="contained"
            size="large"
            color="warning"
            startIcon={<ContactPhoneIcon />}
            sx={{ fontWeight: 600, textTransform: "none" }}
          >
            Liên hệ ngay
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
