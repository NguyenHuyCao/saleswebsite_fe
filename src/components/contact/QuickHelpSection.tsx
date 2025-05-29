"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChatIcon from "@mui/icons-material/Chat";

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

  return (
    <Box px={4} py={6} bgcolor="#fff">
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="primary"
      >
        HỖ TRỢ NHANH
      </Typography>

      <Box maxWidth={800} mx="auto">
        {faqList.map((item, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Nút Chat Messenger/Zalo */}
      {/* <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 999,
          backgroundColor: "#0084FF",
          "&:hover": { backgroundColor: "#005fb8" },
        }}
        onClick={() => window.open("https://zalo.me/0367164126", "_blank")}
        aria-label="Zalo Chat"
      >
        <ChatIcon />
      </Fab> */}
    </Box>
  );
};

export default QuickHelpSection;
