"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useCallback } from "react";

const StoreLocator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const store = {
    name: "Cửa Hàng Chính DolaTool",
    address: "7FGV+PM, Lục Nam District, Bắc Giang, Việt Nam",
    phone: "0909 123 456",
    hours: "Thứ 2 – Thứ 7: 8:00 – 17:30",
    status: "Còn hàng",
    mapLink:
      "https://www.google.com/maps/dir/?api=1&destination=21.274048,106.489299",
  };

  const openMap = useCallback(() => {
    window.open(store.mapLink, "_blank");
  }, []);

  return (
    <Box px={4} py={6}>
      <Grid container spacing={4}>
        {/* Store Info Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {store.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <RoomIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Typography>{store.address}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Link
                href={`tel:${store.phone}`}
                underline="hover"
                color="inherit"
              >
                {store.phone}
              </Link>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTimeIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Typography>{store.hours}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircleIcon sx={{ color: "green", mr: 2 }} />
              <Typography fontWeight={600}>{store.status}</Typography>
            </Box>
            <Button
              variant="contained"
              color="warning"
              startIcon={<GpsFixedIcon />}
              onClick={openMap}
              sx={{ mt: 2 }}
            >
              Chỉ đường
            </Button>
          </Paper>
        </Grid>

        {/* Embedded Google Map */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <iframe
              title="Store Map"
              width="100%"
              height={isMobile ? 300 : 400}
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.690859217451!2d106.48710087520563!3d21.274048180378595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1svi!2s!4v1748514000000"
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoreLocator;
