"use client";

import { Box, Paper, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const stats = [
  {
    icon: BuildIcon,
    value: "15,000+",
    label: "Yêu cầu đã xử lý",
    color: "#0d47a1",
  },
  {
    icon: SpeedIcon,
    value: "24h",
    label: "Thời gian xử lý",
    color: "#1565c0",
  },
  {
    icon: ThumbUpIcon,
    value: "98%",
    label: "Khách hàng hài lòng",
    color: "#0277bd",
  },
  {
    icon: HistoryEduIcon,
    value: "6+",
    label: "Năm kinh nghiệm",
    color: "#01579b",
  },
];

export default function WarrantyStats() {
  return (
    <Grid container spacing={2} sx={{ my: 4 }}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Grid key={idx} size={{ xs: 6, md: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              style={{ height: "100%" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 3,
                  height: "100%",
                  border: "1px solid #e8eef7",
                  borderTop: `3px solid ${stat.color}`,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(13,71,161,0.12)",
                    borderColor: stat.color,
                    borderTopColor: stat.color,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: "#e3f2fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 22, color: stat.color }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      sx={{
                        color: stat.color,
                        lineHeight: 1.1,
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.3,
                        fontSize: { xs: "0.68rem", sm: "0.75rem" },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
}
