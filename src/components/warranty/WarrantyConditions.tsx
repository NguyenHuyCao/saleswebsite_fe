"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { Build, WarningAmber, Inventory } from "@mui/icons-material";
import { motion } from "framer-motion";

const warrantyItems = [
  {
    icon: <Build fontSize="large" color="primary" />,
    title: "Thời gian bảo hành",
    content: "Áp dụng tối đa 12 tháng kể từ ngày mua, tùy theo sản phẩm.",
  },
  {
    icon: <WarningAmber fontSize="large" color="error" />,
    title: "Các trường hợp không áp dụng",
    content:
      "Rơi vỡ, cháy nổ, hư hỏng do tác động ngoại lực hoặc tự ý sửa chữa.",
  },
  {
    icon: <Inventory fontSize="large" color="success" />,
    title: "Điều kiện tiếp nhận",
    content:
      "Cung cấp đúng mã đơn hàng, sản phẩm và mô tả lỗi rõ ràng để được xử lý nhanh.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const WarrantyConditions = () => {
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
        {warrantyItems.map((item, index) => (
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
                  transition: "transform 0.3s ease",
                  ":hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
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
};

export default WarrantyConditions;
