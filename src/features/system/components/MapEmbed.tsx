"use client";

import { Paper, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { googleEmbedUrl } from "../queries";

type Props = { lat: number; lng: number };

export default function MapEmbed({ lat, lng }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const src = googleEmbedUrl(lat, lng);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <iframe
          title="Bản đồ cửa hàng"
          width="100%"
          height={isMobile ? 300 : 400}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </Paper>
    </motion.div>
  );
}
