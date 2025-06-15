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
      "Máy 2 thì có cấu tạo đơn giản hơn và nhẹ hơn, thích hợp công suất nhỏ; máy 4 thì tiết kiệm nhiên liệu và bền hơn.",
  },
  {
    question: "Bảo trì ra sao để dùng bền?",
    answer:
      "Vệ sinh lọc gió, thay nhớt định kỳ và bảo quản nơi khô ráo sau khi dùng giúp máy hoạt động tốt hơn.",
  },
  {
    question: "Tôi cần kỹ thuật lắp đặt hỗ trợ?",
    answer:
      "Dola Tool hỗ trợ tư vấn kỹ thuật trực tiếp hoặc gọi video hướng dẫn lắp đặt miễn phí.",
  },
];

const PromotionInfoBlock = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mt={15} mb={10} px={isMobile ? 2 : 4}>
      {/* CAM KẾT */}
      <GuaranteeSection />

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
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
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${idx}-content`}
                id={`panel${idx}-header`}
              >
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
};

export default PromotionInfoBlock;
