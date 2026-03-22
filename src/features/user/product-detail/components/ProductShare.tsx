"use client";

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useToast } from "@/lib/toast/ToastContext";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";

interface Props {
  product: Product;
}

export default function ProductShare({ product }: Props) {
  const { showToast } = useToast();
  const productUrl = `${window.location.origin}/product/detail?name=${product.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    showToast("Đã sao chép link sản phẩm!", "success", "Chia sẻ");
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      "_blank",
    );
  };

  const shareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.name)}`,
      "_blank",
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${productUrl}`)}`,
      "_blank",
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box
        sx={{
          p: 2,
          border: "1px solid #eee",
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <ShareIcon color="primary" />
          <Typography variant="body1" fontWeight={600}>
            Chia sẻ sản phẩm
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

      </Box>
    </motion.div>
  );
}
