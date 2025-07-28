"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Modal,
  Fade,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
  imageAvt: string;
  name: string;
  revenueThisMonth?: number;
  totalRevenue?: number;
  pricePerUnit: number;
}

const ProductItem = ({
  product,
  isTop,
}: {
  product: Product;
  isTop: boolean;
}) => {
  const revenue = isTop
    ? product.revenueThisMonth ?? 0
    : product.totalRevenue ?? 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Image
        src={`${product.imageAvt}`}
        alt={product.name}
        width={28}
        height={28}
        style={{ marginRight: 12 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography fontWeight={600} fontSize={14}>
          {product.name}
        </Typography>
        <Typography variant="caption">
          Đơn giá: {product.pricePerUnit.toLocaleString("vi-VN")} ₫
        </Typography>
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: isTop ? "success.main" : "error.main",
          minWidth: "90px",
          textAlign: "right",
        }}
      >
        {revenue.toLocaleString("vi-VN")} ₫
      </Typography>
    </Box>
  );
};

const TopSellingAndLowRevenue = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [lowRevenue, setLowRevenue] = useState<Product[]>([]);
  const [openTop, setOpenTop] = useState(false);
  const [openLow, setOpenLow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchTop = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/top-selling`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.status === 200) setTopSelling(json.data);
    };

    const fetchLow = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/low-revenue-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.status === 200) setLowRevenue(json.data);
    };

    fetchTop();
    fetchLow();
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 5,
                }}
              >
                <Typography fontWeight={500} fontSize={20}>
                  Bán chạy
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ cursor: "pointer", mt: 1 }}
                  onClick={() => setOpenTop(true)}
                >
                  Xem tất cả
                </Typography>
              </Box>
              {topSelling.slice(0, 5).map((p) => (
                <ProductItem key={p.name} product={p} isTop={true} />
              ))}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 5,
                }}
              >
                <Typography fontWeight={500} fontSize={20}>
                  Doanh số thấp
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ cursor: "pointer", mt: 1 }}
                  onClick={() => setOpenLow(true)}
                >
                  Xem tất cả
                </Typography>
              </Box>
              {lowRevenue.slice(0, 5).map((p) => (
                <ProductItem key={p.name} product={p} isTop={false} />
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Modal top selling */}
      <Modal
        open={openTop}
        onClose={() => setOpenTop(false)}
        disableScrollLock={true}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "none",
          },
        }}
      >
        <Fade in={openTop}>
          <Box
            sx={{
              maxWidth: 600,
              bgcolor: "background.paper",
              mx: "auto",
              mt: isMobile ? 4 : 10,
              borderRadius: 2,
              boxShadow: 0,
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" mb={3}>
              Danh sách sản phẩm bán chạy
            </Typography>
            {topSelling.map((p) => (
              <ProductItem key={p.name} product={p} isTop={true} />
            ))}
            <Stack alignItems="flex-end" mt={2}>
              <Button onClick={() => setOpenTop(false)}>Đóng</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Modal low revenue */}
      <Modal
        open={openLow}
        onClose={() => setOpenLow(false)}
        disableScrollLock={true}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "none",
          },
        }}
      >
        <Fade in={openLow}>
          <Box
            sx={{
              maxWidth: 600,
              bgcolor: "background.paper",
              mx: "auto",
              mt: isMobile ? 4 : 10,
              borderRadius: 2,
              boxShadow: 0,
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" mb={3}>
              Danh sách sản phẩm doanh số thấp
            </Typography>
            {lowRevenue.map((p) => (
              <ProductItem key={p.name} product={p} isTop={false} />
            ))}
            <Stack alignItems="flex-end" mt={2}>
              <Button onClick={() => setOpenLow(false)}>Đóng</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default TopSellingAndLowRevenue;
