"use client";

import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const commitments = [
  "Cam kết 100% chính hãng",
  "Hoàn tiền 111% nếu hàng giả",
  "Giao tận tay khách hàng",
  "Mở hộp kiểm tra nhận hàng",
  "Hỗ trợ 24/7",
  "Đổi trả trong 7 ngày",
];

// Hiệu ứng xuất hiện từng dòng
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const CommitmentCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#fefefe",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Cam kết của chúng tôi
        </Typography>
        <Stack spacing={1.2}>
          {commitments.map((text, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">{text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
);
