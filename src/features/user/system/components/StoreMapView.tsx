"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Rating,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";
import type { StoreInfo } from "../types";
import { googleDirectionsUrl, googleEmbedUrl } from "../queries";

interface StoreMapViewProps {
  stores: StoreInfo[];
  height?: number;
}

export default function StoreMapView({ stores, height = 480 }: StoreMapViewProps) {
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeStore = selectedStore ?? stores[0];

  const mapSrc = activeStore
    ? googleEmbedUrl(activeStore.coords.lat, activeStore.coords.lng)
    : "";

  // Google Maps iframes don't always fire onLoad reliably — fall back after 2.5s
  useEffect(() => {
    setIsLoading(true);
    fallbackTimer.current = setTimeout(() => setIsLoading(false), 2500);
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, [mapSrc]);

  return (
    <Grid container spacing={3}>
      {/* Map */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            height: { xs: 280, sm: 380, md: height },
            position: "relative",
            bgcolor: "#f5f5f5",
          }}
        >
          {isLoading && (
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

          {/* Store count badge */}
          <Box sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 10 }}>
            <Chip
              label={`${stores.length} cửa hàng`}
              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, boxShadow: 2 }}
            />
          </Box>

          {/* Directions button */}
          <Box sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 10 }}>
            <Chip
              label="📍 Chỉ đường"
              component="a"
              href={googleDirectionsUrl(activeStore?.coords.lat ?? 0, activeStore?.coords.lng ?? 0)}
              target="_blank"
              rel="noopener noreferrer"
              clickable
              sx={{
                bgcolor: "#fff",
                color: "#f25c05",
                fontWeight: 700,
                boxShadow: 2,
                "&:hover": { bgcolor: "#f25c05", color: "#fff" },
              }}
            />
          </Box>

          <iframe
            key={mapSrc}
            title="Bản đồ hệ thống cửa hàng Cường Hoa"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            onLoad={() => setIsLoading(false)}
          />
        </Paper>
      </Grid>

      {/* Store List Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 2,
            height: { xs: "auto", md: height },
            overflow: "auto",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom color="#333">
            Danh sách cửa hàng
          </Typography>

          <Stack spacing={2}>
            {stores.map((store, index) => {
              const isActive = (selectedStore ?? stores[0])?.id === store.id;
              return (
                <motion.div
                  key={store.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => setSelectedStore(store)}
                    sx={{
                      cursor: "pointer",
                      border: isActive ? "2px solid #f25c05" : "2px solid transparent",
                      borderRadius: 2,
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: "#ffb700" },
                    }}
                  >
                    <CardContent sx={{ pb: "12px !important" }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight={700} fontSize="0.9rem" color="#222">
                            {store.name}
                          </Typography>
                          <Chip
                            label={String.fromCharCode(65 + index)}
                            size="small"
                            sx={{
                              bgcolor: isActive ? "#f25c05" : "#f0f0f0",
                              color: isActive ? "#fff" : "#333",
                              fontWeight: 700,
                              minWidth: 26,
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={0.75} alignItems="flex-start">
                          <LocationOnIcon sx={{ color: "#f25c05", fontSize: 16, mt: 0.25, flexShrink: 0 }} />
                          <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                            {store.address}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PhoneIcon sx={{ color: "#f25c05", fontSize: 15, flexShrink: 0 }} />
                          <Typography
                            variant="caption"
                            component="a"
                            href={`tel:${store.phone}`}
                            sx={{ color: "#333", textDecoration: "none", "&:hover": { color: "#f25c05" } }}
                          >
                            {store.phone}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={store.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            ({store.totalRatings})
                          </Typography>
                        </Stack>

                        <Button
                          size="small"
                          variant={isActive ? "contained" : "outlined"}
                          startIcon={<DirectionsIcon />}
                          href={googleDirectionsUrl(store.coords.lat, store.coords.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            ...(isActive
                              ? { bgcolor: "#f25c05", color: "#fff", "&:hover": { bgcolor: "#e64a19" } }
                              : { borderColor: "#ffb700", color: "#f25c05" }),
                            borderRadius: 1.5,
                            fontSize: "0.78rem",
                          }}
                        >
                          Chỉ đường
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
