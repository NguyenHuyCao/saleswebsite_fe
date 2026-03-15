// features/user/new/components/NewsShare.tsx
"use client";

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { NewsPost } from "../types";

interface Props {
  post: NewsPost;
}

export default function NewsShare({ post }: Props) {
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: "Đã sao chép link bài viết!" });
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
      "_blank",
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${post.title} - ${url}`)}`,
      "_blank",
    );
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, my: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ShareIcon sx={{ color: "#f25c05" }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Chia sẻ bài viết
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Chia sẻ Facebook">
            <IconButton
              onClick={shareOnFacebook}
              sx={{
                bgcolor: "#1877f2",
                color: "#fff",
                "&:hover": { bgcolor: "#166fe5" },
              }}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chia sẻ Telegram">
            <IconButton
              onClick={shareOnTelegram}
              sx={{
                bgcolor: "#26A5E4",
                color: "#fff",
                "&:hover": { bgcolor: "#229ed9" },
              }}
            >
              <TelegramIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chia sẻ WhatsApp">
            <IconButton
              onClick={shareOnWhatsApp}
              sx={{
                bgcolor: "#25D366",
                color: "#fff",
                "&:hover": { bgcolor: "#20bd59" },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sao chép link">
            <IconButton
              onClick={handleCopyLink}
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                "&:hover": { bgcolor: "#e64a19" },
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}
