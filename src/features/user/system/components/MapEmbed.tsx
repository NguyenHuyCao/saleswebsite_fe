"use client";

import { Box, Paper, Chip, IconButton, Tooltip, CircularProgress, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import DirectionsIcon from "@mui/icons-material/Directions";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { googleDirectionsUrl, googleEmbedUrl } from "../queries";

interface MapEmbedProps {
  lat: number;
  lng: number;
  storeName?: string;
  height?: number | string;
}

export default function MapEmbed({ lat, lng, storeName = "Cường Hoa", height = 400 }: MapEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src = googleEmbedUrl(lat, lng);

  // Fallback: dismiss spinner after 2.5s if onLoad doesn't fire
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(t);
  }, [src]);

  const openDirections = () => {
    window.open(googleDirectionsUrl(lat, lng), "_blank", "noopener,noreferrer");
  };

  const openFullscreen = () => {
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          height,
          width: "100%",
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Loading */}
        {isLoading && !hasError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.85)",
              zIndex: 5,
            }}
          >
            <CircularProgress sx={{ color: "#f25c05" }} />
          </Box>
        )}

        {/* Error fallback */}
        {hasError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fafafa",
              zIndex: 5,
              gap: 2,
            }}
          >
            <Typography color="text.secondary">Không thể tải bản đồ</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={openDirections}
              startIcon={<DirectionsIcon />}
              sx={{ bgcolor: "#f25c05" }}
            >
              Mở Google Maps
            </Button>
          </Box>
        )}

        {/* Controls */}
        {!hasError && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Tooltip title="Toàn màn hình">
              <IconButton
                size="small"
                onClick={openFullscreen}
                sx={{ bgcolor: "#fff", boxShadow: 2, "&:hover": { bgcolor: "#ffb700", color: "#fff" } }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Bottom chips */}
        {!hasError && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              zIndex: 10,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={storeName}
              size="small"
              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, boxShadow: 1 }}
            />
            <Chip
              icon={<DirectionsIcon sx={{ fontSize: "14px !important" }} />}
              label="Chỉ đường"
              size="small"
              onClick={openDirections}
              sx={{
                bgcolor: "#fff",
                color: "#333",
                fontWeight: 600,
                boxShadow: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "#ffb700" },
              }}
            />
          </Box>
        )}

        <iframe
          ref={iframeRef}
          title={`Bản đồ ${storeName}`}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
          onLoad={() => setIsLoading(false)}
          onError={() => { setHasError(true); setIsLoading(false); }}
        />
      </Paper>
    </motion.div>
  );
}
