// system/components/StoreInfoCard.tsx
"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { motion } from "framer-motion";
import type { StoreInfo } from "../types";

type Props = {
  store: StoreInfo;
  onDirections: () => void;
};

export default function StoreInfoCard({ store, onDirections }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Format hours from object to string
  const formatHours = (hours: StoreInfo["hours"]) => {
    return `Thứ 2 - Thứ 7: ${hours.monday.split(" - ")[0]} - ${hours.monday.split(" - ")[1]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
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
            aria-label="Số điện thoại"
          >
            {store.phone}
          </Link>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon sx={{ color: "#ffb700", mr: 2 }} />
          <Typography>{formatHours(store.hours)}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <CheckCircleIcon sx={{ color: "green", mr: 2 }} />
          <Typography fontWeight={600}>Còn hàng</Typography>
        </Box>

        <Button
          variant="contained"
          color="warning"
          startIcon={<GpsFixedIcon />}
          onClick={onDirections}
          sx={{ mt: 2 }}
          fullWidth={isMobile}
        >
          Chỉ đường
        </Button>
      </Paper>
    </motion.div>
  );
}
