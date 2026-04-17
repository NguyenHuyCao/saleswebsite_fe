"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
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
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import MainCard from "./components/MainCard";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Image from "next/image";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

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
    value || 0,
  );

interface Props {
  onOpenSupport?: () => void;
  pendingSupportCount?: number;
}

const TransactionHistoryCard = ({
  onOpenSupport,
  pendingSupportCount = 0,
}: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await api.get<Transaction[]>(
          "/api/v1/dashboard/overview/transaction-history",
          { signal: controller.signal },
        );
        setTransactions(Array.isArray(data) ? data.slice(0, 7) : []);
      } catch (err) {
        // Sử dụng helper - nếu là CanceledError sẽ tự động bỏ qua, không log
        logIfNotCanceled(err, "Lỗi khi tải transaction-history:");
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
        <Stack sx={{ gap: 2.5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Stack spacing={0.3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <HeadsetMicIcon color="primary" fontSize="small" />
                  <Typography variant="h5" noWrap>
                    Hỗ trợ & Trò chuyện
                  </Typography>
                </Stack>
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
          <Badge
            badgeContent={pendingSupportCount}
            color="error"
            sx={{
              width: "100%",
              "& .MuiBadge-badge": { top: 8, right: 8, fontSize: 11 },
            }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<HeadsetMicIcon />}
              onClick={() => onOpenSupport?.()}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                background: "linear-gradient(135deg, #1976d2, #1565c0)",
                boxShadow: "0 4px 12px rgba(25,118,210,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1565c0, #0d47a1)",
                  boxShadow: "0 6px 16px rgba(25,118,210,0.45)",
                },
              }}
            >
              {pendingSupportCount > 0
                ? `Mở hộp thư hỗ trợ (${pendingSupportCount} mới)`
                : "Mở hộp thư hỗ trợ"}
            </Button>
          </Badge>
        </Stack>
      </MainCard>
    </Box>
  );
};

export default TransactionHistoryCard;
