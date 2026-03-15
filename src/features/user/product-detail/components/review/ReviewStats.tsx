"use client";

import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Stack,
  Paper,
} from "@mui/material";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  total: number;
  average: number;
  distribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

interface Props {
  stats: Stats;
}

export default function ReviewStats({ stats }: Props) {
  if (stats.total === 0) {
    return (
      <Box textAlign="center" py={2}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Chưa có đánh giá nào
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hãy là người đầu tiên đánh giá sản phẩm này!
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: "#f8f9fa",
          borderRadius: 3,
          border: "1px solid #f0f0f0",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          {/* Average Rating */}
          <Box textAlign="center">
            <Typography variant="h2" fontWeight={800} color="#f25c05">
              {stats.average.toFixed(1)}
            </Typography>
            <Rating value={stats.average} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {stats.total} đánh giá
            </Typography>
          </Box>

          {/* Distribution Bars */}
          <Box sx={{ flex: 1, width: "100%", maxWidth: 400 }}>
            {stats.distribution.map((item) => (
              <Stack
                key={item.rating}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" sx={{ minWidth: 30 }}>
                  {item.rating}
                </Typography>
                <Star size={16} color="#ffb700" fill="#ffb700" />
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#f25c05",
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 40 }}
                >
                  {item.count}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
}
