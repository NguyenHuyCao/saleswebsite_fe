"use client";

import { useEffect, useState } from "react";
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
import MainCard from "@/components/dashboard/MainCard";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Image from "next/image";
import { api, toApiError } from "@/lib/api/http";

interface Transaction {
  profitPercent: number;
  orderId: number;
  paidAt: string; // ISO
  paidAmount: number;
  customer: {
    name: string;
    email: string;
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value || 0
  );

const TransactionHistoryCard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        // Gọi qua Axios instance đã tự gắn Authorization từ localStorage
        const data = await api.get<Transaction[]>(
          "/api/v1/dashboard/overview/transaction-history",
          { signal: controller.signal }
        );
        setTransactions(Array.isArray(data) ? data.slice(0, 7) : []);
      } catch (e) {
        if ((e as any)?.name === "CanceledError") return;
        const err = toApiError(e);
        console.warn("Lỗi khi tải transaction-history:", err.message);
        setTransactions([]);
      }
    })();

    return () => controller.abort();
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
            "& .MuiListItemButton-root": { py: 1.5, px: 2 },
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#a0a0a0" },
          }}
        >
          {transactions.map((item) => (
            <ListItem component={ListItemButton} divider key={item.orderId}>
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "success.main", bgcolor: "success.lighter" }}
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
                  {Number(item.profitPercent ?? 0).toFixed(2)}%
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
