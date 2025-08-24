"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShieldCheck, Wrench, Handshake, Hammer } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: <ShieldCheck size={40} strokeWidth={2.2} />,
    title: "Cam kết chính hãng 100%",
  },
  {
    icon: <Hammer size={40} strokeWidth={2.2} />,
    title: "Phụ tùng dễ thay thế, bảo trì",
  },
  {
    icon: <Wrench size={40} strokeWidth={2.2} />,
    title: "Hỗ trợ kỹ thuật suốt vòng đời sản phẩm",
  },
  {
    icon: <Handshake size={40} strokeWidth={2.2} />,
    title: "Quan hệ lâu dài với nhà cung cấp – giá tốt",
  },
];

export default function WhyChooseUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box py={6} px={4} bgcolor="#fff">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="primary"
      >
        LÝ DO CHỌN <span style={{ color: "#ffb700" }}>CHÚNG TÔI</span>
      </Typography>

      <Grid container spacing={isMobile ? 3 : 4} justifyContent="center">
        {reasons.map((reason, index) => (
          <Grid size={{xs:12, sm:6, md:3,}}  key={index}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "transform 0.3s ease",
                  height: "100%",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {reason.icon}
                  </Box>
                </motion.div>
                <Typography fontWeight={600} fontSize={15} color="text.primary">
                  {reason.title}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
