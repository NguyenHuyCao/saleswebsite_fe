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
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useSocket } from "@/lib/socket/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const TYPE_CONFIG = {
  ORDER:     { label: "ĐH", color: "#fff", bg: "#f25c05" },
  PAYMENT:   { label: "TT", color: "#fff", bg: "#ffb700" },
  PROMOTION: { label: "KM", color: "#fff", bg: "#2e7d32" },
  SYSTEM:    { label: "HT", color: "#fff", bg: "#555"    },
};

const getTypeConfig = (type: string) => {
  if (!type) return { label: "N", color: "#fff", bg: "#888" };
  if (type.startsWith("ORDER"))     return TYPE_CONFIG.ORDER;
  if (type.startsWith("PAYMENT"))   return TYPE_CONFIG.PAYMENT;
  if (type.startsWith("PROMOTION")) return TYPE_CONFIG.PROMOTION;
  return TYPE_CONFIG.SYSTEM;
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
    // Blur active element trước khi close để ngăn browser scroll trigger vào view
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setAnchorEl(null);
  };

  const handleMarkRead = (id: number) => {
    markRead(id);
  };

  const handleMarkAll = () => {
    markAllRead();
    handleClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => handleClose();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <Fragment>
      <IconButton
        onClick={handleOpen}
        aria-label="Thông báo"
        sx={{ color: "inherit", p: 0.5 }}
      >
        <Badge
          badgeContent={unreadCount}
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#f25c05",
              color: "#fff",
              fontSize: "0.6rem",
              minWidth: 16,
              height: 16,
              p: "0 4px",
            },
          }}
        >
          <NotificationsNoneIcon sx={{ fontSize: 22 }} />
        </Badge>
      </IconButton>

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
              mt: 1,
              width: 360,
              borderRadius: 2,
              border: "2px solid #ffb700",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              overflow: "hidden",
              bgcolor: "#fff",
              color: "#111",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsNoneIcon sx={{ color: "#ffb700", fontSize: 20 }} />
            <Typography
              sx={{ color: "#ffb700", fontWeight: 700, fontSize: "0.95rem" }}
            >
              Thông báo
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Box
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                borderRadius: "12px",
                px: 1,
                py: 0.1,
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {unreadCount} mới
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#ffb700" }} />

        {/* List */}
        {notifications.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              bgcolor: "#fafafa",
            }}
          >
            <NotificationsNoneIcon
              sx={{ fontSize: 40, color: "#ccc", mb: 1 }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#999", fontSize: "0.85rem" }}
            >
              Không có thông báo nào
            </Typography>
          </Box>
        ) : (
          <Box
            onWheel={(e) => e.stopPropagation()}
            sx={{
              maxHeight: 360,
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              bgcolor: "#fff",
              // Custom scrollbar
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { bgcolor: "#f5f5f5" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#ffb700",
                borderRadius: 2,
              },
              "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#f25c05" },
            }}
          >
            {notifications.map((noti, idx) => {
              const cfg = getTypeConfig(noti.type);
              return (
                <Box key={noti.id}>
                  <Box
                    onClick={() => handleMarkRead(noti.id)}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      bgcolor: noti.read ? "#fff" : "#fffbf0",
                      borderLeft: noti.read
                        ? "3px solid transparent"
                        : "3px solid #ffb700",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#fff8e1" },
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: cfg.bg,
                        color: cfg.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        flexShrink: 0,
                      }}
                    >
                      {cfg.label}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      <Typography
                        sx={{
                          fontSize: "0.83rem",
                          fontWeight: noti.read ? 500 : 700,
                          color: "#111",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {noti.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: "#555",
                          mt: 0.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {noti.content}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: "#aaa",
                          mt: 0.4,
                        }}
                      >
                        {formatDistanceToNow(new Date(noti.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Typography>
                    </Box>

                    {/* Unread dot */}
                    {!noti.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#f25c05",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                  {idx < notifications.length - 1 && (
                    <Divider sx={{ borderColor: "#f5f5f5" }} />
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Footer */}
        <Divider sx={{ borderColor: "#eee" }} />
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#fafafa" }}>
          <Button
            fullWidth
            disabled={unreadCount === 0}
            onClick={handleMarkAll}
            sx={{
              bgcolor: unreadCount > 0 ? "#000" : "#e0e0e0",
              color: unreadCount > 0 ? "#ffb700" : "#aaa",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderRadius: 1,
              textTransform: "none",
              py: 0.8,
              "&:hover": {
                bgcolor: unreadCount > 0 ? "#f25c05" : "#e0e0e0",
                color: unreadCount > 0 ? "#fff" : "#aaa",
              },
            }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default NotificationDropdown;
