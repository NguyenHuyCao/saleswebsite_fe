"use client";

import { useState, useEffect, SyntheticEvent, Fragment } from "react";
import {
  Box,
  IconButton,
  Typography,
  Popover,
  Divider,
  Button,
  Badge,
  Tooltip,
  Chip,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useSocket } from "@/lib/socket/SocketContext";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

type TypeConfig = {
  Icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
};

const TYPE_MAP: Record<string, TypeConfig> = {
  ORDER:     { Icon: ShoppingBagIcon,  color: "#f25c05", bg: "#fff3e0", label: "Đơn hàng" },
  PAYMENT:   { Icon: PaymentsIcon,     color: "#2e7d32", bg: "#e8f5e9", label: "Thanh toán" },
  PROMOTION: { Icon: LocalOfferIcon,   color: "#ffb700", bg: "#fff8e1", label: "Khuyến mãi" },
  CART:      { Icon: ShoppingCartIcon, color: "#1976d2", bg: "#e3f2fd", label: "Giỏ hàng" },
  SYSTEM:    { Icon: InfoOutlinedIcon, color: "#6c5dd3", bg: "#f3f0ff", label: "Hệ thống" },
};

const getTypeConfig = (type: string): TypeConfig => {
  if (!type) return TYPE_MAP.SYSTEM;
  if (type.startsWith("ORDER"))     return TYPE_MAP.ORDER;
  if (type.startsWith("PAYMENT"))   return TYPE_MAP.PAYMENT;
  if (type.startsWith("PROMOTION")) return TYPE_MAP.PROMOTION;
  if (type.includes("CART"))        return TYPE_MAP.CART;
  return TYPE_MAP.SYSTEM;
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  if (isYesterday(date)) return "Hôm qua";
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { notifications, unreadCount, markRead, markAllRead, refresh } = useSocket();

  const handleOpen = (e: SyntheticEvent) => {
    setAnchorEl(e.currentTarget as HTMLElement);
    refresh();
  };

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => handleClose();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Thông báo" arrow>
        <IconButton
          onClick={handleOpen}
          aria-label="Thông báo"
          sx={{
            color: "inherit",
            p: 1,
            borderRadius: 2,
            transition: "background 0.2s",
            "&:hover": { bgcolor: "rgba(242,92,5,0.08)" },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            max={99}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#f25c05",
                color: "#fff",
                fontSize: "0.58rem",
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                p: "0 4px",
                boxShadow: "0 0 0 2px #fff",
              },
            }}
          >
            <motion.div
              animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount > 0 ? (
                <NotificationsActiveIcon sx={{ fontSize: 24, color: "#f25c05" }} />
              ) : (
                <NotificationsNoneIcon sx={{ fontSize: 24 }} />
              )}
            </motion.div>
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: { xs: 320, sm: 380 },
              borderRadius: 3,
              boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
              border: "1px solid rgba(0,0,0,0.07)",
              overflow: "hidden",
              bgcolor: "#fff",
            },
          },
        }}
      >
        {/* Orange accent top bar */}
        <Box sx={{ height: 3, background: "linear-gradient(90deg, #f25c05, #ffb700)" }} />

        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "#fff3e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsNoneIcon sx={{ color: "#f25c05", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a", lineHeight: 1.2 }}>
                Thông báo
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#999" }}>
                {notifications.length} thông báo
              </Typography>
            </Box>
          </Box>

          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} chưa đọc`}
              size="small"
              sx={{
                bgcolor: "#fff3e0",
                color: "#f25c05",
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 22,
                border: "1px solid rgba(242,92,5,0.2)",
              }}
            />
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />

        {/* List */}
        {notifications.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", bgcolor: "#fafafa" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 28, color: "#ccc" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, color: "#999", fontSize: "0.85rem" }}>
              Không có thông báo nào
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#bbb", mt: 0.5 }}>
              Chúng tôi sẽ thông báo khi có cập nhật mới
            </Typography>
          </Box>
        ) : (
          <Box
            onWheel={(e) => e.stopPropagation()}
            sx={{
              maxHeight: 380,
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              bgcolor: "#fff",
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#f25c05", borderRadius: 4, opacity: 0.5 },
            }}
          >
            <AnimatePresence initial={false}>
              {notifications.map((noti, idx) => {
                const cfg = getTypeConfig(noti.type);
                const IconComp = cfg.Icon;

                return (
                  <motion.div
                    key={noti.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                  >
                    <Box
                      onClick={() => markRead(noti.id)}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        px: 2.5,
                        py: 1.5,
                        cursor: "pointer",
                        position: "relative",
                        bgcolor: noti.read ? "#fff" : "rgba(242,92,5,0.035)",
                        borderLeft: "3px solid",
                        borderLeftColor: noti.read ? "transparent" : "#f25c05",
                        transition: "background 0.15s",
                        "&:hover": {
                          bgcolor: noti.read ? "#fafafa" : "rgba(242,92,5,0.06)",
                        },
                      }}
                    >
                      {/* Type icon */}
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 2,
                          bgcolor: cfg.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <IconComp sx={{ color: cfg.color, fontSize: 19 }} />
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.3 }}>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: noti.read ? 500 : 700,
                              color: noti.read ? "#444" : "#1a1a1a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {noti.title}
                          </Typography>
                          {!noti.read && (
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: "#f25c05",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "0.76rem",
                            color: "#777",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.45,
                            mb: 0.5,
                          }}
                        >
                          {noti.content}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Box
                            sx={{
                              px: 0.75,
                              py: 0.1,
                              borderRadius: 0.75,
                              bgcolor: cfg.bg,
                              display: "inline-block",
                            }}
                          >
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 600, color: cfg.color }}>
                              {cfg.label}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: "0.68rem", color: "#bbb" }}>
                            {formatTime(noti.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {idx < notifications.length - 1 && (
                      <Divider sx={{ borderColor: "rgba(0,0,0,0.05)", ml: 7 }} />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Box>
        )}

        {/* Footer */}
        <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#fafafa" }}>
          <Button
            fullWidth
            disabled={unreadCount === 0}
            onClick={() => { markAllRead(); handleClose(); }}
            startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderRadius: 2,
              py: 0.9,
              bgcolor: unreadCount > 0 ? "#fff3e0" : "transparent",
              color: unreadCount > 0 ? "#f25c05" : "#ccc",
              border: "1px solid",
              borderColor: unreadCount > 0 ? "rgba(242,92,5,0.2)" : "rgba(0,0,0,0.08)",
              "&:hover": {
                bgcolor: unreadCount > 0 ? "#ffe0b2" : "transparent",
                borderColor: unreadCount > 0 ? "#f25c05" : "rgba(0,0,0,0.08)",
              },
              "&:disabled": {
                color: "#ccc",
                border: "1px solid rgba(0,0,0,0.06)",
              },
              transition: "all 0.2s",
            }}
          >
            {unreadCount > 0 ? `Đánh dấu ${unreadCount} thông báo đã đọc` : "Tất cả đã được đọc"}
          </Button>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default NotificationDropdown;
