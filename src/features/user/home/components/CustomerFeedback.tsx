"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Paper,
  Chip,
  Rating,
  Divider,
  Container,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Phone from "mdi-material-ui/Phone";
import EmailOutline from "mdi-material-ui/EmailOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import MessageOutline from "mdi-material-ui/MessageOutline";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SpeedIcon from "@mui/icons-material/Speed";

import { api } from "@/lib/api/http";

// Mock data
const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    comment:
      "Dịch vụ tuyệt vời, tôi rất hài lòng! Nhân viên tư vấn nhiệt tình, sản phẩm chất lượng.",
    image: "/images/customer/customer1.jpeg",
    rating: 5,
    location: "Hà Nội",
    date: "15/03/2024",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    comment:
      "Sản phẩm chất lượng, giá cả hợp lý. Giao hàng nhanh chóng, đóng gói cẩn thận.",
    image: "/images/customer/customer2.jpeg",
    rating: 5,
    location: "TP.HCM",
    date: "12/03/2024",
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    comment:
      "Tôi sẽ giới thiệu cho bạn bè. Dụng cụ chính hãng, bảo hành uy tín.",
    image: "/images/customer/customer3.jpeg",
    rating: 4,
    location: "Đà Nẵng",
    date: "10/03/2024",
    verified: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    comment:
      "Nhân viên hỗ trợ rất nhiệt tình. Giải đáp mọi thắc mắc trước khi mua.",
    image: "/images/customer/customer4.jpeg",
    rating: 5,
    location: "Hải Phòng",
    date: "08/03/2024",
    verified: false,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    comment: "Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lần sau.",
    image: "/images/customer/customer5.jpeg",
    rating: 5,
    location: "Cần Thơ",
    date: "05/03/2024",
    verified: true,
  },
];

// Validation rules
const validateForm = (form: any) => {
  const errors: any = {};
  if (!form.fullName) errors.fullName = "Vui lòng nhập họ tên";
  if (!form.email) errors.email = "Vui lòng nhập email";
  else if (!/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Email không hợp lệ";
  if (!form.phone) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(form.phone))
    errors.phone = "Số điện thoại không hợp lệ";
  if (!form.messageContent) errors.messageContent = "Vui lòng nhập tin nhắn";
  return errors;
};

