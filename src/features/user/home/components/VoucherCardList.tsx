"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { Promotion } from "../types";
import Slider from "react-slick";

type Props = { vouchers: Promotion[] };

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

export default function VoucherCardList({ vouchers }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!vouchers?.length) return null;

  const settings = {
    dots: false,
    infinite: vouchers.length > (isMobile ? 1 : 3),
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    arrows: vouchers.length > (isMobile ? 1 : 3),
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code || "");
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1600);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Slider {...settings}>
        {vouchers.map((voucher, index) => (
          <Box key={voucher.id ?? index} px={1}>
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
                {voucher.code || "CODE"}
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderRight: "2px dashed #f25c05", mx: 1.5 }}
              />

              <Box flexGrow={1} display="flex" flexDirection="column">
                <Typography fontSize={13.5} fontWeight={600} color="#d35400">
                  🎁 Giảm {(voucher.discount! * 100).toFixed(0)}% – Tối đa{" "}
                  {(voucher.maxDiscount ?? 0).toLocaleString()}₫
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: "#d35400" }} />
                  <Typography fontSize={12.5} fontWeight={500} color="#d35400">
                    Áp dụng sản phẩm cụ thể
                  </Typography>
                </Box>
                <Typography fontSize={12} color="#666" mt={0.5}>
                  HSD:{" "}
                  {voucher.endDate
                    ? new Date(voucher.endDate).toLocaleDateString("vi-VN")
                    : "—"}
                </Typography>

                <Box mt={1.5} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleCopy(voucher.code || "", index)}
                    sx={{
                      bgcolor: "#d35400",
                      color: "#fff",
                      fontSize: 11.5,
                      px: 2,
                      py: 0.5,
                      borderRadius: 999,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#e67e22" },
                    }}
                  >
                    <Fade
                      in={copiedIndex === index}
                      timeout={200}
                      unmountOnExit
                    >
                      <Box component="span">🎉 Đã sao chép</Box>
                    </Fade>
                    {copiedIndex !== index && <span>Sao chép mã</span>}
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
