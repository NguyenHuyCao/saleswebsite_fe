// warranty/components/WarrantyFAQ.tsx
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
    question: "Làm thế nào để kiểm tra thời gian bảo hành còn lại?",
    answer:
      "Bạn có thể tra cứu trực tiếp trên website bằng cách nhập mã đơn hàng vào ô \"Tra cứu bảo hành\". Kết quả hiển thị ngay lập tức gồm hạn bảo hành và trạng thái yêu cầu (nếu có). Hoặc liên hệ hotline để được hỗ trợ.",
  },
  {
    question: "Tôi cần chuẩn bị những gì khi gửi yêu cầu bảo hành?",
    answer:
      "Bạn cần chuẩn bị: Mã đơn hàng, email tài khoản đã đặt hàng, hình ảnh mô tả lỗi (tối đa 3 ảnh, mỗi ảnh ≤ 5MB) và đảm bảo sản phẩm còn nguyên tem bảo hành.",
  },
  {
    question: "Thời gian xử lý bảo hành là bao lâu?",
    answer:
      "Thời gian xử lý bảo hành thường từ 3–7 ngày làm việc tùy theo mức độ lỗi và tình trạng linh kiện thay thế. Bạn sẽ nhận thông báo qua email khi yêu cầu được duyệt hoặc từ chối.",
  },
  {
    question: "Tôi có thể theo dõi tiến độ yêu cầu bảo hành không?",
    answer:
      "Có. Sau khi gửi yêu cầu, bạn có thể xem trạng thái (Chờ xử lý / Đã duyệt / Từ chối) trong mục \"Lịch sử yêu cầu bảo hành\" trên trang này. Ngoài ra, hệ thống sẽ gửi email thông báo khi có cập nhật.",
  },
  {
    question: "Tôi có thể huỷ yêu cầu bảo hành đã gửi không?",
    answer:
      "Có, bạn có thể huỷ yêu cầu bảo hành đang ở trạng thái \"Chờ xử lý\" bằng cách vào mục \"Lịch sử yêu cầu bảo hành\", chọn yêu cầu cần huỷ và nhấn nút Huỷ. Yêu cầu đã được duyệt hoặc từ chối không thể huỷ.",
  },
  {
    question: "Sản phẩm hết bảo hành có được sửa chữa không?",
    answer:
      "Có, chúng tôi vẫn nhận sửa chữa các sản phẩm hết bảo hành với chi phí hợp lý. Vui lòng mang sản phẩm đến trung tâm bảo hành gần nhất hoặc liên hệ hotline để được báo giá trước.",
  },
];

export default function WarrantyFAQ() {
  const [expanded, setExpanded] = useState<number | false>(false);

  return (
    <Box sx={{ my: 6 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <HelpOutlineIcon sx={{ color: "#0d47a1", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={800} color="#333">
          Câu hỏi thường gặp
        </Typography>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        {faqs.map((faq, idx) => (
          <Accordion
            key={idx}
            expanded={expanded === idx}
            onChange={() => setExpanded(expanded === idx ? false : idx)}
            sx={{
              "&:before": { display: "none" },
              boxShadow: "none",
              borderBottom:
                idx < faqs.length - 1 ? "1px solid #f0f0f0" : "none",
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
