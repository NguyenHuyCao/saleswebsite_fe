"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Phone from "mdi-material-ui/Phone";
import EmailOutline from "mdi-material-ui/EmailOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import MessageOutline from "mdi-material-ui/MessageOutline";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { motion } from "framer-motion";
import { api } from "@/lib/api/http";

const reviews = [
  {
    name: "Nguyễn Văn A",
    comment: '"Dịch vụ tuyệt vời, tôi rất hài lòng!"',
    image: "/images/customer/customer1.jpeg",
  },
  {
    name: "Trần Thị B",
    comment: '"Sản phẩm chất lượng, giá cả hợp lý."',
    image: "/images/customer/customer2.jpeg",
  },
  {
    name: "Lê Văn C",
    comment: '"Tôi sẽ giới thiệu cho bạn bè."',
    image: "/images/customer/customer3.jpeg",
  },
  {
    name: "Phạm Thị D",
    comment: '"Nhân viên hỗ trợ rất nhiệt tình."',
    image: "/images/customer/customer4.jpeg",
  },
];

const CustomerReviewsSlider = () => {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    messageContent: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/contacts", { ...form, subject: "Tư vấn" });
      setAlert({ type: "success", message: "Gửi liên hệ thành công!" });
      setForm({ fullName: "", email: "", phone: "", messageContent: "" });
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err?.message || "Gửi liên hệ thất bại.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };


  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <Box py={6}>
      <GlobalSnackbar
        open={!!alert}
        type={alert?.type || "success"}
        message={alert?.message || ""}
        onClose={() => setAlert(null)}
      />

      <Grid container spacing={4} justifyContent="center">
        {/* REVIEW SLIDER */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Slide direction="left" in mountOnEnter unmountOnExit>
            <Box mt={6}>
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
                textAlign="center"
              >
                CẢM NHẬN KHÁCH HÀNG
              </Typography>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <IconButton onClick={prev} aria-label="Previous">
                  <ArrowBackIosNewIcon />
                </IconButton>

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box
                    sx={{
                      width: 260,
                      background: "#fff",
                      p: 2,
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "transform 0.4s ease",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <Avatar
                      src={reviews[index].image}
                      alt={reviews[index].name}
                      sx={{
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 1.5,
                        boxShadow: 2,
                      }}
                    />
                    <Typography fontSize={15}>
                      {reviews[index].comment}
                    </Typography>
                    <Typography fontWeight={600} fontSize={14} mt={1}>
                      - {reviews[index].name}
                    </Typography>
                  </Box>
                </motion.div>

                <IconButton onClick={next} aria-label="Next">
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>

              <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                {reviews.map((r, i) => (
                  <motion.div whileHover={{ scale: 1.2 }} key={i}>
                    <Avatar
                      src={r.image}
                      alt={`Avatar ${r.name}`}
                      onClick={() => setIndex(i)}
                      sx={{
                        width: isMobile ? 40 : 50,
                        height: isMobile ? 40 : 50,
                        cursor: "pointer",
                        transform: index === i ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.3s",
                        border:
                          index === i
                            ? "2px solid #ffb700"
                            : "2px solid transparent",
                        boxShadow: index === i ? 2 : 1,
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Box>
          </Slide>
        </Grid>

        {/* CONTACT FORM */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={600}>
            <Card sx={{ boxShadow: 3 }}>
              <CardHeader
                title="Liên hệ với chúng tôi"
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {[
                      {
                        label: "Họ và tên",
                        field: "fullName",
                        type: "text",
                        icon: <AccountOutline />,
                        placeholder: "Nguyễn Văn A",
                      },
                      {
                        label: "Email",
                        field: "email",
                        type: "email",
                        icon: <EmailOutline />,
                        placeholder: "example@gmail.com",
                      },
                      {
                        label: "Số điện thoại",
                        field: "phone",
                        type: "tel",
                        icon: <Phone />,
                        placeholder: "0901234567",
                      },
                    ].map((item, idx) => (
                      <Grid size={{ xs: 12 }} key={idx}>
                        <TextField
                          fullWidth
                          label={item.label}
                          type={item.type}
                          value={form[item.field as keyof typeof form]}
                          onChange={(e) =>
                            handleChange(item.field, e.target.value)
                          }
                          placeholder={item.placeholder}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {item.icon}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    ))}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Tin nhắn"
                        value={form.messageContent}
                        onChange={(e) =>
                          handleChange("messageContent", e.target.value)
                        }
                        placeholder="Bạn cần hỗ trợ gì?"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MessageOutline />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          fontWeight: 600,
                          bgcolor: "#ffb700",
                          color: "#000",
                          "&:hover": {
                            bgcolor: "#ffa000",
                          },
                        }}
                      >
                        {loading ? "Đang gửi..." : "Gửi"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerReviewsSlider;
