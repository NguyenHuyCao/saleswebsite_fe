"use client";

import * as React from "react";
import { Box, Typography, Button, Grid, Paper, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const vouchers = [
  {
    code: "EGA15",
    description: "Giảm 15% cho đơn hàng từ 500K.",
    expiry: "28/03/2025",
    expired: true,
  },
  {
    code: "EGA30",
    description: "Giảm 30% cho đơn hàng từ 1500K.",
    expiry: "20/03/2025",
    expired: true,
  },
  {
    code: "FSHIP",
    description: "Miễn phí ship cho đơn hàng trên 200K.",
    expiry: "30/12/2025",
    expired: false,
  },
  {
    code: "EGA50",
    description: "Giảm 50% cho đơn hàng từ 10 triệu.",
    expiry: "01/01/2026",
    expired: false,
  },
];

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

export default function VoucherCardList() {
  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {vouchers.map((voucher, index) => (
          <Grid key={index} size={{ xs: 4, sm: 4, md: 3 }}>
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
                    {voucher.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                    <InfoOutlinedIcon sx={{ fontSize: 13, color: "#f25c05" }} />
                    <Typography fontSize={12} color="#f25c05" fontWeight={500}>
                      Điều kiện
                    </Typography>
                  </Box>
                  <Typography fontSize={12} color="#555" mt={0.5}>
                    HSD: {voucher.expiry}
                  </Typography>
                </Box>
                <Box mt={1} textAlign="right">
                  {voucher.expired ? (
                    <Button
                      disabled
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "#000",
                        borderColor: "#eee",
                        fontSize: 11,
                        px: 1.5,
                        py: 0.3,
                      }}
                    >
                      Hết hạn
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        fontSize: 11,
                        px: 1.5,
                        py: 0.3,
                        textTransform: "none",
                      }}
                    >
                      Sao chép
                    </Button>
                  )}
                </Box>
              </Box>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
