"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
} from "@mui/material";
import Image from "next/image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useRouter } from "next/navigation";

const banners = [
  {
    title: "SIÊU ƯU ĐÃI MÁY PHÁT ĐIỆN",
    subtitle: "Mua 1 được 2 – Quà tặng lên đến 300K + Freeship toàn quốc",
    highlights: [
      "Bảo hành 12 tháng",
      "Hỗ trợ kỹ thuật tận nơi",
      "Giảm đến 50%",
      "Miễn phí đổi trả 7 ngày",
    ],
    button: "XEM NGAY",
    image:
      "/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg",
    bgGradient: "linear-gradient(135deg, #ffb700 0%, #d35300 100%)",
  },
  {
    title: "FLASH SALE MÁY CƯA 12H",
    subtitle: "Giảm khủng – Số lượng có hạn – Chỉ áp dụng hôm nay",
    highlights: [
      "Tặng nhớt pha sẵn",
      "Giao nhanh 2H tại HCM",
      "Bảo hành chính hãng",
      "Ưu đãi độc quyền online",
    ],
    button: "SĂN DEAL",
    image: "/images/banner/cua-betong-gs461.jpg",
    bgGradient: "linear-gradient(135deg, #d35300 0%, #ffb700 100%)",
  },
];

export default function TwoStrokePromoBanner() {
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      setFadeKey((k) => k + 1);
      setIndex((i) => (i + 1) % banners.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const current = banners[index];

  return (
    <Box
      sx={{
        background: current.bgGradient,
        color: "#fff",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
        borderRadius: 4,
        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        mb: 2,
      }}
    >
      <Fade in key={fadeKey} timeout={600}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            transition: "all 0.6s ease-in-out",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              zIndex: 2,
              textAlign: { xs: "center", md: "left" },
              maxWidth: 540,
            }}
          >
            <Typography variant="h4" fontWeight={900}>
              <ElectricBoltIcon sx={{ mr: 1 }} /> {current.title}
            </Typography>
            <Typography fontSize={17} fontWeight={500}>
              {current.subtitle}
            </Typography>
            <Box>
              {current.highlights.map((it, i) => (
                <Typography
                  key={i}
                  sx={{
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <LocalOfferIcon
                    sx={{ fontSize: 18, mr: 1, color: "#fff8e1" }}
                  />
                  {it}
                </Typography>
              ))}
            </Box>
            <Button
              variant="contained"
              onClick={() => router.push("/promotion")}
              sx={{
                mt: 3,
                backgroundColor: "#fff8e1",
                color: "#d35300",
                fontWeight: 700,
                borderRadius: 12,
                px: 5,
                py: 1.5,
                width: "fit-content",
                alignSelf: { xs: "center", md: "flex-start" },
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                textTransform: "uppercase",
                fontSize: 15,
                "&:hover": { backgroundColor: "#ffe082" },
              }}
            >
              {current.button}
            </Button>
          </Stack>

          {!isMobile && (
            <Box
              sx={{ position: "absolute", right: 20, bottom: 0, opacity: 0.95 }}
            >
              <Image
                src={current.image}
                alt="Banner product"
                width={260}
                height={190}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
}
