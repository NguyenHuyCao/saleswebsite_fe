"use client";

import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { WARRANTY_CARDS, WARRANTY_ITEMS } from "@/features/user/warranty/constants";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

export default function WarrantyConditions() {
  return (
    <Box px={{ xs: 2, sm: 4 }} py={{ xs: 5, sm: 8 }} bgcolor="#f9f9f9">
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        color="primary"
        mb={6}
      >
        Điều kiện bảo hành sản phẩm
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {WARRANTY_ITEMS.map((item, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "transform .3s",
                  ":hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}
              >
                <Box mb={2} aria-label="Icon">
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
