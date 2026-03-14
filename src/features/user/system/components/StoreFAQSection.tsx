"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const faqs = [
  {
    question: "Có thể đến xem sản phẩm trực tiếp trước khi mua không?",
    answer:
      "Có, bạn có thể đến bất kỳ cửa hàng nào của DolaTool để trải nghiệm sản phẩm thực tế. Nhân viên sẽ hỗ trợ tư vấn và demo sản phẩm cho bạn.",
  },
  {
    question: "Tôi có thể đổi trả sản phẩm tại cửa hàng không?",
    answer:
      "Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày tại bất kỳ cửa hàng nào của DolaTool, kèm theo hóa đơn và sản phẩm còn nguyên tem, chưa qua sử dụng.",
  },
  {
    question: "Cửa hàng có hỗ trợ giao hàng không?",
    answer:
      "Có, chúng tôi hỗ trợ giao hàng tận nơi với các đơn hàng online. Nếu bạn mua tại cửa hàng, có thể nhận hàng ngay hoặc yêu cầu giao hàng miễn phí trong nội thành.",
  },
  {
    question: "Thời gian bảo hành sản phẩm là bao lâu?",
    answer:
      "Tùy theo từng sản phẩm và thương hiệu, thời gian bảo hành dao động từ 6 tháng đến 36 tháng. Bạn có thể mang sản phẩm đến cửa hàng để được bảo hành nhanh chóng.",
  },
];

export default function StoreFAQSection() {
  const [expanded, setExpanded] = useState<number | false>(false);

  return (
    <Box sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <HelpOutlineIcon sx={{ color: "#f25c05", fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="#333">
            Câu hỏi thường gặp
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Giải đáp thắc mắc về hệ thống cửa hàng
          </Typography>
        </Box>
      </Stack>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {faqs.map((faq, idx) => (
          <Accordion
            key={idx}
            expanded={expanded === idx}
            onChange={() => setExpanded(expanded === idx ? false : idx)}
            sx={{
              mb: 1,
              "&:before": { display: "none" },
              boxShadow: "none",
              border: "1px solid #f0f0f0",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}
