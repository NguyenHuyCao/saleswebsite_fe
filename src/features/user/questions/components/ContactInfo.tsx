// questions/components/ContactInfo.tsx
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
import ChatIcon from "@mui/icons-material/Chat";
import FacebookIcon from "@mui/icons-material/Facebook";
import { motion } from "framer-motion";

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Thông tin liên hệ
        </Typography>

        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#f25c05" }}>
              <PhoneIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Hotline
              </Typography>
              <Typography fontWeight={600} component="a" href="tel:0392923392">
                1900 6750
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                24/7 hỗ trợ khách hàng
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#f25c05" }}>
              <EmailIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography
                fontWeight={600}
                component="a"
                href="mailto:support@cuonghoa.vn"
              >
                support@cuonghoa.vn
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Phản hồi trong 24h
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#f25c05" }}>
              <ChatIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Live Chat
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: "#ffb700",
                  color: "#000",
                  "&:hover": { bgcolor: "#f59e0b" },
                }}
              >
                Bắt đầu chat ngay
              </Button>
            </Box>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              href="https://www.facebook.com/messages/e2ee/t/9200105130025225"
              target="_blank"
              sx={{ borderColor: "#ffb700", color: "#f25c05" }}
            >
              Facebook
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
}
