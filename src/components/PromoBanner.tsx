import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const PromoBanner = () => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 6,
        backgroundColor: "#000",
        color: "white",
      }}
    >
      <Grid container alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            p: { xs: 4, md: 6 },
            backgroundImage: "url(/images/banner/ima.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: { xs: 280, md: 400 },
          }}
        >
          <Box
            sx={{
              background: "rgba(0,0,0,0.5)",
              borderRadius: 2,
              px: 4,
              py: 3,
              maxWidth: 350,
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                bgcolor: "#ffb700",
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600,
              }}
            >
              1.550.000Đ
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={2}
              sx={{ color: "#fff" }}
            >
              Khuyến mãi
            </Typography>
            <Typography variant="h5" fontWeight={400} sx={{ color: "#fff" }}>
              Pin DEWALT
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#fff",
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                "&:hover": {
                  bgcolor: "#ffb700",
                },
              }}
            >
              Xem ngay
            </Button>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: "none", md: "block" },
            backgroundImage: "url(/images/banner/imagesbanner.jpeg)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            minHeight: 400,
          }}
        />
      </Grid>
    </Box>
  );
};

export default PromoBanner;
