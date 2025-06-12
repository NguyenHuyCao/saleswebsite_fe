"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Brand {
  id: number;
  name: string;
  logo: string;
  originCountry: string;
}

interface Props {
  brands: Brand[];
}

const BrandListSection = ({ brands }: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const rows = [];
  for (let i = 0; i < brands.length; i += 3) {
    rows.push(brands.slice(i, i + 3));
  }

  return (
    <Box px={{ xs: 2, sm: 4 }} py={8} bgcolor="#f9fafb">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        sx={{ color: theme.palette.primary.main }}
      >
        DANH SÁCH <span style={{ color: "#ffb700" }}>THƯƠNG HIỆU</span>
      </Typography>

      {rows.map((row, rowIndex) => (
        <Grid
          container
          spacing={isMobile ? 2 : 4}
          justifyContent="center"
          key={rowIndex}
          mb={2}
        >
          {row.map((brand) => (
            <Grid key={brand.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: "100%",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                    "& .logo": {
                      transform: "scale(1.1)",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    },
                    "&::after": {
                      opacity: 1,
                    },
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "40%",
                    background:
                      "radial-gradient(circle at bottom, #ffe08255, transparent)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 0,
                  },
                }}
              >
                <Box mb={2} position="relative" zIndex={1}>
                  <Image
                    src={`http://localhost:8080/api/v1/files/${brand.logo}`}
                    alt={brand.name}
                    width={100}
                    height={60}
                    className="logo"
                    style={{
                      transition: "transform 0.3s ease",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  fontWeight="bold"
                  fontSize={16}
                  mb={1}
                  zIndex={1}
                  position="relative"
                >
                  {brand.name}
                </Typography>

                <Typography
                  fontSize={14}
                  color="text.secondary"
                  mb={2}
                  position="relative"
                  zIndex={1}
                >
                  Quốc gia: {brand.originCountry}
                </Typography>

                <Stack alignItems="center" position="relative" zIndex={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      router.push(`/product?brand=${brand.name.toLowerCase()}`)
                    }
                    sx={{
                      textTransform: "none",
                      borderColor: "#ffb700",
                      color: "black",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#fff8e1",
                        borderColor: "#f25c05",
                      },
                    }}
                  >
                    Xem sản phẩm
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default BrandListSection;
