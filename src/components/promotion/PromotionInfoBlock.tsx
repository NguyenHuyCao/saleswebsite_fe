"use client";

import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PromotionInfoBlock = () => {
  return (
    <Box mt={5} mb={10}>
      <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
        CAM KẾT – CHÍNH SÁCH
      </Typography>
      <Stack spacing={1} textAlign="center">
        <Typography>Giao hàng siêu tốc 2–4h tại TP.HCM</Typography>
        <Typography>Bảo hành chính hãng 12 tháng</Typography>
        <Typography>Tư vấn kỹ thuật miễn phí</Typography>
        <Typography>Tặng kèm phụ kiện bảo dưỡng</Typography>
      </Stack>

      <Typography
        variant="h6"
        fontWeight={700}
        mt={5}
        mb={2}
        textAlign="center"
      >
        CÂU HỎI THƯỜNG GẶP (FAQ)
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Máy 2 thì và 4 thì khác nhau thế nào?
        </AccordionSummary>
        <AccordionDetails>
          Máy 2 thì có cấu tạo đơn giản hơn và nhẹ hơn, thích hợp công suất nhỏ;
          máy 4 thì tiết kiệm nhiên liệu và bền hơn.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Bảo trì ra sao để dùng bền?
        </AccordionSummary>
        <AccordionDetails>
          Vệ sinh lọc gió, thay nhớt định kỳ và bảo quản nơi khô ráo sau khi
          dùng giúp máy hoạt động tốt hơn.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Tôi cần kỹ thuật lắp đặt hỗ trợ?
        </AccordionSummary>
        <AccordionDetails>
          Dola Tool hỗ trợ tư vấn kỹ thuật trực tiếp hoặc gọi video hướng dẫn
          lắp đặt miễn phí.
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PromotionInfoBlock;
