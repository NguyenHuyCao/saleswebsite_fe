"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const commitments = [
  { text: "Hàng chính hãng" },
  { text: "Bảo hành 12 tháng" },
  { text: "Hỗ trợ kỹ thuật trọn đời" },
  { text: "Giao hàng toàn quốc" },
];

const SupportCommitmentsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box px={4} py={6} bgcolor="#fff">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="primary"
      >
        CAM KẾT & HỖ TRỢ
      </Typography>

      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
        {commitments.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: "#00bfa5", mb: 1 }} />
              <Typography fontSize={16} fontWeight={600}>
                {item.text}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SupportCommitmentsSection;
