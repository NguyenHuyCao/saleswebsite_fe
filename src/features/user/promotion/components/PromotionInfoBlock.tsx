"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import GuaranteeSection from "./GuaranteeSection";

const faqs = [
  {
    question: "Máy 2 thì và 4 thì khác nhau thế nào?",
    answer:
      "Máy 2 thì gọn nhẹ, phù hợp công suất nhỏ; 4 thì bền và tiết kiệm nhiên liệu hơn.",
  },
  {
    question: "Bảo trì ra sao để dùng bền?",
    answer:
      "Vệ sinh lọc gió, thay nhớt định kỳ, bảo quản nơi khô ráo sau khi dùng.",
  },
  {
    question: "Tôi cần kỹ thuật lắp đặt hỗ trợ?",
    answer:
      "Cường Hoa hỗ trợ tư vấn kỹ thuật trực tiếp hoặc gọi video miễn phí.",
  },
];

export default function PromotionInfoBlock() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mt={15} mb={10} px={isMobile ? 2 : 4}>
      <GuaranteeSection />

      <motion.div

        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mt={5}
          mb={2}
          textAlign="center"
          sx={{ fontSize: { xs: 18, sm: 20 } }}
        >
          CÂU HỎI THƯỜNG GẶP (FAQ)
        </Typography>

        <Box maxWidth={700} mx="auto">
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              disableGutters
              TransitionProps={{ unmountOnExit: true }}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                mb: 1.5,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}
