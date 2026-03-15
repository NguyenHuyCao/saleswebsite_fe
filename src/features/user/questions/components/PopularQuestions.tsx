// questions/components/PopularQuestions.tsx
"use client";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const popularQuestions = [
  {
    q: "Làm thế nào để đăng ký thành viên?",
    views: 1234,
  },
  {
    q: "Chính sách đổi trả như thế nào?",
    views: 987,
  },
  {
    q: "Thời gian giao hàng bao lâu?",
    views: 856,
  },
  {
    q: "Có hỗ trợ trả góp không?",
    views: 654,
  },
  {
    q: "Cách kiểm tra bảo hành sản phẩm",
    views: 543,
  },
];

export default function PopularQuestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <TrendingUpIcon sx={{ color: "#f25c05" }} />
          <Typography variant="h6" fontWeight={700}>
            Câu hỏi phổ biến
          </Typography>
        </Stack>

        <List>
          {popularQuestions.map((item, idx) => (
            <ListItem
              key={idx}
              sx={{
                px: 0,
                py: 1.5,
                borderBottom:
                  idx < popularQuestions.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <QuestionAnswerIcon sx={{ color: "#ffb700", fontSize: 20 }} />
              </ListItemIcon>

              {/* FIX: Không dùng secondary prop, tự render content */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                  {item.q}
                </Typography>

                <Chip
                  label={`${item.views} lượt xem`}
                  size="small"
                  sx={{
                    fontSize: "0.6rem",
                    height: 18,
                    bgcolor: "#f5f5f5",
                  }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </motion.div>
  );
}
