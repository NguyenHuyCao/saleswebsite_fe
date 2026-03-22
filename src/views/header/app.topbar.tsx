"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  Menu,
} from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationDropdown from "@/@core/layouts/components/shared-components/NotificationDropdown";
import { useToast } from "@/lib/toast/ToastContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CART_COUNT_KEY,
  WISHLIST_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";
import { mutate } from "swr";
import { http, toApiError } from "@/lib/api/http";
import { getAccessToken, clearAccessToken } from "@/lib/api/token";

const greetings = [
  "Chào mừng bạn đã đến với cửa hàng Cường Hoa",
  "Miễn phí giao hàng toàn quốc",
  "Ưu đãi hấp dẫn mỗi ngày!",
  "Hàng chính hãng - Giá cực tốt!",
];

const TopBar = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // mount-only: xác định client & trạng thái đăng nhập ban đầu
  useEffect(() => {
    setIsClient(true);
    setIsLoggedIn(!!getAccessToken());
  }, []);

  // xoay message
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Theo dõi token thay đổi giữa tabs / trong app
  useEffect(() => {
    const updateLoginState = () => setIsLoggedIn(!!getAccessToken());
    window.addEventListener("storage", updateLoginState);
    window.addEventListener("login", updateLoginState);
    window.addEventListener("logout", updateLoginState);
    return () => {
      window.removeEventListener("storage", updateLoginState);
      window.removeEventListener("login", updateLoginState);
      window.removeEventListener("logout", updateLoginState);
    };
  }, []);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as HTMLElement)) return;
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      // gọi qua Axios singleton (Authorization tự gắn từ localStorage)
      await http.post("/api/v1/auth/logout");
    } catch (e) {
      // Không chặn logout local nếu API lỗi
      console.warn("Logout failed:", toApiError(e).message);
    } finally {
      clearAccessToken();
      setIsLoggedIn(false);
      setOpen(false);
      // thông báo các nơi khác trong app
      window.dispatchEvent(new Event("logout"));
      showToast("Hẹn gặp lại bạn!", "info", "Đã đăng xuất");

      // Invalidate các counters phụ thuộc auth
      mutate(CART_COUNT_KEY);
      mutate(WISHLIST_COUNT_KEY);
      mutate(ORDERS_COUNT_KEY);

      router.push("/");
    }
  };

  return (
    <Container sx={{ position: "relative", zIndex: 1201 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.5,
          gap: 1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              sx={{
                color: "black",
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: 700,
                textAlign: "center",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {greetings[index]}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {isClient && isLoggedIn ? (
            <>
              <IconButton
                onClick={handleToggle}
                sx={{ color: "black", zIndex: 1301 }}
              >
                <AccountCircleIcon />
              </IconButton>

              <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                placement="bottom-start"
                style={{ zIndex: 1302 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper
                      sx={{
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <Menu
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          disableScrollLock
                          MenuListProps={{ autoFocusItem: open }}
                        >
                          <MenuItem
                            onClick={(e) => {
                              handleClose(e);
                              router.push("/account");
                            }}
                            sx={{ fontSize: 13 }}
                          >
                            Cập nhật thông tin
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              handleClose(e);
                              router.push("/change-password");
                            }}
                            sx={{ fontSize: 13 }}
                          >
                            Đổi mật khẩu
                          </MenuItem>
                          <MenuItem
                            onClick={handleLogout}
                            sx={{ fontSize: 13 }}
                          >
                            Đăng xuất
                          </MenuItem>
                        </Menu>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          ) : (
            isClient &&
            ["Đăng ký", "Đăng nhập"].map((label, idx) => (
              <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
                {idx > 0 && <Typography sx={{ mx: 0.2 }}>|</Typography>}
                <Button
                  sx={{
                    color: "black",
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "none",
                    px: 1,
                    minWidth: 0,
                    "&:hover": { color: "#f25c05", background: "#ffb700" },
                  }}
                  onClick={() =>
                    router.push(
                      `/login?page=${
                        label === "Đăng nhập" ? "login" : "register"
                      }`
                    )
                  }
                >
                  {label}
                </Button>
              </Box>
            ))
          )}

          {isClient && isLoggedIn && (
            <Box sx={{ color: "black" }}>
              <NotificationDropdown />
            </Box>
          )}

          <Typography sx={{ fontSize: "14px", fontWeight: 700, mx: 0.5 }}>
            Hotline:
          </Typography>

          <Box
            sx={{
              bgcolor: "#f25c05",
              px: 1,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              color: "black",
              fontSize: "14px",
              py: 0.5,
            }}
          >
            <LocalPhoneOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />
            <Typography fontWeight="bold" ml={0.5}>
              0392923392
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TopBar;
