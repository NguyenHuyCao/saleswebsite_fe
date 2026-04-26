"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import GuaranteeSection from "./GuaranteeSection";

const faqs = [
  {
    question: "Làm thế nào để áp dụng mã khuyến mãi tại Cường Hoa?",
    answer:
      "Nhập mã khuyến mãi tại bước thanh toán trong giỏ hàng. Với Flash Sale, ưu đãi được áp dụng tự động, không cần nhập mã thủ công.",
  },
  {
    question: "Flash Sale có áp dụng cho tất cả sản phẩm không?",
    answer:
      "Flash Sale chỉ áp dụng cho các sản phẩm được chọn trong từng chương trình. Kiểm tra danh sách sản phẩm cụ thể tại từng chương trình Flash Sale trên trang này.",
  },
  {
    question: "Chương trình khuyến mãi có được cộng dồn không?",
    answer:
      "Các chương trình Flash Sale không cộng dồn với nhau. Tuy nhiên, một số ưu đãi đặc biệt có thể kết hợp với chương trình khách hàng thân thiết của cửa hàng.",
  },
  {
    question: "Tôi cần điều kiện gì để được nhận ưu đãi Flash Sale?",
    answer:
      "Bạn cần đăng nhập tài khoản tại Cường Hoa và thêm sản phẩm vào giỏ hàng trong thời gian diễn ra Flash Sale. Ưu đãi áp dụng tự động, số lượng có hạn.",
  },
];

export default function PromotionInfoBlock() {
  return (
    <Box mt={6} mb={6}>
      <GuaranteeSection />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mt={6}
          mb={3}
          textAlign="center"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          CÂU HỎI THƯỜNG GẶP (FAQ)
        </Typography>

        <Box maxWidth={720} mx="auto">
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              disableGutters
              TransitionProps={{ unmountOnExit: true }}
              sx={{
                borderRadius: "12px !important",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                mb: 1.5,
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  boxShadow: "0 4px 16px rgba(242,92,5,0.1)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#f25c05" }} />}
                sx={{
                  px: { xs: 2, sm: 3 },
                  "&.Mui-expanded": { bgcolor: "#fff8f0" },
                  borderRadius: "12px",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.82rem", sm: "0.875rem" }, lineHeight: 1.7 }}
                >
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
