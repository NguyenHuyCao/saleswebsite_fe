import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const guarantees = [
  "Giao hàng siêu tốc 2–4h tại TP.HCM",
  "Bảo hành chính hãng 12 tháng",
  "Tư vấn kỹ thuật miễn phí",
  "Tặng kèm phụ kiện bảo dưỡng",
];

const MotionPaper = motion(Paper);

const GuaranteeSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mt={12} px={isMobile ? 2 : 4}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <MotionPaper
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.2 }}
                viewport={{ once: true }}
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
};

export default GuaranteeSection;
