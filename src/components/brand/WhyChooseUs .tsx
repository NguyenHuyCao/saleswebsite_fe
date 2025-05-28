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

const reasons = [
  {
    icon: <ShieldCheck size={36} />,
    title: "Cam kết chính hãng 100%",
  },
  {
    icon: <Hammer size={36} />,
    title: "Phụ tùng dễ thay thế, bảo trì",
  },
  {
    icon: <Wrench size={36} />,
    title: "Hỗ trợ kỹ thuật suốt vòng đời sản phẩm",
  },
  {
    icon: <Handshake size={36} />,
    title: "Quan hệ lâu dài với nhà cung cấp – giá tốt",
  },
];

const WhyChooseUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box py={6} px={4} bgcolor="#fff">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="primary"
      >
        LÝ DO CHỌN THƯƠNG HIỆU CỦA CHÚNG TÔI
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {reasons.map((reason, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {reason.icon}
              </Box>
              <Typography fontWeight={600}>{reason.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;
