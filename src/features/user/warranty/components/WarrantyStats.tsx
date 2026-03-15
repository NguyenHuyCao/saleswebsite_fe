// warranty/components/WarrantyStats.tsx
"use client";

import { Box, Paper, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import GroupIcon from "@mui/icons-material/Group";

const stats = [
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    value: "15,000+",
    label: "Yêu cầu bảo hành đã xử lý",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    value: "24h",
    label: "Thời gian xử lý trung bình",
  },
  {
    icon: <ThumbUpIcon sx={{ fontSize: 40 }} />,
    value: "98%",
    label: "Khách hàng hài lòng",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    value: "50+",
    label: "Trung tâm bảo hành",
  },
];

export default function WarrantyStats() {
  return (
    <Grid container spacing={3} sx={{ my: 4 }}>
      {stats.map((stat, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(13,71,161,0.15)",
                },
              }}
            >
              <Box sx={{ color: "#0d47a1", mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h5" fontWeight={800} color="#0d47a1">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
