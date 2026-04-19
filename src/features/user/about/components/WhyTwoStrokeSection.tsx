"use client";

import { Box, Typography, Grid, Chip, Card, CardContent } from "@mui/material";
import { whyTwoStroke } from "../constants/features";

export default function WhyTwoStrokeSection() {
  return (
    <Box
      id="why-two-stroke"
      py={{ xs: 6, md: 8 }}
      sx={{ bgcolor: "#f9f9f9", mx: { xs: -2, sm: -3, md: -3 }, px: { xs: 2, sm: 3, md: 3 } }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="LỢI ÍCH NỔI BẬT"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Tại sao chọn{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            máy 2 thì?
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: "auto" }}>
          Khám phá những ưu điểm vượt trội của dòng máy 2 thì — sự lựa chọn hàng đầu cho công việc hiệu quả và tiết kiệm chi phí.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {whyTwoStroke.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #f0f0f0",
                boxShadow: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 32px rgba(242,92,5,0.12)",
                  borderColor: feature.color + "40",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    bgcolor: feature.color + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <feature.icon sx={{ fontSize: 28, color: feature.color }} />
                </Box>

                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {feature.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: 2 }}>
                  {feature.description}
                </Typography>

                <Box
                  sx={{
                    display: "inline-block",
                    bgcolor: feature.color,
                    color: "#fff",
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1.5,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {feature.stats}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
