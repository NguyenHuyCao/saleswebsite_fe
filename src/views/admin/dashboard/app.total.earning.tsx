"use client";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";

// ** Icons Imports
import MenuUp from "mdi-material-ui/MenuUp";
import DotsVertical from "mdi-material-ui/DotsVertical";

// ** Next Imports
import Image from "next/image";

// ** React Imports
import { useEffect, useState } from "react";

interface BrandSaleType {
  name: string;
  logo: string;
  founded: string;
  revenue: number;
}

const TotalEarning = () => {
  const [brandSales, setBrandSales] = useState<BrandSaleType[]>([]);
  const [thisYearTotal, setThisYearTotal] = useState<number>(0);
  const [lastYearTotal, setLastYearTotal] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(0);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/monthly-brand-report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();

        if (json.status === 200 && json.data) {
          const data = json.data;
          setBrandSales(
            data.brandSales.map((item: any) => ({
              name: item[0],
              logo: item[1],
              founded: item[2],
              revenue: item[3],
            }))
          );
          setThisYearTotal(data.thisYearTotal);
          setLastYearTotal(data.lastYearTotal);
          setGrowthRate(data.growthRate);
        } else {
          console.error("Invalid response structure:", json);
        }
      } catch (error) {
        console.error("Fetch brand report error:", error);
      }
    };

    fetchData();
  }, []);

  const topBrands = [...brandSales]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader
        title="Tổng doanh thu"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.6 !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <IconButton
            size="small"
            sx={{ color: "text.secondary" }}
            onClick={() => setOpenDetail(true)}
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, fontSize: "2.125rem !important" }}
          >
            {thisYearTotal.toLocaleString("vi-VN")} ₫
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: growthRate >= 0 ? "success.main" : "error.main",
              ml: 2,
            }}
          >
            <MenuUp sx={{ fontSize: "1.875rem", verticalAlign: "middle" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.abs(growthRate).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
        <Typography component="p" variant="caption" sx={{ mb: 10 }}>
          So với {lastYearTotal.toLocaleString("vi-VN")} ₫ năm ngoái
        </Typography>

        {topBrands.map((item, index) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              alignItems: "center",
              ...(index !== topBrands.length - 1 ? { mb: 8.5 } : {}),
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                mr: 3,
                width: 40,
                height: 40,
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <Image
                src={`/images/cards/${item.logo}`}
                alt={item.name}
                width={40}
                height={20}
                style={{ objectFit: "contain" }}
              />
            </Avatar>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  marginRight: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}
                >
                  {item.name}
                </Typography>
                <Typography variant="caption">
                  Thành lập: {item.founded}
                </Typography>
              </Box>
              <Box
                sx={{ minWidth: 85, display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  {item.revenue.toLocaleString("vi-VN")} ₫
                </Typography>
                <LinearProgress
                  color="primary"
                  value={(item.revenue / thisYearTotal) * 100 || 0}
                  variant="determinate"
                />
              </Box>
            </Box>
          </Box>
        ))}
      </CardContent>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
        disableScrollLock={true}
      >
        <DialogTitle>Chi tiết doanh thu theo thương hiệu</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 400 }}>
          {brandSales.map((item) => (
            <Box
              key={item.name}
              sx={{ display: "flex", alignItems: "center", mb: 4 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                }}
              >
                <Image
                  src={`/images/cards/${item.logo}`}
                  alt={item.name}
                  width={40}
                  height={20}
                  style={{ objectFit: "contain" }}
                />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.name} ({item.founded})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Doanh thu: {item.revenue.toLocaleString("vi-VN")} ₫
                </Typography>
                <LinearProgress
                  sx={{ mt: 1 }}
                  color="primary"
                  value={(item.revenue / thisYearTotal) * 100 || 0}
                  variant="determinate"
                />
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TotalEarning;
