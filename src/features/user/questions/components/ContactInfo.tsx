"use client";

import {
  Paper,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  Box,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { motion } from "framer-motion";

const contactItems = [
  {
    icon: <PhoneIcon />,
    label: "Hotline",
    value: "0392 923 392",
    sub: "7:00 – 18:00 mỗi ngày",
    href: "tel:0392923392",
  },
  {
    icon: <EmailIcon />,
    label: "Email",
    value: "support@cuonghoa.vn",
    sub: "Phản hồi trong 24h",
    href: "mailto:support@cuonghoa.vn",
  },
  {
    icon: <AccessTimeIcon />,
    label: "Giờ làm việc",
    value: "T2–T7: 7:00–18:00",
    sub: "Chủ nhật: 7:00–17:00",
    href: null,
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Liên hệ hỗ trợ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Đội ngũ Cường Hoa luôn sẵn sàng giải đáp mọi thắc mắc của bạn
        </Typography>

        <Stack spacing={2.5}>
          {contactItems.map((item) => (
            <Stack key={item.label} direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: "#f25c05", width: 40, height: 40, flexShrink: 0 }}>
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {item.label}
                </Typography>
                {item.href ? (
                  <Typography
                    fontWeight={600}
                    component="a"
                    href={item.href}
                    sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: "#f25c05" } }}
                  >
                    {item.value}
                  </Typography>
                ) : (
                  <Typography fontWeight={600}>{item.value}</Typography>
                )}
                <Typography variant="caption" color="text.secondary" display="block">
                  {item.sub}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" fontWeight={600} gutterBottom>
          Kênh hỗ trợ trực tuyến
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FacebookIcon />}
            href="https://www.facebook.com/messages/e2ee/t/9200105130025225"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ borderColor: "#1877F2", color: "#1877F2", "&:hover": { borderColor: "#1877F2", bgcolor: "#e8f0fe" } }}
          >
            Messenger
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChatBubbleOutlineIcon />}
            href="https://zalo.me/0392923392"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ borderColor: "#0068FF", color: "#0068FF", "&:hover": { borderColor: "#0068FF", bgcolor: "#e6f0ff" } }}
          >
            Zalo
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
}
