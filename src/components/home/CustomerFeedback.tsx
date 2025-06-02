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
import GlobalSnackbar from "../alert/GlobalSnackbar";

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
      const response = await fetch("http://localhost:8080/api/v1/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: "Tư vấn",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAlert({
          type: "error",
          message: result.message || "Gửi liên hệ thất bại.",
        });
        return;
      }

      setAlert({ type: "success", message: "Gửi liên hệ thành công!" });
      setForm({ fullName: "", email: "", phone: "", messageContent: "" });
    } catch (err) {
      setAlert({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại!" });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const showReview = (idx: number) => {
    setIndex(idx);
  };

  const prev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  return (
    <Box textAlign="center" py={6} className="customer-reviews">
      <GlobalSnackbar
        open={!!alert}
        type={alert?.type || "success"}
        message={alert?.message || ""}
        onClose={() => setAlert(null)}
      />

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Slide direction="left" in mountOnEnter unmountOnExit>
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                CẢM NHẬN KHÁCH HÀNG
              </Typography>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <IconButton onClick={prev}>
                  <ArrowBackIosNewIcon />
                </IconButton>

                <Box
                  sx={{
                    width: 250,
                    background: "white",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s",
                  }}
                >
                  <Avatar
                    src={reviews[index].image}
                    alt={reviews[index].name}
                    sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                  />
                  <Typography fontSize={14}>
                    {reviews[index].comment}
                  </Typography>
                  <Typography fontSize={14} mt={1} fontWeight={600}>
                    - {reviews[index].name}
                  </Typography>
                </Box>

                <IconButton onClick={next}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>

              <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                {reviews.map((r, i) => (
                  <Avatar
                    key={i}
                    src={r.image}
                    onClick={() => showReview(i)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      cursor: "pointer",
                      transform: index === i ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.3s",
                      boxShadow: index === i ? 3 : 1,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Slide>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={500}>
            <Card>
              <CardHeader
                title="Liên hệ với chúng tôi"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        placeholder="Nguyễn Văn A"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountOutline />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="example@gmail.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutline />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        type="tel"
                        label="Số điện thoại"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0901234567"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
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
                        variant="contained"
                        size="large"
                        disabled={loading}
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
