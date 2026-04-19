"use client";

import React from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const guarantees = [
  "Giao hàng siêu tốc 2–4h tại TP.HCM",
  "Bảo hành chính hãng 12 tháng",
  "Tư vấn kỹ thuật miễn phí",
  "Tặng kèm phụ kiện bảo dưỡng",
];

const MotionPaper = motion(Paper);

export default function GuaranteeSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mt={12} px={isMobile ? 2 : 4}>
      <motion.div

        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          mb={4}
          sx={{ fontSize: { xs: 18, sm: 20 } }}
        >
          CAM KẾT – CHÍNH SÁCH
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {guarantees.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <MotionPaper
                whileHover={{ scale: 1.03 }}

                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.2 }}
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 3,
                  height: "100%",
                  bgcolor: "#fff",
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: theme.palette.success.main,
                    fontSize: 36,
                    mb: 1,
                  }}
                />
                <Typography fontSize={15} fontWeight={500} color="text.primary">
                  {item}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
}
