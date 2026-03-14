// system/components/StoreMapView.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Rating,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion, AnimatePresence } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import type { StoreInfo } from "../types";

interface StoreMapViewProps {
  stores: StoreInfo[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number;
}

export default function StoreMapView({
  stores,
  center,
  zoom = 12,
  height = 500,
}: StoreMapViewProps) {
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLIFrameElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Tạo URL cho Google Maps với markers
  const getMapUrl = useCallback(() => {
    if (!stores.length) return "";

    const mapCenter = center || stores[0].coords;

    // Nếu có API key, dùng embed API với markers
    if (apiKey) {
      // Tạo markers cho tất cả cửa hàng
      const markers = stores
        .map((store, index) => {
          const label = String.fromCharCode(65 + index); // A, B, C, ...
          return `&markers=color:red%7Clabel:${label}%7C${store.coords.lat},${store.coords.lng}`;
        })
        .join("");

      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}${markers}`;
    }

    // Fallback: dùng iframe thông thường (không markers)
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v${Date.now()}`;
  }, [stores, center, mapZoom, apiKey]);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  const handleMapError = () => {
    setMapError(true);
    setIsLoading(false);
  };

  // Mock function để chọn store (trong thực tế, bạn cần xử lý click từ map)
  const handleStoreSelect = (store: StoreInfo) => {
    setSelectedStore(store);
    // Có thể zoom vào store được chọn
    if (mapRef.current && apiKey) {
      // Update iframe src với center mới
      const newSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${store.coords.lat},${store.coords.lng}&zoom=15`;
      mapRef.current.src = newSrc;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Map */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            height: height,
            position: "relative",
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

          {/* Map Controls */}
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
                sx={{ bgcolor: "white", boxShadow: 2 }}
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Thu nhỏ">
              <IconButton
                size="small"
                onClick={() => setMapZoom((prev) => Math.max(prev - 1, 5))}
                sx={{ bgcolor: "white", boxShadow: 2 }}
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Store List Toggle */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              zIndex: 10,
            }}
          >
            <Chip
              label={`${stores.length} cửa hàng`}
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Google Maps Iframe */}
          <iframe
            ref={mapRef}
            title="Bản đồ hệ thống cửa hàng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={getMapUrl()}
            onLoad={handleMapLoad}
            onError={handleMapError}
          />
        </Paper>
      </Grid>

      {/* Store List */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 2,
            height: height,
            overflow: "auto",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Danh sách cửa hàng
          </Typography>

          <Stack spacing={2}>
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedStore?.id === store.id
                        ? "2px solid #f25c05"
                        : "none",
                  }}
                  onClick={() => handleStoreSelect(store)}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight={700}>{store.name}</Typography>
                        <Chip
                          label={String.fromCharCode(65 + index)}
                          size="small"
                          sx={{ bgcolor: "#f25c05", color: "#fff" }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <LocationOnIcon
                          sx={{ color: "#f25c05", fontSize: 18 }}
                        />
                        <Typography variant="body2">{store.address}</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Rating value={store.rating} readOnly size="small" />
                        <Typography variant="caption">
                          {store.distance?.toFixed(1)}km
                        </Typography>
                      </Stack>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DirectionsIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coords.lat},${store.coords.lng}`;
                          window.open(url, "_blank");
                        }}
                        sx={{ borderColor: "#ffb700", color: "#f25c05" }}
                      >
                        Chỉ đường
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
