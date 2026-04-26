// wishlist/components/WishlistShareModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import { useWishlist } from "../queries";

interface WishlistShareModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WishlistShareModal({
  open,
  onClose,
}: WishlistShareModalProps) {
  const { data: items = [] } = useWishlist();
  const [copied, setCopied] = useState(false);

  const getShareUrl = () =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/wishlist/shared/${Date.now()}`;
  const shareText = `Mình có ${items.length} sản phẩm yêu thích tại DolaTool. Xem ngay:`;

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
      "_blank",
    );
  };

  const handleShareEmail = () => {
    const url = getShareUrl();
    window.location.href = `mailto:?subject=Danh sách yêu thích tại DolaTool&body=${encodeURIComponent(
      shareText + "\n" + url,
    )}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Chia sẻ danh sách yêu thích</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {copied && (
            <Alert severity="success">
              <AlertTitle>Đã sao chép!</AlertTitle>
              Link đã được copy vào clipboard
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Chia sẻ danh sách {items.length} sản phẩm yêu thích của bạn với bạn
            bè
          </Typography>

          <TextField
            label="Link chia sẻ"
            value={getShareUrl()}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <Button
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyLink}
                    sx={{ textTransform: "none" }}
                  >
                    Copy
                  </Button>
                ),
                },
            }}
          />

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleShareFacebook}
              sx={{ borderColor: "#1877f2", color: "#1877f2" }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleShareEmail}
              sx={{ borderColor: "#f25c05", color: "#f25c05" }}
            >
              Email
            </Button>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
