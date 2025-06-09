"use client";

import Image from "next/image";
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
import GiftOutlined from "@mui/icons-material/CardGiftcardOutlined";
import MessageOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import MainCard from "@/components/dashboard/MainCard";

const transactionData = [
  {
    id: "#002434",
    icon: <GiftOutlined />,
    color: "success",
    amount: "+ 1.430$",
    time: "Hôm nay, 2:00 sáng",
    percent: "78%",
  },
  {
    id: "#984947",
    icon: <MessageOutlined />,
    color: "primary",
    amount: "+ 302$",
    time: "5 Tháng 8, 1:45 chiều",
    percent: "8%",
  },
  {
    id: "#988784",
    icon: <SettingsOutlined />,
    color: "error",
    amount: "+ 682$",
    time: "7 giờ trước",
    percent: "16%",
  },
  {
    id: "#778452",
    icon: <GiftOutlined />,
    color: "warning",
    amount: "+ 200$",
    time: "Hôm qua, 11:00 sáng",
    percent: "5%",
  },
  {
    id: "#654321",
    icon: <SettingsOutlined />,
    color: "info",
    amount: "+ 950$",
    time: "2 ngày trước",
    percent: "21%",
  },
];

const TransactionHistoryCard = () => {
  return (
    <Box>
      <MainCard
        title="Lịch sử giao dịch"
        sx={{ mb: 2, borderColor: "common.white" }}
        content={false}
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
          }}
        >
          {transactionData.map((item, index) => (
            <ListItem component={ListItemButton} divider key={index}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: `${item.color}.main`,
                    bgcolor: `${item.color}.lighter`,
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    Đơn hàng {item.id}
                  </Typography>
                }
                secondary={item.time}
              />
              <Stack sx={{ alignItems: "flex-end" }}>
                <Typography variant="subtitle1" noWrap>
                  {item.amount}
                </Typography>
                <Typography variant="h6" color="secondary" noWrap>
                  {item.percent}
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </MainCard>

      <MainCard sx={{ mt: 2, borderColor: "common.white" }}>
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
