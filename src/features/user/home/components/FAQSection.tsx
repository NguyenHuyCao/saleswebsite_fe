"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const FAQS = [
  {
    q: "Sản phẩm có được bảo hành không?",
    a: "Tất cả sản phẩm tại Cường Hoa đều được bảo hành chính hãng từ 6 đến 12 tháng tùy từng loại máy. Khách hàng mang sản phẩm đến cửa hàng tại 293 TL293, Nghĩa Phương, Bắc Ninh hoặc liên hệ hotline 0392 923 392 để được hỗ trợ bảo hành tận nơi.",
    tag: "Bảo hành",
  },
  {
    q: "Làm thế nào để đặt hàng?",
    a: "Bạn có thể đặt hàng trực tiếp trên website bằng cách chọn sản phẩm → thêm vào giỏ hàng → điền thông tin giao hàng → chọn phương thức thanh toán và xác nhận đơn. Sau đó đội ngũ sẽ liên hệ xác nhận trong vòng 30 phút trong giờ làm việc.",
    tag: "Đặt hàng",
  },
  {
    q: "Có giao hàng toàn quốc không?",
    a: "Có. Cường Hoa giao hàng toàn quốc qua các đơn vị vận chuyển uy tín. Miễn phí vận chuyển nội thành Bắc Ninh. Các tỉnh thành khác phí vận chuyển được tính theo đơn vị giao hàng và sẽ hiển thị trước khi bạn xác nhận đơn hàng.",
    tag: "Vận chuyển",
  },
  {
    q: "Chính sách đổi trả như thế nào?",
    a: "Cường Hoa hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm lỗi do nhà sản xuất hoặc giao không đúng mô tả. Sản phẩm cần còn nguyên hộp, đầy đủ phụ kiện đi kèm. Liên hệ hotline 0392 923 392 để được hướng dẫn.",
    tag: "Đổi trả",
  },
  {
    q: "Có những phương thức thanh toán nào?",
    a: "Cường Hoa hỗ trợ các hình thức: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, QR Code (VietQR), và các ví điện tử phổ biến. Đặt cọc trước với đơn hàng giá trị lớn để đảm bảo hàng.",
    tag: "Thanh toán",
  },
  {
    q: "Làm sao biết sản phẩm chính hãng?",
    a: "100% sản phẩm tại Cường Hoa được nhập khẩu chính hãng từ nhà phân phối ủy quyền của STIHL, Husqvarna, DEWALT, Makita và các thương hiệu lớn. Mỗi sản phẩm đều có tem chính hãng và phiếu bảo hành. Bạn có thể tra cứu mã sản phẩm trực tiếp trên website của nhà sản xuất.",
    tag: "Chính hãng",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Bảo hành": "#2e7d32",
  "Đặt hàng": "#f25c05",
  "Vận chuyển": "#1976d2",
  "Đổi trả": "#7b1fa2",
  "Thanh toán": "#0288d1",
  "Chính hãng": "#e65100",
};

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string | false>("faq-0");

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fafafa" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            bgcolor: "#f25c05",
            width: 48,
            height: 48,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 12px rgba(242,92,5,0.2)",
          }}
        >
          <HelpOutlineIcon sx={{ color: "#fff", fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#333">
            Câu hỏi thường gặp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Giải đáp nhanh các thắc mắc phổ biến
          </Typography>
        </Box>
      </Box>

      {/* FAQ Accordion */}
      <Stack spacing={1.5}>
        {FAQS.map((faq, i) => {
          const panelId = `faq-${i}`;
          const isOpen = expanded === panelId;
          return (
            <Accordion
              key={panelId}
              expanded={isOpen}
              onChange={handleChange(panelId)}
              disableGutters
              elevation={0}
              sx={{
                borderRadius: "12px !important",
                border: "1px solid",
                borderColor: isOpen ? "#f25c05" : "rgba(0,0,0,0.08)",
                overflow: "hidden",
                bgcolor: "#fff",
                transition: "border-color 0.25s, box-shadow 0.25s",
                boxShadow: isOpen
                  ? "0 4px 16px rgba(242,92,5,0.1)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: isOpen ? "#f25c05" : "#999", transition: "color 0.2s" }} />
                }
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 0.5,
                  minHeight: { xs: 56, sm: 60 },
                  "& .MuiAccordionSummary-content": { my: 1.5 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, width: "100%" }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: isOpen ? "#f25c05" : "#ccc",
                      mt: 1,
                      flexShrink: 0,
                      transition: "background-color 0.25s",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight={isOpen ? 700 : 600}
                      sx={{
                        color: isOpen ? "#f25c05" : "#333",
                        fontSize: { xs: "0.88rem", sm: "0.95rem" },
                        transition: "color 0.25s",
                        pr: 1,
                      }}
                    >
                      {faq.q}
                    </Typography>
                  </Box>
                  <Chip
                    label={faq.tag}
                    size="small"
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      height: 22,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      bgcolor: `${TAG_COLORS[faq.tag]}18`,
                      color: TAG_COLORS[faq.tag],
                      flexShrink: 0,
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, sm: 3 },
                  pt: 0,
                  pb: 2.5,
                  borderTop: "1px solid rgba(242,92,5,0.1)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.75, pl: { xs: 0, sm: 2.75 }, fontSize: { xs: "0.83rem", sm: "0.88rem" } }}
                >
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      {/* CTA */}
      <Box sx={{ textAlign: "center", mt: { xs: 3, md: 4 } }}>
        <Typography variant="body2" color="text.secondary">
          Không tìm thấy câu trả lời?{" "}
          <Box
            component="a"
            href="tel:0392 923 392"
            sx={{ color: "#f25c05", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Gọi ngay 0392 923 392
          </Box>
          {" "}để được tư vấn trực tiếp
        </Typography>
      </Box>
    </Box>
  );
}
