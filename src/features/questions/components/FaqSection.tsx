"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqCategory } from "../types";

const faqData: FaqCategory[] = [
  {
    category: "Hỏi đáp về tài khoản",
    questions: [
      {
        q: "Làm thế nào để tôi trở thành thành viên của Dola?",
        a: "Nhấn 'Đăng ký' trên thanh menu hoặc ở Menu trên điện thoại.",
      },
      {
        q: "Tại sao tôi không thể đăng nhập vào tài khoản của tôi?",
        a: "Kiểm tra email/mật khẩu. Nhấn 'Quên mật khẩu' để khôi phục.",
      },
      {
        q: "Tôi có thể sử dụng chung tài khoản với người khác được không?",
        a: "Không nên để đảm bảo bảo mật thông tin.",
      },
      {
        q: "Tại sao tôi nên đăng ký thành viên Dola?",
        a: "Thành viên được ưu đãi nhiều khuyến mãi, tích điểm đổi quà.",
      },
      {
        q: "Dola có chương trình ưu đãi nào hấp dẫn dành cho khách hàng thân thiết?",
        a: "Có, bạn sẽ nhận mã giảm giá và quyền truy cập sớm chương trình sale.",
      },
    ],
  },
  {
    category: "Hỏi đáp về đặt hàng",
    questions: [
      {
        q: "Tôi có thể đặt hàng bằng những hình thức nào?",
        a: "- Đặt hàng trực tuyến\n- Gọi hotline: 1900 6750\n- Mua trực tiếp tại cửa hàng",
      },
      {
        q: "Tôi cần hỗ trợ mua hàng, làm cách nào để liên hệ?",
        a: "Gọi hotline, nhắn Zalo hoặc Facebook Messenger.",
      },
      {
        q: "Dola có giới hạn về số lượng sản phẩm khi đặt hàng không?",
        a: "Tùy sản phẩm. Nếu có, sẽ hiển thị rõ trên trang.",
      },
      {
        q: "Tôi muốn xem lại lịch sử đơn hàng đã mua?",
        a: "Đăng nhập > 'Đơn hàng của tôi'.",
      },
      {
        q: "Tôi muốn đổi/trả hàng thì làm sao?",
        a: "Xem chính sách đổi trả. Gửi form hoặc gọi hotline.",
      },
    ],
  },
  {
    category: "Hỏi đáp về cửa hàng",
    questions: [
      {
        q: "Tôi có thể đến cửa hàng Dola ở đâu?",
        a: "293 TL293, Nghĩa Phương, Lục Nam, Bắc Giang.",
      },
      { q: "Cửa hàng mở cửa lúc nào?", a: "Thứ 2 – Thứ 7, 8:00 – 17:30." },
      {
        q: "Tôi có thể đến mua trực tiếp không?",
        a: "Hoàn toàn được. Mua & thanh toán tại cửa hàng.",
      },
    ],
  },
];

export default function FaqSection() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange = (panel: string) => (_: any, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return (
    <Box>
      {faqData.map((section, index) => (
        <Box key={index} mb={4}>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{
              borderBottom: "3px solid #ffb700",
              display: "inline-block",
              pb: 0.5,
            }}
          >
            {section.category}
          </Typography>

          <AnimatePresence>
            {section.questions.map((item, i) => {
              const panelId = `${index}-${i}`;
              return (
                <motion.div
                  key={panelId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Accordion
                    expanded={expanded === panelId}
                    onChange={handleChange(panelId)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      boxShadow: 1,
                      "&.Mui-expanded": { bgcolor: "#ffc107", color: "white" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight={600}>
                        {`${i + 1}. ${item.q}`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography whiteSpace="pre-line">{item.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      ))}
    </Box>
  );
}
