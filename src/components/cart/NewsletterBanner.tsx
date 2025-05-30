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

const ContactCTA = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        backgroundImage:
          "url('/images/banner/cognitive-scienc-minor-banner-7.jpg.2.2x.generic.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // borderRadius: 3,
        p: { xs: 4, md: 6 },
        mt: 6,
        color: "#fff",
        textAlign: isMobile ? "center" : "left",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        mb: 5,
      }}
    >
      <Box maxWidth={isMobile ? "100%" : "60%"}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ textTransform: "uppercase", mb: 1 }}
        >
          Bạn cần được tư vấn thêm?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Đội ngũ kỹ thuật viên và tư vấn viên của chúng tôi luôn sẵn sàng hỗ
          trợ bạn. Đừng ngần ngại liên hệ nếu bạn cần thêm thông tin về sản phẩm
          máy 2 thì.
        </Typography>
      </Box>

      <Box>
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
};

export default ContactCTA;
