"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Promotion {
  name: string;
  code: string;
  discount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  requiresCode: boolean;
  applicableProductIds: number[];
}

const Item = (props: { children: React.ReactNode }) => (
  <Paper
    sx={{
      backgroundColor: "#fff8e1",
      p: 1.5,
      color: "#000",
      borderRadius: 2,
      display: "flex",
      overflow: "hidden",
      height: "100%",
      boxShadow: 1,
    }}
  >
    {props.children}
  </Paper>
);

export default function VoucherCardSlider() {
  const [vouchers, setVouchers] = useState<Promotion[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/promotions/requires-products"
        );
        const data = await res.json();
        setVouchers(data.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchPromotions();
  }, []);

  const settings = {
    dots: false,
    infinite: vouchers.length > (isMobile ? 1 : 3),
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    arrows: vouchers.length > (isMobile ? 1 : 3),
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ py: 2 }}>
      <Slider {...settings}>
        {vouchers.map((voucher, index) => (
          <Box key={index} px={1}>
            <Item>
              <Box
                sx={{
                  bgcolor: "#ffb700",
                  width: 70,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  px: 1,
                }}
              >
                {voucher.code}
              </Box>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderRight: "2px dashed #f25c05", mx: 1 }}
              />
              <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  <Typography fontSize={13} fontWeight={600} color="#000">
                    Giảm {(voucher.discount * 100).toFixed(0)}% - Tối đa{" "}
                    {voucher.maxDiscount.toLocaleString()}₫
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                    <InfoOutlinedIcon sx={{ fontSize: 13, color: "#f25c05" }} />
                    <Typography fontSize={12} color="#f25c05" fontWeight={500}>
                      Điều kiện
                    </Typography>
                  </Box>
                  <Typography fontSize={12} color="#555" mt={0.5}>
                    HSD: {voucher.endDate}
                  </Typography>
                </Box>
                <Box mt={1} textAlign="right">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#d35400",
                      color: "#fff",
                      fontSize: 11,
                      px: 1.5,
                      py: 0.3,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#e67e22",
                      },
                    }}
                  >
                    Sao chép
                  </Button>
                </Box>
              </Box>
            </Item>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
