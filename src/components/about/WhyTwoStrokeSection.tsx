"use client";

import { Box, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const features = [
  {
    icon: WhatshotIcon,
    title: "Công suất mạnh, dễ khởi động",
  },
  {
    icon: BuildIcon,
    title: "Cấu tạo đơn giản, dễ bảo trì",
  },
  {
    icon: AttachMoneyIcon,
    title: "Giá thành hợp lý, tiết kiệm nhiên liệu",
  },
];

const WhyTwoStrokeSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      px={{ xs: 2, md: 4 }}
      py={{ xs: 6, md: 8 }}
      sx={{
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={6}
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
        }}
      >
        TẠI SAO LẠI LÀ{" "}
        <Box component="span" sx={{ color: "#ffb700" }}>
          MÁY 2 THÌ?
        </Box>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                whileHover={{
                  scale: 1.03,
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    transition: "all 0.3s ease",
                    "& svg": {
                      fontSize: 42,
                      color: "#ffb700",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover svg": {
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  <IconComponent />
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    color="text.primary"
                  >
                    {feature.title}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WhyTwoStrokeSection;
