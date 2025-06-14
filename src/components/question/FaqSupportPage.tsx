"use client";

import React, { useState, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSnackbar from "../alert/GlobalSnackbar";

const faqData = [
  {
    category: "Hỏi đáp về tài khoản",
    questions: [
      {
        q: "Làm thế nào để tôi trở thành thành viên của Dola?",
        a: "Quý khách nhấn vào 'Đăng ký' trên thanh menu hoặc ở Menu trên điện thoại.",
      },
      {
        q: "Tại sao tôi không thể đăng nhập vào tài khoản của tôi?",
        a: "Vui lòng kiểm tra lại email/mật khẩu. Nhấn 'Quên mật khẩu' để khôi phục.",
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
        a: `- Đặt hàng trực tuyến\n- Gọi hotline: 1900 6750\n- Mua trực tiếp tại cửa hàng`,
      },
      {
        q: "Tôi cần hỗ trợ mua hàng, làm cách nào để liên hệ?",
        a: "Bạn có thể gọi hotline, nhắn qua Zalo hoặc Facebook Messenger.",
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
        a: "Tham khảo chính sách đổi trả. Gửi form hoặc gọi hotline.",
      },
    ],
  },
  {
    category: "Hỏi đáp về cửa hàng",
    questions: [
      {
        q: "Tôi có thể đến cửa hàng Dola ở đâu?",
        a: "Cửa hàng tại 293 TL293, Nghĩa Phương, Lục Nam, Bắc Giang.",
      },
      {
        q: "Cửa hàng mở cửa lúc nào?",
        a: "Từ Thứ 2 – Thứ 7, 8:00 – 17:30.",
      },
      {
        q: "Tôi có thể đến mua trực tiếp không?",
        a: "Hoàn toàn được. Mua & thanh toán tại cửa hàng.",
      },
    ],
  },
];

const FaqSupportPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    messageContent: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChangeAccordion =
    (panel: string) => (_: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, subject: "Giải đáp thắc mắc" };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.status === 201) {
        setSnackbar({
          open: true,
          type: "success",
          message: "Gửi thắc mắc thành công!",
        });
        setForm({ fullName: "", email: "", phone: "", messageContent: "" });
      } else {
        throw new Error("Gửi thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Lỗi kết nối. Vui lòng thử lại.",
      });
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box px={{ xs: 2, md: 4 }} py={6} bgcolor="#f5f5f5">
      <Grid container spacing={4}>
        {/* FAQ SECTION */}
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
                        onChange={handleChangeAccordion(panelId)}
                        sx={{
                          mb: 1,
                          borderRadius: 1,
                          boxShadow: 1,
                          "&.Mui-expanded": {
                            bgcolor: "#ffc107",
                            color: "white",
                          },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight={600}>
                            {`${i + 1}. ${item.q}`}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography whiteSpace="pre-line">
                            {item.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Box>
          ))}
        </Grid>

        {/* FORM SECTION */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper ref={formRef} elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Gửi thắc mắc cho chúng tôi
            </Typography>
            {[
              {
                label: "Họ và tên",
                name: "fullName",
                icon: <PersonIcon />,
              },
              {
                label: "Email",
                name: "email",
                icon: <EmailIcon />,
              },
              {
                label: "Điện thoại",
                name: "phone",
                icon: <PhoneIcon />,
              },
            ].map((field, idx) => (
              <TextField
                key={idx}
                fullWidth
                size="small"
                label={field.label}
                value={(form as any)[field.name]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {field.icon}
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            <TextField
              label="Nội dung thắc mắc"
              fullWidth
              multiline
              minRows={4}
              size="small"
              sx={{ mb: 2 }}
              value={form.messageContent}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, messageContent: e.target.value }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color="warning"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Gửi thông tin"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default FaqSupportPage;
