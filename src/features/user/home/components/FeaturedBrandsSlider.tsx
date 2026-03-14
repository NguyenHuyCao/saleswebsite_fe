"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Skeleton,
  Tooltip,
  Chip,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Marquee from "react-fast-marquee";

// Icons
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpeedIcon from "@mui/icons-material/Speed";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
  productCount?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}

interface Props {
  brands: Brand[] | string[];
  loading?: boolean;
}

export default function FeaturedBrandsSlider({
  brands,
  loading = false,
}: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sectionRef = useRef<HTMLDivElement>(null);

  // FIX: Sử dụng any cho marqueeRef
  const marqueeRef = useRef<any>(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [duplicateCount, setDuplicateCount] = useState(1);

  // Hàm lấy tên thương hiệu từ logo path
  const getBrandNameFromLogo = useCallback((logo: string) => {
    try {
      const fileName = logo.split("/").pop()?.split(".")[0] || "Brand";
      return fileName.charAt(0).toUpperCase() + fileName.slice(1);
    } catch {
      return "Thương hiệu";
    }
  }, []);

  // Chuyển đổi dữ liệu brands
  const normalizedBrands = useMemo(() => {
    if (!brands || brands.length === 0) return [];

    if (typeof brands[0] === "string") {
      return (brands as string[]).map((logo, index) => ({
        id: `brand-${index}`,
        name: getBrandNameFromLogo(logo),
        logo,
        slug: `brand-${index}`,
        productCount: Math.floor(Math.random() * 50) + 10,
        isVerified: Math.random() > 0.3,
        isFeatured: index < 2,
      }));
    }

    return brands as Brand[];
  }, [brands, getBrandNameFromLogo]);

  // Điều chỉnh số lần lặp
  useEffect(() => {
    setDuplicateCount(isMobile ? 2 : 1);
  }, [isMobile]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton
          variant="text"
          width={200}
          height={40}
          sx={{ mx: "auto", mb: 3 }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  if (!normalizedBrands || normalizedBrands.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 4,
            border: "1px dashed #ffb700",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có thương hiệu nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các thương hiệu sẽ sớm được cập nhật
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Tạo array brands với số lần lặp phù hợp
  const displayBrands = useMemo(
    () => Array(duplicateCount).fill(normalizedBrands).flat(),
    [duplicateCount, normalizedBrands],
  );

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: "#f25c05",
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 12px rgba(242,92,5,0.2)",
                }}
              >
                <StarIcon sx={{ color: "#fff", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#333">
                  Thương hiệu nổi bật
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {normalizedBrands.length} thương hiệu chính hãng
                </Typography>
              </Box>
            </Stack>

            {/* Controls */}
            <Stack direction="row" spacing={1}>
              <Tooltip title={isPaused ? "Tiếp tục" : "Tạm dừng"}>
                <IconButton
                  onClick={() => setIsPaused(!isPaused)}
                  size="small"
                  sx={{
                    bgcolor: isPaused ? "#f25c05" : "#f5f5f5",
                    color: isPaused ? "#fff" : "#666",
                    "&:hover": {
                      bgcolor: isPaused ? "#e64a19" : "#e0e0e0",
                    },
                  }}
                >
                  {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Tốc độ chạy">
                <IconButton
                  onClick={() => setSpeed((prev) => (prev === 30 ? 15 : 30))}
                  size="small"
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#666",
                  }}
                >
                  <SpeedIcon />
                  <Typography
                    variant="caption"
                    sx={{ ml: 0.5, fontSize: "0.6rem" }}
                  >
                    {speed === 30 ? "Bình thường" : "Chậm"}
                  </Typography>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Brands Marquee */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              "& .marquee-container": {
                overflowY: "hidden !important",
                maskImage:
                  "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
              },
            }}
          >
            <Marquee
              ref={marqueeRef}
              pauseOnHover
              gradient={false}
              speed={speed}
              play={!isPaused}
              className="marquee-container"
              autoFill={false}
            >
              {displayBrands.map((brand, index) => (
                <motion.div
                  key={`${brand.id}-${index}`}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setHoveredBrand(brand.id)}
                  onHoverEnd={() => setHoveredBrand(null)}
                >
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {brand.name}
                        </Typography>
                        {brand.productCount && (
                          <Typography variant="caption" display="block">
                            {brand.productCount} sản phẩm
                          </Typography>
                        )}
                      </Box>
                    }
                    arrow
                  >
                    <Box
                      onClick={() =>
                        router.push(`/product?brand=${brand.slug}`)
                      }
                      sx={{
                        mx: { xs: 2, md: 3 },
                        minWidth: { xs: 100, md: 120 },
                        maxWidth: { xs: 120, md: 150 },
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Featured Badge */}
                      {brand.isFeatured && (
                        <Chip
                          label="Nổi bật"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 2,
                            bgcolor: "#ffb700",
                            color: "#000",
                            fontWeight: 600,
                            fontSize: "0.6rem",
                            height: 20,
                          }}
                        />
                      )}

                      {/* Verified Badge */}
                      {brand.isVerified && (
                        <VerifiedIcon
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            zIndex: 2,
                            fontSize: 20,
                            color: "#4caf50",
                            bgcolor: "#fff",
                            borderRadius: "50%",
                          }}
                        />
                      )}

                      {/* Logo Container */}
                      <Box
                        sx={{
                          width: "100%",
                          height: { xs: 70, md: 90 },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                          bgcolor: "#fff",
                          boxShadow:
                            hoveredBrand === brand.id
                              ? "0 8px 20px rgba(242,92,5,0.2)"
                              : "0 4px 12px rgba(0,0,0,0.05)",
                          border:
                            hoveredBrand === brand.id
                              ? "2px solid #f25c05"
                              : "1px solid #f0f0f0",
                          transition: "all 0.3s ease",
                          p: 2,
                        }}
                      >
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={80}
                          height={40}
                          style={{
                            objectFit: "contain",
                            maxWidth: "100%",
                            maxHeight: "60%",
                            filter:
                              hoveredBrand === brand.id
                                ? "grayscale(0%)"
                                : "grayscale(50%)",
                            transition: "filter 0.3s ease",
                          }}
                        />

                        {/* Brand Name */}
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            display: "block",
                            textAlign: "center",
                            fontWeight: 600,
                            color:
                              hoveredBrand === brand.id ? "#f25c05" : "#333",
                            fontSize: { xs: "0.7rem", md: "0.8rem" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {brand.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                </motion.div>
              ))}
            </Marquee>
          </Box>

          {/* Stats */}
          <Fade in timeout={1000}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: "#fff8f0",
                  borderRadius: 3,
                  border: "1px solid #ffb700",
                }}
              >
                <Typography variant="body2" fontWeight={600} color="#f25c05">
                  {normalizedBrands.length}+ Thương hiệu
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: "#fff8f0",
                  borderRadius: 3,
                  border: "1px solid #ffb700",
                }}
              >
                <Typography variant="body2" fontWeight={600} color="#f25c05">
                  100% Chính hãng
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: "#fff8f0",
                  borderRadius: 3,
                  border: "1px solid #ffb700",
                }}
              >
                <Typography variant="body2" fontWeight={600} color="#f25c05">
                  Bảo hành toàn quốc
                </Typography>
              </Paper>
            </Stack>
          </Fade>
        </Container>
      </Box>
    </motion.div>
  );
}
