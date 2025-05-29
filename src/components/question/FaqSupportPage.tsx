"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";

const faqData = [
  {
    category: "Hỏi đáp về tài khoản",
    questions: [
      {
        q: "Làm thế nào để tôi trở thành thành viên của Dola?",
        a: "Quý khách vui lòng nhấn vào nút 'Đăng ký' ở thanh menu trên cùng của màn hình (Đối với Desktop) hoặc tại góc trái màn hình, chọn biểu tượng Menu rồi chọn 'Đăng ký' (Đối với Mobile).",
      },
      {
        q: "Tại sao tôi không thể đăng nhập vào tài khoản của tôi?",
        a: "Vui lòng kiểm tra lại email hoặc mật khẩu. Nếu vẫn không được, hãy nhấn 'Quên mật khẩu' để khôi phục.",
      },
      {
        q: "Tôi có thể sử dụng chung tài khoản với người khác được không?",
        a: "Chúng tôi không khuyến khích dùng chung để đảm bảo bảo mật thông tin.",
      },
      {
        q: "Tại sao tôi nên đăng ký thành viên Dola?",
        a: "Thành viên được ưu đãi nhiều chương trình khuyến mãi, tích điểm đổi quà.",
      },
      {
        q: "Dola có chương trình ưu đãi nào hấp dẫn dành cho khách hàng thân thiết?",
        a: "Có, bạn sẽ nhận mã giảm giá và quyền truy cập sớm các chương trình sale.",
      },
    ],
  },
  {
    category: "Hỏi đáp về đặt hàng",
    questions: [
      {
        q: "Tôi có thể đặt hàng bằng những hình thức nào?",
        a: `\n- Đặt hàng trực tuyến qua website\n- Đặt qua hotline: 1900 6750\n- Đặt hàng trực tiếp tại các cửa hàng\n\nChúng tôi khuyến khích khách hàng đăng ký tài khoản để tận dụng ưu đãi tốt nhất.`,
      },
      {
        q: "Tôi cần hỗ trợ mua hàng, làm cách nào để liên hệ với tư vấn viên?",
        a: "Bạn có thể gọi hotline, nhắn tin qua Zalo hoặc Facebook Messenger để được hỗ trợ ngay.",
      },
      {
        q: "Dola có giới hạn về số lượng sản phẩm khi đặt hàng không?",
        a: "Tùy từng sản phẩm. Nếu sản phẩm có giới hạn, sẽ hiển thị số lượng còn lại trên trang.",
      },
      {
        q: "Tôi muốn xem lại lịch sử đơn hàng đã mua?",
        a: "Hãy đăng nhập vào tài khoản, chọn mục 'Đơn hàng của tôi'.",
      },
      {
        q: "Tôi cần làm gì để thay đổi hoặc hủy bỏ đơn hàng đã đặt?",
        a: "Gọi trực tiếp hotline để yêu cầu hủy hoặc chỉnh sửa nếu đơn hàng chưa được xử lý.",
      },
      {
        q: "Tôi muốn khiếu nại/đổi trả hàng, quy trình thực hiện như thế nào?",
        a: "Vui lòng tham khảo chính sách đổi trả, sau đó gửi thông tin tại form bên cạnh hoặc gọi trực tiếp hotline.",
      },
    ],
  },
  {
    category: "Hỏi đáp về hệ thống cửa hàng",
    questions: [
      {
        q: "Tôi có thể đến trực tiếp cửa hàng Dola ở đâu?",
        a: "Hiện tại, cửa hàng chính đặt tại 293 TL293, Nghĩa Phương, Lục Nam, Bắc Giang.",
      },
      {
        q: "Cửa hàng mở cửa vào thời gian nào?",
        a: "Chúng tôi hoạt động từ Thứ 2 đến Thứ 7, từ 8:00 đến 17:30.",
      },
      {
        q: "Tôi có thể mua hàng tại cửa hàng mà không đặt online được không?",
        a: "Hoàn toàn được. Bạn có thể đến trực tiếp và thanh toán tại quầy.",
      },
    ],
  },
];

const FaqSupportPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box px={4} py={6} bgcolor="#f5f5f5">
      <Grid container spacing={4}>
        {/* FAQ section */}
        <Grid size={{ xs: 12, md: 7 }}>
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
              {section.questions.map((item, i) => (
                <Accordion
                  key={i}
                  expanded={expanded === `${index}-${i}`}
                  onChange={handleChange(`${index}-${i}`)}
                  sx={{
                    mb: 1,
                    boxShadow: 1,
                    borderRadius: 1,
                    "&.Mui-expanded": {
                      bgcolor: "#ffc107",
                      color: "white",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>{`${i + 1}. ${
                      item.q
                    }`}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography whiteSpace="pre-line">{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Grid>

        {/* Question Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Gửi thắc mắc cho chúng tôi
            </Typography>
            <TextField
              label="Họ và tên"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Điện thoại"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nội dung"
              fullWidth
              multiline
              minRows={4}
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="warning" fullWidth size="large">
              Gửi thông tin
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FaqSupportPage;
