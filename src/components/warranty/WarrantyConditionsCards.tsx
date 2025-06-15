"use client";

import { Box, Typography, Grid, Paper } from "@mui/material";
import { Wrench, AlertTriangle, Package } from "lucide-react";
import { motion } from "framer-motion";

const warrantyCards = [
  {
    icon: <Wrench size={36} color="#2563eb" aria-label="Wrench Icon" />,
    title: "Thời gian bảo hành",
    description: "Tối đa 12 tháng kể từ ngày mua (tùy từng sản phẩm).",
  },
  {
    icon: <AlertTriangle size={36} color="#f25c05" aria-label="Alert Icon" />,
    title: "Không bảo hành nếu:",
    description:
      "Sản phẩm bị hỏng do sử dụng sai cách, rơi vỡ, tự ý tháo lắp hoặc can thiệp kỹ thuật.",
  },
  {
    icon: <Package size={36} color="#10b981" aria-label="Package Icon" />,
    title: "Yêu cầu:",
    description:
      "Cần cung cấp mã đơn hàng và tên sản phẩm cần bảo hành để được xử lý nhanh chóng.",
  },
];

// Framer Motion animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const WarrantyConditionsCards = () => {
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
        {warrantyCards.map((item, index) => (
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
                  transition: "transform 0.3s ease, box-shadow 0.3s",
                  ":hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
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
};

export default WarrantyConditionsCards;