export default function CustomerReviewsSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    messageContent: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Auto-slide states
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000); // 5 seconds
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Auto-slide function
  const goToNext = useCallback(() => {
    if (!isPaused) {
      setDirection(1);
      setIndex((prev) => (prev + 1) % reviews.length);
    }
  }, [isPaused]);

  // Auto-slide timer
  useEffect(() => {
    if (isAutoPlay && !isPaused) {
      autoPlayTimerRef.current = setInterval(goToNext, autoPlaySpeed);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlay, isPaused, autoPlaySpeed, goToNext]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setAlert({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/contacts", { ...form, subject: "Tư vấn" });
      setAlert({ type: "success", message: "Gửi liên hệ thành công!" });
      setForm({ fullName: "", email: "", phone: "", messageContent: "" });
      setErrors({});
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err?.message || "Gửi liên hệ thất bại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
    // Tạm dừng auto-play khi user tương tác
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % reviews.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const current = reviews[index];

  // Calculate average rating
  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
  const satisfactionRate = Math.round(
    (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100,
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
      <Container maxWidth="xl">
        <Snackbar
          open={!!alert}
          autoHideDuration={4000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={alert?.type || "success"}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            {alert?.message}
          </Alert>
        </Snackbar>

        <Grid container spacing={4} alignItems="stretch">
          {/* LEFT: REVIEWS SECTION */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  bgcolor: "#fff8f0",
                  borderRadius: 4,
                  border: "1px solid #ffb700",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background Pattern */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,183,0,0.1)",
                    zIndex: 0,
                  }}
                />

                {/* Header với Auto-play Controls */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        bgcolor: "#f25c05",
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FormatQuoteIcon sx={{ color: "#fff", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={800} color="#333">
                        Khách hàng nói gì?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reviews.length}+ đánh giá từ khách hàng
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Auto-play Controls */}
                  <Stack direction="row" spacing={1}>
                    <Tooltip
                      title={isAutoPlay ? "Tạm dừng tự động" : "Bật tự động"}
                    >
                      <IconButton
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        size="small"
                        sx={{
                          bgcolor: isAutoPlay ? "#f25c05" : "#f5f5f5",
                          color: isAutoPlay ? "#fff" : "#999",
                          "&:hover": {
                            bgcolor: isAutoPlay ? "#e64a19" : "#e0e0e0",
                          },
                        }}
                      >
                        {isAutoPlay ? <PauseCircleIcon /> : <PlayCircleIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Tốc độ chuyển">
                      <IconButton
                        onClick={() =>
                          setAutoPlaySpeed((prev) =>
                            prev === 5000 ? 3000 : 5000,
                          )
                        }
                        size="small"
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#666",
                        }}
                      >
                        <SpeedIcon />
                        <Typography
                          variant="caption"
                          sx={{ ml: 0.5, fontSize: "0.6rem" }}
                        >
                          {autoPlaySpeed === 5000 ? "5s" : "3s"}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {/* Review Slider với hover pause */}
                <Box
                  sx={{ position: "relative", minHeight: 320 }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    <motion.div
                      key={current.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{ position: "absolute", width: "100%" }}
                    >
                      <Paper
                        elevation={3}
                        sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}
                      >
                        <FormatQuoteIcon
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: 40,
                            color: "#ffb700",
                            opacity: 0.3,
                          }}
                        />

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Avatar
                            src={current.image}
                            alt={current.name}
                            sx={{
                              width: 70,
                              height: 70,
                              border: "3px solid #ffb700",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                              {current.name}
                            </Typography>
                            <Rating
                              value={current.rating}
                              readOnly
                              size="small"
                              icon={<StarIcon sx={{ color: "#ffb700" }} />}
                              sx={{ mb: 0.5 }}
                            />
                            <Stack direction="row" spacing={2}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <LocationOnIcon
                                  sx={{ fontSize: 14, color: "#999" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {current.location}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {current.date}
                              </Typography>
                            </Stack>
                            {current.verified && (
                              <Chip
                                icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                label="Đã xác minh"
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  bgcolor: "#4caf50",
                                  color: "#fff",
                                  height: 20,
                                  fontSize: "0.6rem",
                                }}
                              />
                            )}
                          </Box>
                        </Stack>

                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: "italic",
                            color: "#555",
                            lineHeight: 1.6,
                          }}
                        >
                          "{current.comment}"
                        </Typography>
                      </Paper>
                    </motion.div>
                  </AnimatePresence>

                  {/* Auto-play Indicator */}
                  {isAutoPlay && !isPaused && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -10,
                        left: 0,
                        right: 0,
                        height: 2,
                        bgcolor: "#f0f0f0",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        key={index}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: autoPlaySpeed / 1000,
                          ease: "linear",
                        }}
                        style={{
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #ffb700, #f25c05)",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Navigation Controls */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 4 }}
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={prev}
                      sx={{
                        bgcolor: "#fff",
                        boxShadow: 2,
                        "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                      }}
                    >
                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={next}
                      sx={{
                        bgcolor: "#fff",
                        boxShadow: 2,
                        "&:hover": { bgcolor: "#ffb700", color: "#fff" },
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Progress Text */}
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {index + 1}/{reviews.length}
                  </Typography>

                  {/* Avatar Strip */}
                  <Stack direction="row" spacing={1}>
                    {reviews.map((r, i) => (
                      <motion.div
                        key={r.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Tooltip title={r.name}>
                          <Avatar
                            src={r.image}
                            alt={r.name}
                            onClick={() => {
                              setDirection(i > index ? 1 : -1);
                              setIndex(i);
                              setIsPaused(true);
                              setTimeout(() => setIsPaused(false), 5000);
                            }}
                            sx={{
                              width: 35,
                              height: 35,
                              cursor: "pointer",
                              border:
                                i === index
                                  ? "2px solid #f25c05"
                                  : "2px solid transparent",
                              opacity: i === index ? 1 : 0.6,
                              transition: "all 0.3s",
                            }}
                          />
                        </Tooltip>
                      </motion.div>
                    ))}
                  </Stack>
                </Stack>

                {/* Stats */}
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" justifyContent="space-around">
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="#f25c05">
                      {avgRating}
                    </Typography>
                    <Rating
                      value={parseFloat(avgRating)}
                      readOnly
                      size="small"
                      precision={0.1}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {reviews.length} đánh giá
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="#f25c05">
                      {satisfactionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hài lòng
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="#f25c05">
                      4+
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Năm kinh nghiệm
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>

          {/* RIGHT: CONTACT FORM */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          bgcolor: "#f25c05",
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageOutline sx={{ color: "#fff", fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight={800} color="#333">
                          Liên hệ tư vấn
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đội ngũ chuyên gia sẽ phản hồi trong 24h
                        </Typography>
                      </Box>
                    </Stack>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ p: 3 }}>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      {/* Full Name */}
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountOutline sx={{ color: "#f25c05" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#ffb700",
                            },
                          },
                        }}
                      />

                      {/* Email */}
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutline sx={{ color: "#f25c05" }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Phone */}
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: "#f25c05" }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Message */}
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Tin nhắn"
                        value={form.messageContent}
                        onChange={(e) =>
                          handleChange("messageContent", e.target.value)
                        }
                        error={!!errors.messageContent}
                        helperText={errors.messageContent}
                        placeholder="Ví dụ: Tôi cần tư vấn về máy cắt cỏ..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MessageOutline sx={{ color: "#f25c05" }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            bgcolor: "#f25c05",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#e64a19",
                            },
                            "&:disabled": {
                              bgcolor: "#ccc",
                            },
                          }}
                        >
                          {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
                        </Button>
                      </motion.div>

                      {/* Trust badges */}
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mt: 2 }}
                      >
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Miễn phí tư vấn"
                          size="small"
                          sx={{ bgcolor: "#f5f5f5" }}
                        />
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Phản hồi nhanh"
                          size="small"
                          sx={{ bgcolor: "#f5f5f5" }}
                        />
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Bảo mật thông tin"
                          size="small"
                          sx={{ bgcolor: "#f5f5f5" }}
                        />
                      </Stack>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
