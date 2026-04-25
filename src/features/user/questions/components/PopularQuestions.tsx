"use client";

import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const popularQuestions = [
  { q: "Chính sách đổi trả như thế nào?", views: 1240 },
  { q: "Thời gian giao hàng mất bao lâu?", views: 987 },
  { q: "Cường Hoa chấp nhận thanh toán gì?", views: 856 },
  { q: "Sản phẩm có bảo hành không?", views: 743 },
  { q: "Có hỗ trợ trả góp không?", views: 654 },
  { q: "Cửa hàng ở đâu, giờ mở cửa thế nào?", views: 531 },
];

interface Props {
  onQuestionClick: (q: string) => void;
}

export default function PopularQuestions({ onQuestionClick }: Props) {
  const handleClick = (q: string) => {
    onQuestionClick(q);
    setTimeout(() => {
      document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <TrendingUpIcon sx={{ color: "#f25c05" }} />
          <Typography variant="h6" fontWeight={700}>
            Câu hỏi phổ biến
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhấn để tìm kiếm ngay trong danh sách FAQ
        </Typography>

        <List disablePadding>
          {popularQuestions.map((item, idx) => (
            <ListItemButton
              key={idx}
              onClick={() => handleClick(item.q.split(" ").slice(0, 4).join(" "))}
              sx={{
                px: 0,
                py: 1.25,
                borderBottom: idx < popularQuestions.length - 1 ? "1px solid #f5f5f5" : "none",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "#fff8f0",
                  "& .arrow-icon": { opacity: 1, transform: "translateX(4px)" },
                },
                transition: "background 0.2s",
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <QuestionAnswerIcon sx={{ color: "#ffb700", fontSize: 18 }} />
              </ListItemIcon>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500} lineHeight={1.4}>
                  {item.q}
                </Typography>
                <Chip
                  label={`${item.views.toLocaleString()} lượt xem`}
                  size="small"
                  sx={{ fontSize: "0.65rem", height: 18, bgcolor: "#f5f5f5", mt: 0.5 }}
                />
              </Box>

              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: 16,
                  color: "#f25c05",
                  opacity: 0,
                  transition: "all 0.2s",
                  flexShrink: 0,
                  ml: 1,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </motion.div>
  );
}
