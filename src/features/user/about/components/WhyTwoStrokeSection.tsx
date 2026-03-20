// about/components/WhyTwoStrokeSection.tsx
"use client";

import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { whyTwoStroke } from "../constants/features";

export default function WhyTwoStrokeSection() {
  return (
    <Box
      id="why-two-stroke"
      px={{ xs: 2, md: 4 }}
      py={{ xs: 6, md: 8 }}
      sx={{ bgcolor: "#f9f9f9" }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="LỢI ÍCH NỔI BẬT"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />

        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
          }}
        >
          Tại sao chọn{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            máy 2 thì?
          </Box>
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          Khám phá những ưu điểm vượt trội của dòng máy 2 thì - sự lựa chọn hàng
          đầu cho công việc hiệu quả và tiết kiệm.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {whyTwoStroke.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <motion.div
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      bgcolor: feature.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <feature.icon sx={{ fontSize: 30, color: feature.color }} />
                  </Box>

                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: feature.color,
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {feature.stats}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
