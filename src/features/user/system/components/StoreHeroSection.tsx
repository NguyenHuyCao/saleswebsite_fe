"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Avatar,
  Rating,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useCallback, useRef } from "react";
import type { StoreInfo } from "../types";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsIcon from "@mui/icons-material/Directions";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarIcon from "@mui/icons-material/Star";
import MapEmbed from "./MapEmbed";

type Props = { store: StoreInfo };

export default function StoreHeroSection({ store }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const openMap = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coords.lat},${store.coords.lng}`;
    window.open(url, "_blank");
  }, [store.coords]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Box sx={{ position: "relative", bgcolor: "#f5f5f5", py: 6 }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background:
              "radial-gradient(circle at 20% 50%, #f25c05 0%, transparent 50%)",
          }}
        />

        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ px: { xs: 2, md: 4 } }}
        >
          {/* Left Column - Images and Map */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              {/* Images Gallery */}
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    bgcolor: "#fff",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{
                          position: "relative",
                          height: 300,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={store.images[0]}
                          alt={store.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Cửa hàng chính"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: "#f25c05",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Grid>
                    {store.images.slice(1, 4).map((img, idx) => (
                      <Grid key={idx} size={{ xs: 4 }}>
                        <Box
                          sx={{
                            position: "relative",
                            height: 80,
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                            "&:hover": { opacity: 0.8 },
                          }}
                        >
                          <Image
                            src={img}
                            alt={`${store.name} ${idx + 2}`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>

              {/* Map */}
              <motion.div variants={itemVariants}>
                <MapEmbed
                  lat={store.coords.lat}
                  lng={store.coords.lng}
                  storeName={store.name}
                  height={250}
                />
              </motion.div>
            </Stack>
          </Grid>

          {/* Right Column - Store Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#fff",
                }}
              >
                <Stack spacing={3}>
                  {/* Header */}
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#333"
                      gutterBottom
                    >
                      {store.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={store.rating} readOnly precision={0.5} />
                      <Typography variant="body2" color="text.secondary">
                        ({store.totalRatings} đánh giá)
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Contact Info */}
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#f25c05", width: 40, height: 40 }}
                      >
                        <LocationOnIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Địa chỉ
                        </Typography>
                        <Typography fontWeight={500}>
                          {store.address}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#f25c05", width: 40, height: 40 }}
                      >
                        <PhoneIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Hotline
                        </Typography>
                        <Typography
                          fontWeight={500}
                          component="a"
                          href={`tel:${store.phone}`}
                        >
                          {store.phone}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#f25c05", width: 40, height: 40 }}
                      >
                        <EmailIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography
                          fontWeight={500}
                          component="a"
                          href={`mailto:${store.email}`}
                        >
                          {store.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#f25c05", width: 40, height: 40 }}
                      >
                        <AccessTimeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Giờ mở cửa
                        </Typography>
                        <Typography fontWeight={500}>
                          Thứ 2 - Thứ 7: 8:00 - 17:30
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Chủ nhật: 9:00 - 12:00
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#f25c05", width: 40, height: 40 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Quản lý
                        </Typography>
                        <Typography fontWeight={500}>
                          {store.manager}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {store.managerPhone}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Divider />

                  {/* Action Buttons */}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={openMap}
                      startIcon={<DirectionsIcon />}
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        "&:hover": { bgcolor: "#e64a19" },
                      }}
                    >
                      Chỉ đường
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      href={`tel:${store.phone}`}
                      startIcon={<PhoneIcon />}
                      sx={{
                        borderColor: "#ffb700",
                        color: "#f25c05",
                        "&:hover": { borderColor: "#f25c05" },
                      }}
                    >
                      Gọi ngay
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
