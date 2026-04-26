"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { motion } from "framer-motion";

const commitments = [
  {
    text: "Cam kết 100% chính hãng",
    icon: <VerifiedIcon sx={{ color: "#4caf50" }} />,
  },
  {
    text: "Hoàn tiền 111% nếu hàng giả",
    icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
  },
  {
    text: "Giao tận tay khách hàng",
    icon: <LocalShippingIcon sx={{ color: "#4caf50" }} />,
  },
  {
    text: "Mở hộp kiểm tra nhận hàng",
    icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
  },
  { text: "Hỗ trợ 24/7", icon: <VerifiedIcon sx={{ color: "#4caf50" }} /> },
  {
    text: "Đổi trả trong 7 ngày",
    icon: <CheckCircleIcon sx={{ color: "#4caf50" }} />,
  },
];

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function CommitmentCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fefefe",
          border: "1px solid #f0f0f0",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Cam kết của chúng tôi
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            gap={1.2}
          >
            {commitments.map((item, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <Box display="flex" alignItems="flex-start" gap={0.75}>
                  <Box sx={{ flexShrink: 0, mt: "1px" }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: "0.8rem" }}>
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
