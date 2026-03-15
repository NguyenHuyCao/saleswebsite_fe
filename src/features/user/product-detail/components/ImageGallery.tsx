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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface Props {
  product: {
    imageAvt: string;
    imageDetail1?: string | null;
    imageDetail2?: string | null;
    imageDetail3?: string | null;
    name: string;
    videoUrl?: string;
  };
}

export default function ImageGallery({ product }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;

  const getFullSrc = (src: string) =>
    src?.startsWith("http") ? src : `${baseUrl}${src}`;

  const images = [
    product.imageAvt,
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((img): img is string => Boolean(img));

  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleOpen = (src: string, index: number) => {
    setSelectedImg(getFullSrc(src));
    setCurrentIndex(index);
    setImageLoading(true);
    setOpen(true);
  };

  const handlePrev = useCallback(() => {
    setImageLoading(true);
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImg(getFullSrc(images[newIndex]));
  }, [currentIndex, images]);

  const handleNext = useCallback(() => {
    setImageLoading(true);
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImg(getFullSrc(images[newIndex]));
  }, [currentIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrev, handleNext]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <Box>
      {/* Main Image */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        onClick={() => handleOpen(product.imageAvt, 0)}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 12,
          overflow: "hidden",
          cursor: "zoom-in",
          backgroundColor: "#fafafa",
          position: "relative",
        }}
      >
        <Image
          src={getFullSrc(product.imageAvt)}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 100vw, 400px"
          priority
        />
        <ZoomInIcon
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            p: 0.5,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "rgba(242,92,5,0.8)",
              transform: "scale(1.1)",
            },
          }}
        />
      </motion.div>

      {/* Thumbnails */}
      <Stack
        direction="row"
        spacing={1}
        mt={2}
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Box
              onClick={() => handleOpen(src, i)}
              sx={{
                flex: "0 0 auto",
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                borderRadius: 2,
                border:
                  currentIndex === i ? "2px solid #f25c05" : "1px solid #ddd",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#fff",
                position: "relative",
                transition: "all 0.2s",
                opacity: currentIndex === i ? 1 : 0.7,
                "&:hover": {
                  opacity: 1,
                  borderColor: "#f25c05",
                },
              }}
            >
              <Image
                src={getFullSrc(src)}
                alt={`Ảnh chi tiết ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </motion.div>
        ))}

        {/* Video Thumbnail (if available) */}
        {product.videoUrl && (
          <Box
            sx={{
              flex: "0 0 auto",
              width: { xs: 60, sm: 70 },
              height: { xs: 60, sm: 70 },
              borderRadius: 2,
              border: "1px solid #ddd",
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "#000",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#f25c05",
                transform: "scale(1.05)",
              },
            }}
          >
            <PlayCircleIcon
              sx={{ fontSize: 30, color: "#fff", opacity: 0.8 }}
            />
          </Box>
        )}
      </Stack>

      {/* Zoom Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        fullScreen={isMobile}
        disableScrollLock
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.95)",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            margin: 0,
            width: "100%",
            height: "100%",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden", // QUAN TRỌNG: Ẩn scroll
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              zIndex: 20,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(242,92,5,0.8)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation Buttons - Desktop */}
          {!isMobile && images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: 24,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: "rgba(242,92,5,0.8)",
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <NavigateBeforeIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 24,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: "rgba(242,92,5,0.8)",
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <NavigateNextIcon fontSize="large" />
              </IconButton>
            </>
          )}

          {/* Mobile Navigation Buttons - Smaller */}
          {isMobile && images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  width: 36,
                  height: 36,
                  "&:hover": { bgcolor: "rgba(242,92,5,0.8)" },
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 20,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  width: 36,
                  height: 36,
                  "&:hover": { bgcolor: "rgba(242,92,5,0.8)" },
                }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </>
          )}

          {/* Current Image Counter */}
          <Chip
            label={`${currentIndex + 1} / ${images.length}`}
            size="small"
            sx={{
              position: "absolute",
              bottom: { xs: 8, sm: 16 },
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />

          {/* Image Container */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              {selectedImg && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: isMobile ? "100%" : "90%",
                      height: isMobile ? "100%" : "90%",
                      maxWidth: "1200px",
                      maxHeight: "800px",
                    }}
                  >
                    {/* Loading Indicator */}
                    {imageLoading && (
                      <Fade in>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 15,
                            color: "#fff",
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              border: "3px solid rgba(255,255,255,0.3)",
                              borderTopColor: "#f25c05",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                              "@keyframes spin": {
                                "0%": { transform: "rotate(0deg)" },
                                "100%": { transform: "rotate(360deg)" },
                              },
                            }}
                          />
                        </Box>
                      </Fade>
                    )}

                    <Image
                      src={selectedImg}
                      alt="Xem ảnh lớn"
                      fill
                      sizes="(max-width: 600px) 100vw, 1200px"
                      style={{
                        objectFit: "contain",
                      }}
                      onLoadingComplete={() => setImageLoading(false)}
                      priority
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Hint for mobile swipe */}
          {isMobile && images.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.5)",
                px: 2,
                py: 1,
                borderRadius: 3,
                zIndex: 25,
                backdropFilter: "blur(4px)",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 0.5 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.5 },
                },
              }}
            >
              <Typography variant="caption">← Vuốt để chuyển ảnh →</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
