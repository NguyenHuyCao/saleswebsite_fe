"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Chip,
  Rating,
  Divider,
  Tooltip,
  Alert,
  Collapse,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SpeedIcon from "@mui/icons-material/Speed";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    comment: "Máy cắt cỏ STIHL mua tại Cường Hoa dùng rất bền. Nhân viên tư vấn nhiệt tình, hỗ trợ sau bán hàng tốt.",
    image: "/images/customer/customer1.jpeg",
    rating: 5,
    location: "Bắc Ninh",
    date: "15/03/2025",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    comment: "Sản phẩm chính hãng, giá cả hợp lý. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!",
    image: "/images/customer/customer2.jpeg",
    rating: 5,
    location: "Bắc Giang",
    date: "12/03/2025",
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    comment: "Máy cưa xích chạy mạnh, bảo hành rõ ràng. Tôi sẽ giới thiệu cho bạn bè.",
    image: "/images/customer/customer3.jpeg",
    rating: 4,
    location: "Hà Nội",
    date: "10/03/2025",
    verified: true,
  },
  {
    id: 4,
    name: "Phạm Văn D",
    comment: "Cửa hàng có nhiều mặt hàng phụ kiện máy 2 thì. Nhân viên am hiểu kỹ thuật, giải đáp tận tình.",
    image: "/images/customer/customer4.jpeg",
    rating: 5,
    location: "Bắc Ninh",
    date: "08/03/2025",
    verified: true,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    comment: "Giá tốt, hàng chính hãng, ship nhanh. Sẽ tiếp tục ủng hộ cửa hàng!",
    image: "/images/customer/customer5.jpeg",
    rating: 5,
    location: "Hưng Yên",
    date: "05/03/2025",
    verified: true,
  },
];

const validateForm = (form: {
  fullName: string;
  email: string;
  phone: string;
  messageContent: string;
}) => {
  const errors: Record<string, string> = {};
  if (!form.fullName) errors.fullName = "Vui lòng nhập họ tên";
  if (!form.email) errors.email = "Vui lòng nhập email";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email không hợp lệ";
  if (!form.phone) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(form.phone))
    errors.phone = "Số điện thoại không hợp lệ";
  if (!form.messageContent) errors.messageContent = "Vui lòng nhập tin nhắn";
  return errors;
};

