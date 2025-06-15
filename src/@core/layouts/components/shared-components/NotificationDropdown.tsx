"use client";

import { useState, SyntheticEvent, ReactNode, Fragment } from "react";
import {
  Box,
  Chip,
  Button,
  IconButton,
  useMediaQuery,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Avatar as MuiAvatar,
  Typography,
  styled,
  Theme,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import BellOutline from "mdi-material-ui/BellOutline";
import Image from "next/image";

// Styled components
const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    width: 380,
    overflow: "hidden",
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Avatar = styled(MuiAvatar)({
  width: "2.375rem",
  height: "2.375rem",
  fontSize: "1.125rem",
});

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const MenuItemSubtitle = styled(Typography)({
  flex: "1 1 100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const ScrollWrapper = ({
  children,
  hidden,
}: {
  children: ReactNode;
  hidden: boolean;
}) => {
  const styles = {
    maxHeight: 349,
    "& .MuiMenuItem-root:last-of-type": { border: 0 },
  };

  return hidden ? (
    <Box sx={{ ...styles, overflowY: "auto", overflowX: "hidden" }}>
      {children}
    </Box>
  ) : (
    <PerfectScrollbar
      options={{ wheelPropagation: false, suppressScrollX: true }}
    >
      <Box sx={styles}>{children}</Box>
    </PerfectScrollbar>
  );
};

// Sample mock notifications (can replace with API data later)
const notifications = [
  {
    id: 1,
    avatar: "/images/avatars/4.png",
    title: "Congratulation Flora! 🎉",
    subtitle: "Won the monthly best seller badge",
    time: "Today",
  },
  {
    id: 2,
    avatarText: "VU",
    title: "New user registered.",
    subtitle: "5 hours ago",
    time: "Yesterday",
    bgColor: "primary.main",
  },
  {
    id: 3,
    avatar: "/images/avatars/5.png",
    title: "New message received 👋🏻",
    subtitle: "You have 10 unread messages",
    time: "11 Aug",
  },
  {
    id: 4,
    image: "/images/misc/paypal.png",
    title: "Paypal",
    subtitle: "Received Payment",
    time: "25 May",
  },
  {
    id: 5,
    avatar: "/images/avatars/3.png",
    title: "Revised Order 📦",
    subtitle: "New order revised from john",
    time: "19 Mar",
  },
  {
    id: 6,
    image: "/images/misc/chart.png",
    title: "Finance report has been generated",
    subtitle: "25 hrs ago",
    time: "27 Dec",
  },
];

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const open = Boolean(anchorEl);

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        color="inherit"
        aria-haspopup="true"
        onClick={handleOpen}
        aria-controls="customized-menu"
        aria-expanded={open ? "true" : undefined}
        aria-label="Open notifications"
      >
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disableRipple>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Chip
              size="small"
              label="8 New"
              color="primary"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "10px",
              }}
            />
          </Box>
        </MenuItem>

        <ScrollWrapper hidden={hidden}>
          {notifications.map((noti) => (
            <MenuItem key={noti.id} onClick={handleClose}>
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                {noti.image ? (
                  <Image
                    src={noti.image}
                    width={38}
                    height={38}
                    alt={noti.title}
                  />
                ) : noti.avatar ? (
                  <Avatar alt={noti.title} src={noti.avatar} />
                ) : (
                  <Avatar
                    sx={{
                      backgroundColor: noti.bgColor || "grey.500",
                      color: "common.white",
                    }}
                  >
                    {noti.avatarText}
                  </Avatar>
                )}
                <Box
                  sx={{
                    mx: 4,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <MenuItemTitle>{noti.title}</MenuItemTitle>
                  <MenuItemSubtitle variant="body2">
                    {noti.subtitle}
                  </MenuItemSubtitle>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  {noti.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>

        <MenuItem
          disableRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button fullWidth variant="contained" onClick={handleClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
