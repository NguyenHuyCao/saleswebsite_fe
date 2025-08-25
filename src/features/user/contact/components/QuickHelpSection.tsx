"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";

const faqList = [
  {
    question: "Làm thế nào để đặt hàng?",
    answer:
      "Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ hotline để được hỗ trợ nhanh chóng.",
  },
  {
    question: "Chính sách bảo hành như thế nào?",
    answer:
      "Tất cả sản phẩm đều được bảo hành chính hãng trong 12 tháng kể từ ngày mua.",
  },
  {
    question: "Tôi có thể xem sản phẩm trực tiếp ở đâu?",
    answer: "Đến showroom tại Bắc Giang để trải nghiệm sản phẩm thực tế.",
  },
  {
    question: "Thời gian giao hàng là bao lâu?",
    answer: "1–5 ngày tùy khu vực; nội thành có thể trong ngày.",
  },
  {
    question: "Có hỗ trợ kỹ thuật sau mua không?",
    answer: "Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ suốt vòng đời sản phẩm.",
  },
];

export default function QuickHelpSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return faqList.filter((item) => item.question.toLowerCase().includes(q));
  }, [keyword]);

  return (
    <Box px={{ xs: 2, md: 4 }} py={6} bgcolor="#fff">
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="primary"
      >
        HỖ TRỢ NHANH
      </Typography>

      <Box maxWidth={600} mx="auto" mb={4}>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm câu hỏi..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box maxWidth={800} mx="auto">
        <AnimatePresence initial={false}>
          {filtered.length ? (
            filtered.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Accordion
                  expanded={expandedIndex === index}
                  onChange={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  sx={{ mb: 1, borderRadius: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Typography>{item.answer}</Typography>
                    </motion.div>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))
          ) : (
            <Typography color="text.secondary" textAlign="center">
              Không tìm thấy câu hỏi phù hợp.
            </Typography>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