export default function CustomerFeedback() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", messageContent: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    if (!isPaused) {
      setIndex((prev) => (prev + 1) % reviews.length);
      setAnimKey((k) => k + 1);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isAutoPlay && !isPaused) {
      autoPlayTimerRef.current = setInterval(goToNext, autoPlaySpeed);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, isPaused, autoPlaySpeed, goToNext]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, subject: "Tư vấn" }),
      });
      if (!res.ok) throw new Error("Gửi liên hệ thất bại.");
      setSubmitStatus("success");
      setSubmitMessage("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong 24h.");
      setForm({ fullName: "", email: "", phone: "", messageContent: "" });
      setErrors({});
    } catch (err: unknown) {
      setSubmitStatus("error");
      setSubmitMessage(err instanceof Error ? err.message : "Gửi liên hệ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const prev = () => {
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
    setAnimKey((k) => k + 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const next = () => {
    setIndex((i) => (i + 1) % reviews.length);
    setAnimKey((k) => k + 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const current = reviews[index];
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const satisfactionRate = Math.round(
    (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100,
  );

  return (
    <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fff" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3, md: 4 } }}>

        {/* LEFT: REVIEWS SECTION */}
        <Box sx={{ flex: "1 1 320px", minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              bgcolor: "#fff8f0",
              borderRadius: 4,
              border: "1px solid #ffb700",
              position: "relative",
              overflow: "hidden",
            }}
          >
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

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3, position: "relative", zIndex: 1 }}
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

              <Stack direction="row" spacing={1}>
                <Tooltip title={isAutoPlay ? "Tạm dừng tự động" : "Bật tự động"}>
                  <IconButton
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    size="small"
                    sx={{
                      bgcolor: isAutoPlay ? "#f25c05" : "#f5f5f5",
                      color: isAutoPlay ? "#fff" : "#999",
                      "&:hover": { bgcolor: isAutoPlay ? "#e64a19" : "#e0e0e0" },
                    }}
                  >
                    {isAutoPlay ? <PauseCircleIcon /> : <PlayCircleIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Tốc độ chuyển">
                  <IconButton
                    onClick={() => setAutoPlaySpeed((prev) => (prev === 5000 ? 3000 : 5000))}
                    size="small"
                    sx={{ bgcolor: "#f5f5f5", color: "#666" }}
                  >
                    <SpeedIcon />
                    <Typography variant="caption" sx={{ ml: 0.5, fontSize: "0.6rem" }}>
                      {autoPlaySpeed === 5000 ? "5s" : "3s"}
                    </Typography>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box
              sx={{ position: "relative", minHeight: { xs: 260, sm: 300, md: 320 } }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Paper
                key={animKey}
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: "#fff",
                  position: "absolute",
                  width: "100%",
                  "@keyframes fadeSlideIn": {
                    from: { opacity: 0, transform: "translateX(24px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                  },
                  animation: "fadeSlideIn 0.35s ease-out",
                }}
              >
                <FormatQuoteIcon
                  sx={{ position: "absolute", top: 10, right: 10, fontSize: 40, color: "#ffb700", opacity: 0.3 }}
                />
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Avatar
                    src={current.image}
                    alt={current.name}
                    sx={{ width: 70, height: 70, border: "3px solid #ffb700" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{current.name}</Typography>
                    <Rating
                      value={current.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 0.5, "& .MuiRating-iconFilled": { color: "#ffb700" } }}
                    />
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationOnIcon sx={{ fontSize: 14, color: "#999" }} />
                        <Typography variant="caption" color="text.secondary">{current.location}</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{current.date}</Typography>
                    </Stack>
                    {current.verified && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="Đã xác minh"
                        size="small"
                        sx={{ mt: 0.5, bgcolor: "#4caf50", color: "#fff", height: 20, fontSize: "0.6rem" }}
                      />
                    )}
                  </Box>
                </Stack>
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#555", lineHeight: 1.6 }}>
                  "{current.comment}"
                </Typography>
              </Paper>

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
                  <Box
                    key={animKey}
                    sx={{
                      height: "100%",
                      background: "linear-gradient(90deg, #ffb700, #f25c05)",
                      "@keyframes progressBar": {
                        from: { width: "0%" },
                        to: { width: "100%" },
                      },
                      animation: `progressBar ${autoPlaySpeed}ms linear`,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={prev}
                  sx={{ bgcolor: "#fff", boxShadow: 2, "&:hover": { bgcolor: "#ffb700", color: "#fff" } }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={next}
                  sx={{ bgcolor: "#fff", boxShadow: 2, "&:hover": { bgcolor: "#ffb700", color: "#fff" } }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Typography variant="caption" sx={{ color: "#999" }}>
                {index + 1}/{reviews.length}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}
              >
                {reviews.map((r, i) => (
                  <Tooltip key={r.id} title={r.name}>
                    <Avatar
                      src={r.image}
                      alt={r.name}
                      onClick={() => {
                        setIndex(i);
                        setAnimKey((k) => k + 1);
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 5000);
                      }}
                      sx={{
                        width: 35,
                        height: 35,
                        cursor: "pointer",
                        border: i === index ? "2px solid #f25c05" : "2px solid transparent",
                        opacity: i === index ? 1 : 0.6,
                        transition: "all 0.3s",
                        "&:hover": { opacity: 1, transform: "scale(1.1)" },
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />
            <Stack direction="row" justifyContent="space-around">
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={800} color="#f25c05">{avgRating}</Typography>
                <Rating
                  value={parseFloat(avgRating)}
                  readOnly
                  size="small"
                  precision={0.1}
                  sx={{ "& .MuiRating-iconFilled": { color: "#ffb700" } }}
                />
                <Typography variant="caption" color="text.secondary">{reviews.length} đánh giá</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={800} color="#f25c05">98%</Typography>
                <Typography variant="caption" color="text.secondary">Hài lòng</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={800} color="#f25c05">6+</Typography>
                <Typography variant="caption" color="text.secondary">Năm kinh nghiệm</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* RIGHT: CONTACT FORM */}
        <Box sx={{ flex: "1 1 320px", minWidth: 0 }}>
          <Card sx={{ height: "100%", borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
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
                    <ChatBubbleOutlineIcon sx={{ color: "#fff", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#333">Liên hệ tư vấn</Typography>
                    <Typography variant="body2" color="text.secondary">Đội ngũ chuyên gia sẽ phản hồi trong 24h</Typography>
                  </Box>
                </Stack>
              }
              sx={{ pb: 0 }}
            />
            <CardContent sx={{ p: 3 }}>
              <Collapse in={submitStatus !== "idle"}>
                <Alert
                  severity={submitStatus === "success" ? "success" : "error"}
                  sx={{ mb: 2, borderRadius: 2 }}
                  onClose={() => setSubmitStatus("idle")}
                >
                  {submitMessage}
                </Alert>
              </Collapse>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon sx={{ color: "#f25c05" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#ffb700" } } }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: "#f25c05" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon sx={{ color: "#f25c05" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Tin nhắn"
                    value={form.messageContent}
                    onChange={(e) => handleChange("messageContent", e.target.value)}
                    error={!!errors.messageContent}
                    helperText={errors.messageContent}
                    placeholder="Ví dụ: Tôi cần tư vấn về máy cắt cỏ..."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <ChatBubbleOutlineIcon sx={{ color: "#f25c05" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

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
                      transition: "transform 0.15s, background 0.2s",
                      "&:hover": { bgcolor: "#e64a19", transform: "scale(1.01)" },
                      "&:active": { transform: "scale(0.98)" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
                  </Button>

                  <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}>
                    <Chip icon={<CheckCircleIcon />} label="Miễn phí tư vấn" size="small" sx={{ bgcolor: "#f5f5f5" }} />
                    <Chip icon={<CheckCircleIcon />} label="Phản hồi nhanh" size="small" sx={{ bgcolor: "#f5f5f5" }} />
                    <Chip icon={<CheckCircleIcon />} label="Bảo mật thông tin" size="small" sx={{ bgcolor: "#f5f5f5" }} />
                  </Stack>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
