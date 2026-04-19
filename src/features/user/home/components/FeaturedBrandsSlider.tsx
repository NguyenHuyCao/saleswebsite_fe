"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Tooltip,
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
}

interface Props {
  brands: Brand[];
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.35 },
  }),
};

export default function FeaturedBrandsSlider({ brands, loading = false }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<any>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [duplicateCount, setDuplicateCount] = useState(1);

  useEffect(() => {
    setDuplicateCount(isMobile ? 2 : 1);
  }, [isMobile]);

  const normalizedBrands = useMemo(() => brands ?? [], [brands]);

  // Must be before early returns to satisfy Rules of Hooks
  const displayBrands = useMemo(
    () => Array(duplicateCount).fill(normalizedBrands).flat() as Brand[],
    [duplicateCount, normalizedBrands],
  );

  if (loading) {
    return (
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Skeleton variant="rounded" width={120} height={90} sx={{ borderRadius: 3, mb: 1 }} />
              <Skeleton variant="text" width={80} height={16} sx={{ mx: "auto" }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (normalizedBrands.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: 4, border: "1px dashed #ffb700" }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có thương hiệu nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các thương hiệu sẽ sớm được cập nhật
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff" }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 2.5, md: 4 }, flexWrap: "wrap", gap: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={isPaused ? "Tiếp tục" : "Tạm dừng"}>
              <IconButton
                onClick={() => setIsPaused(!isPaused)}
                size="small"
                sx={{
                  bgcolor: isPaused ? "#f25c05" : "#f5f5f5",
                  color: isPaused ? "#fff" : "#666",
                  "&:hover": { bgcolor: isPaused ? "#e64a19" : "#e0e0e0" },
                }}
              >
                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={speed === 30 ? "Chuyển sang chậm" : "Chuyển sang bình thường"}>
              <IconButton
                onClick={() => setSpeed((prev) => (prev === 30 ? 15 : 30))}
                size="small"
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "#666",
                  gap: 0.5,
                  px: 1.25,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
              >
                <SpeedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
                  {speed === 30 ? "Bình thường" : "Chậm"}
                </Typography>
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Marquee — py adds vertical space so cards don't clip on hover */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            py: 1,
            "& .marquee-container": {
              overflowY: "visible !important",
              maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
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
            autoFill
          >
            {displayBrands.map((brand, index) => (
              <motion.div
                key={`${brand.id}-${index}`}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onHoverStart={() => setHoveredBrand(brand.id)}
                onHoverEnd={() => setHoveredBrand(null)}
                style={{ margin: "0 10px" }}
              >
                <Tooltip
                  title={brand.name || ""}
                  arrow
                  disableHoverListener={!brand.name}
                >
                  <Box
                    onClick={() => router.push(`/product?brand=${brand.slug}`)}
                    sx={{
                      width: { xs: 110, md: 128 },
                      cursor: "pointer",
                    }}
                  >
                    {/* Card — overflow: hidden keeps everything clipped inside */}
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: 80, md: 96 },
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 3,
                        bgcolor: "#fff",
                        boxShadow: hoveredBrand === brand.id
                          ? "0 6px 20px rgba(242,92,5,0.16)"
                          : "0 2px 8px rgba(0,0,0,0.07)",
                        border: hoveredBrand === brand.id
                          ? "2px solid #f25c05"
                          : "1px solid #efefef",
                        transition: "box-shadow 0.25s, border-color 0.25s",
                        overflow: "hidden",
                        p: 1.5,
                        pb: brand.name ? 0.75 : 1.5,
                      }}
                    >
                      {/* Verified badge */}
                      <VerifiedIcon
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          fontSize: 15,
                          color: "#4caf50",
                          bgcolor: "#fff",
                          borderRadius: "50%",
                        }}
                      />

                      {/* Logo */}
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          minHeight: 0,
                        }}
                      >
                        <Image
                          src={brand.logo}
                          alt={brand.name || "Brand"}
                          width={80}
                          height={44}
                          style={{
                            objectFit: "contain",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            filter: hoveredBrand === brand.id ? "grayscale(0%)" : "grayscale(35%)",
                            transition: "filter 0.25s ease",
                          }}
                        />
                      </Box>

                      {/* Brand Name — only if real name available */}
                      {brand.name && (
                        <Typography
                          sx={{
                            display: "block",
                            textAlign: "center",
                            fontWeight: 600,
                            color: hoveredBrand === brand.id ? "#f25c05" : "#555",
                            fontSize: { xs: "0.65rem", md: "0.72rem" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            mt: 0.5,
                            transition: "color 0.25s",
                          }}
                        >
                          {brand.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              </motion.div>
            ))}
          </Marquee>
        </Box>

        {/* Stats badges */}
        <Fade in timeout={800}>
          <Stack
            direction="row"
            justifyContent="center"
            sx={{ mt: { xs: 3, md: 4 }, flexWrap: "wrap", gap: 1.5 }}
          >
            {[
              `${normalizedBrands.length}+ Thương hiệu`,
              "100% Chính hãng",
              "Bảo hành toàn quốc",
            ].map((label) => (
              <Paper
                key={label}
                elevation={0}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 1.25,
                  bgcolor: "#fff8f0",
                  borderRadius: 3,
                  border: "1px solid rgba(255,183,0,0.4)",
                }}
              >
                <Typography variant="body2" fontWeight={700} color="#f25c05" sx={{ fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>
                  {label}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Fade>
      </Box>
    </motion.div>
  );
}
