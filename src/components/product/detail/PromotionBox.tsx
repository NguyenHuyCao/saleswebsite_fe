"use client";

import { Box, Typography, Stack } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

// Danh sách ưu đãi
const promotions = [
  "Áp dụng Phiếu quà tặng/ Mã giảm giá theo ngành hàng.",
  "Giảm giá 10% khi mua từ 5 sản phẩm trở lên.",
  "Tặng 100.000₫ khi mua online tại HCM và một số khu vực khác.",
];

const PromotionBox = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      sx={{
        bgcolor: "#fff8e1",
        p: 2,
        border: "1px solid #ffecb3",
        borderRadius: 2,
        boxShadow: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 3,
          borderColor: "#ffb700",
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <CardGiftcardIcon color="warning" />
        <Typography
          variant="body1"
          fontWeight={700}
          color="warning.main"
          sx={{ textTransform: "uppercase" }}
        >
          Khuyến mãi đặc biệt !!!
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {promotions.map((text, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircleIcon color="success" fontSize="small" />
            {text}
          </Typography>
        ))}
      </Stack>
    </Box>
  </motion.div>
);

export default PromotionBox;
