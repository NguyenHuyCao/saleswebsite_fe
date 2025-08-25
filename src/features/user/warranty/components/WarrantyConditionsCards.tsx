"use client";

import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { WARRANTY_CARDS, WARRANTY_ITEMS } from "@/features/user/warranty/constants";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

export default function WarrantyConditionsCards() {
  return (
    <Box px={{ xs: 2, md: 4 }} py={8} bgcolor="#f9fafb">
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        color="primary"
        mb={6}
      >
        Điều kiện và thời gian bảo hành
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {WARRANTY_CARDS.map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: "100%",
                  textAlign: "center",
                  transition: "transform .3s, box-shadow .3s",
                  ":hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}
              >
                <Box mb={2}>{item.icon}</Box>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {item.title}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
