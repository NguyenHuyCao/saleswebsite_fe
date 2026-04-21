"use client";

import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Chip,
  Fade,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

interface Props {
  product: {
    imageAvt: string;
    imageDetail1?: string | null;
    imageDetail2?: string | null;
    imageDetail3?: string | null;
    name: string;
    videoUrl?: string | null;
  };
}

export default function ImageGallery({ product }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;

  const getFullSrc = (src: string) =>
    src.startsWith("http") ? src : `${baseUrl}${src}`;

  // Build image list — filter out null/empty/undefined
  const images = [
    product.imageAvt,
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((img): img is string => Boolean(img));

  // currentIndex drives BOTH main display and modal position
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // Keyboard navigation in modal
  const handlePrev = useCallback(() => {
    setModalLoading(true);
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setModalLoading(true);
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > 50) handleNext();
    else if (dist < -50) handlePrev();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = () => {
    setModalLoading(true);
    setModalOpen(true);
  };

  return (
    <Box>
      {/* ── Main Image ── */}
      <Box
        onClick={openModal}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2.5,
          overflow: "hidden",
          cursor: "zoom-in",
          bgcolor: "#f7f7f7",
          border: "1px solid #ebebeb",
          "&:hover .zoom-icon": { opacity: 1 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={getFullSrc(images[currentIndex] ?? product.imageAvt)}
              alt={`${product.name} — ảnh ${currentIndex + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 600px) 100vw, 420px"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <Box
          className="zoom-icon"
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            bgcolor: "rgba(0,0,0,0.45)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
        >
          <ZoomInIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>

        {/* Image counter — only if multiple */}
        {images.length > 1 && (
          <Chip
            label={`${currentIndex + 1}/${images.length}`}
            size="small"
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
              bgcolor: "rgba(0,0,0,0.45)",
              color: "#fff",
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {/* ── Thumbnail Strip ── */}
      {(images.length > 1 || product.videoUrl) && (
        <Stack
          direction="row"
          spacing={1}
          mt={1.5}
          sx={{
            overflowX: "auto",
            pb: 0.5,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: 2 },
          }}
        >
          {images.map((src, i) => (
            <Box
              key={i}
              onClick={() => selectImage(i)}
              sx={{
                flex: "0 0 auto",
                width: { xs: 60, sm: 68 },
                height: { xs: 60, sm: 68 },
                borderRadius: 1.5,
                border: "2px solid",
                borderColor: currentIndex === i ? "#f25c05" : "#e0e0e0",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#f7f7f7",
                position: "relative",
                transition: "border-color 0.18s, opacity 0.18s",
                opacity: currentIndex === i ? 1 : 0.65,
                "&:hover": { borderColor: "#f25c05", opacity: 1 },
              }}
            >
              <Image
                src={getFullSrc(src)}
                alt={`Ảnh ${i + 1} — ${product.name}`}
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </Box>
          ))}

          {/* Video thumbnail */}
          {product.videoUrl && (
            <Box
              sx={{
                flex: "0 0 auto",
                width: { xs: 60, sm: 68 },
                height: { xs: 60, sm: 68 },
                borderRadius: 1.5,
                border: "2px solid #e0e0e0",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.18s",
                "&:hover": { borderColor: "#f25c05" },
              }}
              onClick={() => {
                document.getElementById("product-video-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <PlayCircleIcon sx={{ fontSize: 28, color: "rgba(255,255,255,0.85)" }} />
            </Box>
          )}
        </Stack>
      )}

      {/* ── Zoom Modal ── */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth={false}
        fullScreen={isMobile}
        disableScrollLock
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.96)",
            boxShadow: "none",
            width: "100vw",
            maxWidth: "100vw",
            height: "100vh",
            maxHeight: "100vh",
            m: 0,
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{ p: 0, position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <IconButton
            onClick={() => setModalOpen(false)}
            aria-label="Đóng"
            sx={{
              position: "absolute", top: { xs: 8, sm: 16 }, right: { xs: 8, sm: 16 }, zIndex: 20,
              color: "#fff", bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(242,92,5,0.75)" },
              transition: "background-color 0.2s",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                aria-label="Ảnh trước"
                sx={{
                  position: "absolute", left: { xs: 8, sm: 20 }, top: "50%", transform: "translateY(-50%)", zIndex: 20,
                  color: "#fff", bgcolor: "rgba(255,255,255,0.12)", width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 },
                  "&:hover": { bgcolor: "rgba(242,92,5,0.75)" }, transition: "background-color 0.2s",
                }}
              >
                <NavigateBeforeIcon fontSize={isMobile ? "medium" : "large"} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                aria-label="Ảnh sau"
                sx={{
                  position: "absolute", right: { xs: 8, sm: 20 }, top: "50%", transform: "translateY(-50%)", zIndex: 20,
                  color: "#fff", bgcolor: "rgba(255,255,255,0.12)", width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 },
                  "&:hover": { bgcolor: "rgba(242,92,5,0.75)" }, transition: "background-color 0.2s",
                }}
              >
                <NavigateNextIcon fontSize={isMobile ? "medium" : "large"} />
              </IconButton>
            </>
          )}

          {/* Counter */}
          <Chip
            label={`${currentIndex + 1} / ${images.length}`}
            size="small"
            sx={{
              position: "absolute", bottom: { xs: 72, sm: 20 }, left: "50%", transform: "translateX(-50%)", zIndex: 20,
              bgcolor: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.78rem",
            }}
          />

          {/* Image */}
          <Box sx={{ position: "relative", width: isMobile ? "100%" : "90%", height: isMobile ? "100%" : "88%", maxWidth: 1280, maxHeight: 880 }}>
            {modalLoading && (
              <Fade in>
                <Box sx={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 15,
                  width: 40, height: 40, border: "3px solid rgba(255,255,255,0.25)", borderTopColor: "#f25c05",
                  borderRadius: "50%", animation: "spin 0.9s linear infinite",
                  "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                }} />
              </Fade>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <Image
                  src={getFullSrc(images[currentIndex] ?? product.imageAvt)}
                  alt={`${product.name} — xem ảnh lớn`}
                  fill
                  unoptimized
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                  onLoadingComplete={() => setModalLoading(false)}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Mobile thumbnail strip in modal */}
          {isMobile && images.length > 1 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute", bottom: 12, left: 0, right: 0,
                justifyContent: "center", px: 2, zIndex: 20,
                overflowX: "auto", "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {images.map((src, i) => (
                <Box
                  key={i}
                  onClick={() => { setModalLoading(true); setCurrentIndex(i); }}
                  sx={{
                    flex: "0 0 auto", width: 44, height: 44, borderRadius: 1,
                    border: "2px solid", borderColor: currentIndex === i ? "#f25c05" : "rgba(255,255,255,0.3)",
                    overflow: "hidden", cursor: "pointer", position: "relative",
                    opacity: currentIndex === i ? 1 : 0.55, transition: "all 0.18s",
                    "&:hover": { opacity: 1, borderColor: "#f25c05" },
                  }}
                >
                  <Image src={getFullSrc(src)} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                </Box>
              ))}
            </Stack>
          )}

          {/* Desktop swipe hint */}
          {!isMobile && images.length > 1 && (
            <Typography
              variant="caption"
              sx={{
                position: "absolute", bottom: 14, right: 20, color: "rgba(255,255,255,0.4)",
                fontSize: "0.72rem", userSelect: "none",
              }}
            >
              ← → để chuyển ảnh · ESC để đóng
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
