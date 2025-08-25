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
  Fade,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slider from "react-slick";
import { motion } from "framer-motion";
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

const Item = ({ children }: { children: React.ReactNode }) => (
  <Paper
    elevation={4}
    sx={{
      backgroundColor: "#fff8e1",
      p: 2,
      borderRadius: 3,
      height: "100%",
      display: "flex",
      alignItems: "stretch",
      overflow: "hidden",
      boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
    }}
  >
    {children}
  </Paper>
);

export default function VoucherCardSlider() {
  const [vouchers, setVouchers] = useState<Promotion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions/requires-products`
        );
        const data = await res.json();
        setVouchers(data.data || []);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchPromotions();
  }, []);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
    <Box sx={{ py: 3 }}>
      <Slider {...settings}>
        {vouchers.map((voucher, index) => (
          <Box key={index} px={1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
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
                    borderRadius: 2,
                    px: 1,
                    flexShrink: 0,
                  }}
                >
                  {voucher.code}
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderRight: "2px dashed #f25c05", mx: 1.5 }}
                />

                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      fontSize={13.5}
                      fontWeight={600}
                      color="#d35400"
                    >
                      🎁 Giảm {(voucher.discount * 100).toFixed(0)}% – Tối đa{" "}
                      {voucher.maxDiscount.toLocaleString()}₫
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <InfoOutlinedIcon
                        sx={{ fontSize: 14, color: "#d35400" }}
                      />
                      <Typography
                        fontSize={12.5}
                        fontWeight={500}
                        color="#d35400"
                      >
                        Áp dụng sản phẩm cụ thể
                      </Typography>
                    </Box>
                    <Typography fontSize={12} color="#666" mt={0.5}>
                      HSD:{" "}
                      {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>

                  <Box
                    mt={1.5}
                    display="flex"
                    justifyContent={isMobile ? "center" : "flex-end"}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleCopy(voucher.code, index)}
                      sx={{
                        bgcolor: "#d35400",
                        color: "#fff",
                        fontSize: 11.5,
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        textTransform: "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#e67e22",
                        },
                      }}
                    >
                      <Fade
                        in={copiedIndex === index}
                        timeout={300}
                        unmountOnExit
                      >
                        <Box component="span">🎉 Đã sao chép</Box>
                      </Fade>
                      {copiedIndex !== index && <span>Sao chép mã</span>}
                    </Button>
                  </Box>
                </Box>
              </Item>
            </motion.div>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
