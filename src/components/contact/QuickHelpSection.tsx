"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";

const faqList = [
  {
    question: "Làm thế nào để đặt hàng?",
    answer:
      "Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ hotline để được hỗ trợ nhanh chóng.",
  },
  {
    question: "Chính sách bảo hành như thế nào?",
    answer:
      "Tất cả sản phẩm đều được bảo hành chính hãng trong vòng 12 tháng kể từ ngày mua.",
  },
  {
    question: "Tôi có thể xem sản phẩm trực tiếp ở đâu?",
    answer:
      "Quý khách có thể đến showroom tại Bắc Giang để trải nghiệm sản phẩm thực tế.",
  },
  {
    question: "Thời gian giao hàng là bao lâu?",
    answer:
      "Thời gian giao hàng từ 1–5 ngày tùy khu vực. Đối với đơn hàng nội thành có thể trong ngày.",
  },
  {
    question: "Có hỗ trợ kỹ thuật sau mua không?",
    answer:
      "Chúng tôi có đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ khách hàng trong suốt vòng đời sản phẩm.",
  },
];

const QuickHelpSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  const filteredFaqs = useMemo(() => {
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
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
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
};

export default QuickHelpSection;
