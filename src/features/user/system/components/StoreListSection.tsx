"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  Rating,
  Pagination,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsIcon from "@mui/icons-material/Directions";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapIcon from "@mui/icons-material/Map";
import type { StoreInfo } from "../types";

// Component Map nhỏ cho mỗi store
const StoreMiniMap = ({ store }: { store: StoreInfo }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [mapError, setMapError] = useState(false);

  if (!apiKey || mapError) {
    return (
      <Box
        sx={{
          height: 150,
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <MapIcon sx={{ color: "#999", fontSize: 40 }} />
        <Button
          size="small"
          variant="outlined"
          startIcon={<DirectionsIcon />}
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coords.lat},${store.coords.lng}`;
            window.open(url, "_blank");
          }}
          sx={{ borderColor: "#ffb700", color: "#f25c05" }}
        >
          Mở Google Maps
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 150,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          "& .map-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      <iframe
        title={`Bản đồ ${store.name}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${store.coords.lat},${store.coords.lng}&zoom=14`}
        onError={() => setMapError(true)}
      />

      {/* Overlay để mở rộng */}
      <Box
        className="map-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          opacity: 0,
          transition: "opacity 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          const url = `https://www.google.com/maps/search/?api=1&query=${store.coords.lat},${store.coords.lng}`;
          window.open(url, "_blank");
        }}
      >
        <Chip
          icon={<DirectionsIcon />}
          label="Xem lớn hơn"
          sx={{
            bgcolor: "#fff",
            color: "#f25c05",
            fontWeight: 600,
            "&:hover": { bgcolor: "#ffb700", color: "#000" },
          }}
        />
      </Box>
    </Box>
  );
};

// Calculate distance between two coordinates (km)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
interface Props {
  stores: StoreInfo[];
}


export default function StoreListSection({ stores }: Props) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [radius, setRadius] = useState(50);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "distance" | "rating">("name");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const itemsPerPage = 6;

  // Get user location
  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSortBy("distance");
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
        },
      );
    }
  };

  // Cities for filter
  const cities = useMemo(() => {
    const citySet = new Set(
      stores.map((s) => s.address.split(",").pop()?.trim() || ""),
    );
    return ["all", ...Array.from(citySet)];
  }, [stores]);

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let filtered = stores.filter((store) => {
      // Search filter
      const matchesSearch =
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.address.toLowerCase().includes(search.toLowerCase());

      // City filter
      const storeCity = store.address.split(",").pop()?.trim() || "";
      const matchesCity = city === "all" || storeCity === city;

      // Distance filter (if user location available)
      let matchesDistance = true;
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.coords.lat,
          store.coords.lng,
        );
        store.distance = distance;
        matchesDistance = distance <= radius;
      }

      return matchesSearch && matchesCity && matchesDistance;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "distance" && a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });

    return filtered;
  }, [stores, search, city, radius, userLocation, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const currentStores = filteredStores.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
        Hệ thống cửa hàng
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tìm cửa hàng gần nhất để trải nghiệm sản phẩm
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Tìm theo tên hoặc địa chỉ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <Select
                value={city}
                label="Tỉnh/Thành phố"
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c === "all" ? "Tất cả" : c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={getUserLocation}
              disabled={loadingLocation}
              sx={{ height: 56 }}
            >
              {loadingLocation ? "Đang xác định..." : "Cửa hàng gần tôi"}
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">Tên A-Z</MenuItem>
                <MenuItem value="rating">Đánh giá cao</MenuItem>
                {userLocation && <MenuItem value="distance">Gần nhất</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {userLocation && (
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Bán kính tìm kiếm: {radius}km</Typography>
            <Slider
              value={radius}
              onChange={(_, value) => setRadius(value as number)}
              min={5}
              max={200}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>
        )}
      </Paper>

      {/* Store List */}
      <Grid container spacing={3}>
        {currentStores.map((store, idx) => (
          <Grid key={store.id} size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                {/* Mini Map - ĐÃ FIX LỖI */}
                <StoreMiniMap store={store} />

                <CardContent>
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" fontWeight={700}>
                        {store.name}
                      </Typography>
                      {store.distance && (
                        <Chip
                          label={`Cách ${store.distance.toFixed(1)}km`}
                          size="small"
                          sx={{ bgcolor: "#f25c05", color: "#fff" }}
                        />
                      )}
                    </Stack>

                    {/* Address */}
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <LocationOnIcon
                        sx={{ color: "#f25c05", fontSize: 20, mt: 0.3 }}
                      />
                      <Typography variant="body2">{store.address}</Typography>
                    </Stack>

                    {/* Contact */}
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                        <Typography variant="body2">{store.phone}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon
                          sx={{ color: "#f25c05", fontSize: 18 }}
                        />
                        <Typography variant="body2">8:00 - 17:30</Typography>
                      </Stack>
                    </Stack>

                    {/* Rating */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={store.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        ({store.totalRatings} đánh giá)
                      </Typography>
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" spacing={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<DirectionsIcon />}
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coords.lat},${store.coords.lng}`;
                          window.open(url, "_blank");
                        }}
                        sx={{ bgcolor: "#f25c05" }}
                      >
                        Chỉ đường
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<PhoneIcon />}
                        href={`tel:${store.phone}`}
                        sx={{ borderColor: "#ffb700", color: "#f25c05" }}
                      >
                        Gọi ngay
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* No Results */}
      {currentStores.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy cửa hàng phù hợp
          </Typography>
        </Box>
      )}
    </Box>
  );
}
