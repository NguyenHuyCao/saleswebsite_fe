"use client";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Fade,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import DotsVertical from "mdi-material-ui/DotsVertical";
import ChevronUp from "mdi-material-ui/ChevronUp";
import ChevronDown from "mdi-material-ui/ChevronDown";

type Period = "week" | "month" | "year";

interface Category {
  id: number;
  name: string;
  image: string;
  sales: {
    week: number;
    month: number;
    year: number;
    total: number;
    weekPerf: number;
    monthPerf: number;
    yearPerf: number;
  };
}

const getPerfColor = (value: number) =>
  value >= 0 ? "success.main" : "error.main";
const getTrendIcon = (value: number) =>
  value >= 0 ? (
    <ChevronUp sx={{ color: "success.main" }} />
  ) : (
    <ChevronDown sx={{ color: "error.main" }} />
  );

const SalesByCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [period, setPeriod] = useState<Period>("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          "http://localhost:8080/api/v1/dashboard/overview/category-sales",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (json.status === 200) {
          setData(json.data);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleViewDetails = () => {
    setAnchorEl(null);
    setOpenModal(true);
  };

  const getValueByPeriod = (item: Category) => {
    const value = item.sales[period];
    const perf = item.sales[
      `${period}Perf` as keyof typeof item.sales
    ] as number;
    return { value, perf };
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Doanh số theo danh mục"
          action={
            <>
              <IconButton size="small" onClick={handleMenuClick}>
                <DotsVertical />
              </IconButton>
              <Menu
                disableScrollLock={true}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleViewDetails}>Xem chi tiết</MenuItem>
              </Menu>
            </>
          }
        />
        <CardContent>
          {data.slice(0, 5).map((item) => {
            const { value, perf } = getValueByPeriod(item);
            return (
              <Box
                key={item.id}
                sx={{ display: "flex", mb: 4, alignItems: "center" }}
              >
                <Avatar
                  src={`/images/categories/${item.image}`}
                  sx={{ width: 40, height: 40, mr: 3 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value.toLocaleString("vi-VN")} ₫
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center">
                  {getTrendIcon(perf)}
                  <Typography
                    variant="caption"
                    sx={{ color: getPerfColor(perf), fontWeight: 600 }}
                  >
                    {Math.abs(perf).toFixed(2)}%
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </CardContent>
      </Card>

      {/* Modal chi tiết - không làm tối màn hình và có nút đóng */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        hideBackdrop
        disableScrollLock={true}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "relative",
              maxWidth: 700,
              bgcolor: "background.paper",
              p: 4,
              mx: "auto",
              mt: 10,
              borderRadius: 2,
              boxShadow: 24,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* Nút đóng */}
            <IconButton
              onClick={() => setOpenModal(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" sx={{ mb: 3 }}>
              Chi tiết doanh số theo danh mục
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Button
                variant={period === "week" ? "contained" : "outlined"}
                onClick={() => setPeriod("week")}
              >
                Tuần
              </Button>
              <Button
                variant={period === "month" ? "contained" : "outlined"}
                onClick={() => setPeriod("month")}
              >
                Tháng
              </Button>
              <Button
                variant={period === "year" ? "contained" : "outlined"}
                onClick={() => setPeriod("year")}
              >
                Năm
              </Button>
            </Stack>

            {data.map((item) => {
              const { value, perf } = getValueByPeriod(item);
              return (
                <Box
                  key={item.id}
                  sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    src={`/images/categories/${item.image}`}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption">
                      {value.toLocaleString("vi-VN")} ₫
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center">
                    {getTrendIcon(perf)}
                    <Typography
                      variant="caption"
                      sx={{ color: getPerfColor(perf), fontWeight: 600 }}
                    >
                      {Math.abs(perf).toFixed(2)}%
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SalesByCategories;
