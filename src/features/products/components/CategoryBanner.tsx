"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const banners = [
  {
    image: "/images/banner/banner-ab.jpg",
    title: "Chất lượng Mỹ – Hiệu năng vượt trội",
    subtitle: "DeWALT chính hãng – Giá tốt mỗi ngày!",
    buttonText: "Xem sản phẩm DeWALT",
    href: "/product?brand=dewalt",
  },
  {
    image: "/images/banner/banner-may-cat-co.jpg",
    title: "Makita – Đẳng cấp từ Nhật Bản",
    subtitle: "Bền bỉ – Tiết kiệm – Chuyên nghiệp",
    buttonText: "Khám phá máy Makita",
    href: "/product?brand=makita",
  },
];

export default function CategoryBanner() {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(
      () => setIndex((p) => (p + 1) % banners.length),
      7000
    );
    return () => clearInterval(t);
  }, []);

  const current = banners[index];

  return (
    <Box
      position="relative"
      height={{ xs: 220, sm: 280, md: 340 }}
      borderRadius={2}
      overflow="hidden"
      sx={{ boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}
    >
      <Image
        src={current.image}
        alt={current.title}
        fill
        priority
        style={{
          objectFit: "cover",
          transition: "opacity 0.8s",
          filter: "brightness(0.7)",
        }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        zIndex={2}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        px={2}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="#fff"
          mb={1}
          sx={{ textShadow: "1px 2px 6px rgba(0,0,0,0.5)" }}
        >
          {current.title}
        </Typography>
        <Typography
          variant="subtitle1"
          color="#fff"
          mb={3}
          sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
        >
          {current.subtitle}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={() => router.push(current.href)}
            sx={{
              fontWeight: 600,
              px: 4,
              borderRadius: 999,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "#ffa000" },
            }}
          >
            {current.buttonText}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
