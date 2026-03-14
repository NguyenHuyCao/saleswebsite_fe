"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Tab,
  Tabs,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqList: FAQ[] = [
  {
    question: "Làm thế nào để đặt hàng?",
    answer:
      "Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ hotline 0909 123 456 để được hỗ trợ nhanh chóng.",
    category: "Đặt hàng",
  },
  {
    question: "Chính sách bảo hành như thế nào?",
    answer:
      "Tất cả sản phẩm đều được bảo hành chính hãng trong 12 tháng kể từ ngày mua. Bảo hành tại tất cả các cửa hàng của DolaTool.",
    category: "Bảo hành",
  },
  {
    question: "Tôi có thể xem sản phẩm trực tiếp ở đâu?",
    answer:
      "Đến showroom tại Bắc Giang (7FGV+PM Lục Nam District) để trải nghiệm sản phẩm thực tế. Chúng tôi có đầy đủ các dòng máy cho bạn test thử.",
    category: "Sản phẩm",
  },
  {
    question: "Thời gian giao hàng là bao lâu?",
    answer:
      "1–3 ngày với nội thành, 3–5 ngày với tỉnh xa. Miễn phí vận chuyển cho đơn hàng trên 3 triệu.",
    category: "Giao hàng",
  },
  {
    question: "Có hỗ trợ kỹ thuật sau mua không?",
    answer:
      "Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ suốt vòng đời sản phẩm qua hotline hoặc trực tiếp tại cửa hàng.",
    category: "Hỗ trợ",
  },
  {
    question: "Thanh toán bằng những hình thức nào?",
    answer:
      "Chấp nhận tiền mặt, chuyển khoản, thẻ tín dụng và các ví điện tử như Momo, ZaloPay.",
    category: "Thanh toán",
  },
];

const categories = ["Tất cả", ...new Set(faqList.map((faq) => faq.category))];

export default function QuickHelpSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return faqList.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      const matchesCategory =
        category === "Tất cả" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [keyword, category]);

  return (
    <Box px={{ xs: 2, md: 4 }} py={6} bgcolor="#fff" id="quick-help">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
            Câu hỏi thường gặp
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến
          </Typography>
        </Box>

        {/* Search */}
        <Box maxWidth={600} mx="auto" mb={3}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Tìm kiếm câu hỏi..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 },
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Tabs
          value={category}
          onChange={(_, value) => setCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 4,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
            "& .Mui-selected": {
              color: "#f25c05",
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>

        {/* FAQ List */}
        <Box maxWidth={800} mx="auto">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={expandedIndex === index ? 3 : 1}
                    sx={{
                      mb: 1.5,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Accordion
                      expanded={expandedIndex === index}
                      onChange={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                      sx={{
                        boxShadow: "none",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#f25c05" }} />
                        }
                        sx={{
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                            gap: 2,
                          },
                        }}
                      >
                        <HelpOutlineIcon
                          sx={{ color: "#f25c05", fontSize: 20 }}
                        />
                        <Typography fontWeight={600}>
                          {item.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography color="text.secondary" sx={{ pl: 4 }}>
                          {item.answer}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          sx={{ mt: 2 }}
                        >
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{ bgcolor: "#f5f5f5" }}
                          />
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </motion.div>
              ))
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Không tìm thấy câu hỏi phù hợp.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vui lòng liên hệ trực tiếp để được hỗ trợ.
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  );
}
