// system/components/MapEmbed.tsx
"use client";

import {
  Box,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import DirectionsIcon from "@mui/icons-material/Directions";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SatelliteIcon from "@mui/icons-material/Satellite";
import MapIcon from "@mui/icons-material/Map";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

interface MapEmbedProps {
  lat: number;
  lng: number;
  storeName?: string;
  zoom?: number;
  height?: number | string;
  showControls?: boolean;
}

export default function MapEmbed({
  lat,
  lng,
  storeName = "DolaTool",
  zoom = 15,
  height = 400,
  showControls = true,
}: MapEmbedProps) {
  const [mapZoom, setMapZoom] = useState(zoom);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Tạo URL cho Google Maps với các tùy chọn
  const getMapUrl = useCallback(() => {
    // Nếu có API key, dùng embed API với nhiều tính năng
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${mapZoom}&maptype=${mapType}`;
    }

    // Fallback: dùng iframe thông thường (không cần API key)
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v${Date.now()}`;
  }, [lat, lng, mapZoom, mapType, apiKey]);

  // Mở Google Maps trong tab mới để chỉ đường
  const openDirections = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [lat, lng]);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  const handleMapError = () => {
    setMapError(true);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          height: height,
          width: "100%",
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Loading State */}
        {isLoading && !mapError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.8)",
              zIndex: 5,
            }}
          >
            <CircularProgress sx={{ color: "#f25c05" }} />
          </Box>
        )}

        {/* Error State */}
        {mapError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f5f5f5",
              zIndex: 5,
              flexDirection: "column",
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

        {/* Map Controls */}
        {showControls && !mapError && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Tooltip title="Phóng to">
              <IconButton
                size="small"
                onClick={() => setMapZoom((prev) => Math.min(prev + 1, 21))}
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Thu nhỏ">
              <IconButton
                size="small"
                onClick={() => setMapZoom((prev) => Math.max(prev - 1, 5))}
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                }}
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                mapType === "roadmap"
                  ? "Chuyển sang chế độ vệ tinh"
                  : "Chuyển sang chế độ bản đồ"
              }
            >
              <IconButton
                size="small"
                onClick={() =>
                  setMapType((prev) =>
                    prev === "roadmap" ? "satellite" : "roadmap",
                  )
                }
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                }}
              >
                {mapType === "roadmap" ? <SatelliteIcon /> : <MapIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Xem toàn màn hình">
              <IconButton
                size="small"
                onClick={() => {
                  const iframe = document.querySelector("iframe");
                  if (iframe) {
                    if (iframe.requestFullscreen) {
                      iframe.requestFullscreen();
                    }
                  }
                }}
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Store Info Overlay */}
        {!mapError && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              zIndex: 10,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={storeName}
              size="small"
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            />
            <Chip
              icon={<DirectionsIcon />}
              label="Chỉ đường"
              size="small"
              onClick={openDirections}
              sx={{
                bgcolor: "white",
                color: "#333",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#ffb700",
                  color: "#000",
                },
              }}
            />
          </Box>
        )}

        {/* Google Maps Iframe */}
        <iframe
          title={`Bản đồ ${storeName}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={getMapUrl()}
          onLoad={handleMapLoad}
          onError={handleMapError}
        />
      </Paper>
    </motion.div>
  );
}
