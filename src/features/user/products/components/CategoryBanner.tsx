"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";

type BrandRef = { name: string; slug: string };

type Props = {
  brands?: BrandRef[];
};

// Banner visual templates — brand name/slug injected at runtime
const TEMPLATES = [
  {
    image: "/images/banner/banner-ab.jpg",
    titleFn: (name: string) => `${name} – Máy công cụ chính hãng`,
    subtitle: "100% hàng chính hãng – Giá tốt mỗi ngày!",
    buttonFn: (name: string) => `Xem sản phẩm ${name}`,
    features: ["Bảo hành 12 tháng", "Miễn phí vận chuyển", "Ưu đãi 15%"],
  },
  {
    image: "/images/banner/banner-may-cat-co.jpg",
    titleFn: (name: string) => `${name} – Hiệu năng vượt trội`,
    subtitle: "Bền bỉ – Tiết kiệm nhiên liệu – Chuyên nghiệp",
    buttonFn: (name: string) => `Khám phá máy ${name}`,
    features: ["Công nghệ tiên tiến", "Tiết kiệm nhiên liệu", "Nhẹ – Bền"],
  },
];

// Fallback khi chưa có brand nào có sản phẩm
const FALLBACK = [
  {
    image: "/images/banner/banner-ab.jpg",
    title: "Máy công cụ 2 thì chính hãng",
    subtitle: "Đa dạng thương hiệu – Bảo hành toàn quốc",
    buttonText: "Khám phá sản phẩm",
    href: "/product#products",
    tag: "Cường Hoa",
    features: ["Bảo hành 12 tháng", "Miễn phí vận chuyển", "Chính hãng 100%"],
  },
  {
    image: "/images/banner/banner-may-cat-co.jpg",
    title: "Máy cắt cỏ, máy cưa xích",
    subtitle: "Lựa chọn hàng đầu cho công việc hiệu quả",
    buttonText: "Xem tất cả sản phẩm",
    href: "/product#products",
    tag: "Mới nhất",
    features: ["Đa dạng phụ kiện", "Hỗ trợ kỹ thuật", "6+ năm kinh nghiệm"],
  },
];

export default function CategoryBanner({ brands = [] }: Props) {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  // Build banner list from real brands (or fallback)
  const banners = useMemo(() => {
    if (brands.length === 0) return FALLBACK;

    return brands.slice(0, TEMPLATES.length).map((brand, i) => {
      const tpl = TEMPLATES[i];
      return {
        image: tpl.image,
        title: tpl.titleFn(brand.name),
        subtitle: tpl.subtitle,
        buttonText: tpl.buttonFn(brand.name),
        href: `/product?brand=${brand.slug}#products`,
        tag: brand.name,
        features: tpl.features,
      };
    });
  }, [brands]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext, banners.length]);

  // Reset index when brands change
  useEffect(() => {
    setIndex(0);
  }, [brands]);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 240, sm: 330, md: 400, lg: 440 },
        borderRadius: { xs: 2, sm: 4 },
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        mb: { xs: 2, sm: 3 },
        mx: { xs: -2, sm: 0 },
      }}
    >
      {/* All banner backgrounds — CSS crossfade */}
      {banners.map((banner, idx) => (
        <Box
          key={`bg-${idx}`}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: idx === index ? 1 : 0,
            transition: "opacity 0.55s ease-in-out",
          }}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            priority={idx === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: {
                xs: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
                sm: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 100%)",
              },
            }}
          />
        </Box>
      ))}

      {/* All banner content — CSS crossfade */}
      {banners.map((banner, idx) => (
        <Box
          key={`content-${idx}`}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: idx === index ? 1 : 0,
            transform: idx === index ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s",
            pointerEvents: idx === index ? "auto" : "none",
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "flex-end", sm: "center" },
              alignItems: { xs: "center", sm: "flex-start" },
              px: { xs: 3, sm: 5, md: 7 },
              pb: { xs: 5, sm: 0 },
              color: "#fff",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Chip
              label={banner.tag}
              size="small"
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 700,
                mb: 1.5,
                fontSize: "0.72rem",
                height: 24,
              }}
            />

            <Typography
              fontWeight={800}
              sx={{
                mb: 1,
                maxWidth: { xs: "100%", sm: 460, md: 540 },
                textShadow: "2px 2px 4px rgba(0,0,0,0.35)",
                fontSize: { xs: "1.25rem", sm: "1.65rem", md: "2rem" },
                lineHeight: 1.2,
              }}
            >
              {banner.title}
            </Typography>

            <Typography
              sx={{
                mb: { xs: 1.5, sm: 2 },
                opacity: 0.93,
                maxWidth: { xs: "90%", sm: 400 },
                fontSize: { xs: "0.82rem", sm: "0.95rem" },
              }}
            >
              {banner.subtitle}
            </Typography>

            <Stack
              direction="row"
              sx={{
                mb: { xs: 2, sm: 2.5 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: 1,
              }}
            >
              {banner.features.slice(0, isMobile ? 2 : 3).map((feature, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 3,
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              onClick={() => router.push(banner.href)}
              sx={{
                bgcolor: "#fff",
                color: "#333",
                fontWeight: 700,
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 0.7, sm: 1.1 },
                width: { xs: "100%", sm: "fit-content" },
                maxWidth: { xs: 240, sm: "none" },
                borderRadius: 3,
                textTransform: "none",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "#f25c05",
                  color: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                },
                transition: "all 0.28s ease",
              }}
            >
              {banner.buttonText}
            </Button>
          </Box>
        </Box>
      ))}

      {/* Prev/Next — desktop only, hide if single banner */}
      {!isMobile && banners.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            aria-label="Banner trước"
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              zIndex: 3,
              width: 38,
              height: 38,
              "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            aria-label="Banner tiếp theo"
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              zIndex: 3,
              width: 38,
              height: 38,
              "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Dots — hide if single banner */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 10, sm: 16 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 0.8,
            zIndex: 3,
          }}
        >
          {banners.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setIndex(idx)}
              sx={{
                width: idx === index ? { xs: 20, sm: 28 } : { xs: 6, sm: 7 },
                height: { xs: 5, sm: 6 },
                borderRadius: 4,
                bgcolor: "#fff",
                opacity: idx === index ? 1 : 0.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      )}

      {/* Page counter */}
      {!isMobile && banners.length > 1 && (
        <Chip
          label={`${index + 1}/${banners.length}`}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.45)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            zIndex: 3,
            fontSize: "0.72rem",
            height: 22,
          }}
        />
      )}
    </Box>
  );
}
