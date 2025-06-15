"use client";

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import MainCard from "@/components/dashboard/MainCard";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Image from "next/image";

interface Transaction {
  profitPercent: number;
  orderId: number;
  paidAt: string;
  paidAmount: number;
  customer: {
    name: string;
    email: string;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const TransactionHistoryCard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/transaction-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (json.status === 200) {
          setTransactions(json.data.slice(0, 7));
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box>
      <MainCard
        title="Lịch sử giao dịch"
        content={false}
        sx={{ border: "none", boxShadow: "none" }}
      >
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
            maxHeight: 370,
            overflowY: "auto",
            "& .MuiListItemButton-root": {
              py: 1.5,
              px: 2,
            },
            // Scrollbar customization
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a0a0a0",
            },
          }}
        >
          {transactions.map((item) => (
            <ListItem component={ListItemButton} divider key={item.orderId}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: "success.main",
                    bgcolor: "success.lighter",
                  }}
                >
                  <PaidOutlinedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    Đơn hàng #{item.orderId} - {item.customer.name}
                  </Typography>
                }
                secondary={new Date(item.paidAt).toLocaleString("vi-VN")}
              />
              <Stack sx={{ alignItems: "flex-end" }}>
                <Typography variant="subtitle1" noWrap>
                  {formatCurrency(item.paidAmount)}
                </Typography>
                <Typography variant="caption" color="secondary" noWrap>
                  {item.profitPercent.toFixed(2)}%
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </MainCard>
      <MainCard sx={{ mt: 2, border: "none", boxShadow: "none" }}>
        <Stack sx={{ gap: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Stack>
                <Typography variant="h5" noWrap>
                  Hỗ trợ & Trò chuyện
                </Typography>
                <Typography variant="caption" color="secondary" noWrap>
                  Thường phản hồi trong vòng 5 phút
                </Typography>
              </Stack>
            </Grid>
            <Grid>
              <AvatarGroup
                sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
              >
                {[1, 2, 3, 4].map((num) => (
                  <Avatar key={num}>
                    <Image
                      src={`/images/avatars/${num}.png`}
                      alt={`Avatar ${num}`}
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%" }}
                    />
                  </Avatar>
                ))}
              </AvatarGroup>
            </Grid>
          </Grid>
          <Button
            size="small"
            variant="contained"
            sx={{ textTransform: "capitalize" }}
          >
            Cần hỗ trợ?
          </Button>
        </Stack>
      </MainCard>
    </Box>
  );
};

export default TransactionHistoryCard;
