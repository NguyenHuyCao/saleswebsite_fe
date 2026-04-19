"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api/http";

const BENEFITS = [
  "Nhận Flash Sale sớm hơn 24h so với công bố",
  "Mã giảm giá độc quyền chỉ dành cho thành viên",
  "Tin tức & sản phẩm mới cập nhật hàng tuần",
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email) return "Vui lòng nhập email";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email không hợp lệ";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/contacts", {
        fullName: name || "Khách hàng",
        email,
        phone: "0000000000",
        subject: "Đăng ký nhận ưu đãi",
        messageContent: `Đăng ký nhận bản tin ưu đãi: ${email}`,
      });
      setSubmitted(true);
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#f7f7f7" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <motion.div

          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Orange top accent bar */}
            <Box
              sx={{
                height: 4,
                background: "linear-gradient(90deg, #f25c05 0%, #ffb700 100%)",
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: { xs: 3.5, md: 0 },
                p: { xs: 3, sm: 4, md: 0 },
              }}
            >
              {/* Left: Info */}
              <Box
                sx={{
                  flex: 1,
                  p: { md: 5 },
                  borderRight: { md: "1px solid rgba(0,0,0,0.06)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#fff3e0",
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <NotificationsActiveIcon sx={{ color: "#f25c05", fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography
                      fontWeight={800}
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.4rem" },
                        color: "#1a1a1a",
                        lineHeight: 1.2,
                      }}
                    >
                      Nhận ưu đãi độc quyền
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Miễn phí · Hủy bất kỳ lúc nào
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 2.5, fontSize: { xs: "0.85rem", sm: "0.9rem" }, lineHeight: 1.7 }}
                >
                  Đăng ký để nhận Flash Sale, mã giảm giá và tin tức sản phẩm mới nhất từ Cường Hoa.
                </Typography>

                <Stack spacing={1.25}>
                  {BENEFITS.map((b) => (
                    <Box key={b} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#f25c05", fontSize: 18, mt: "1px", flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" }, lineHeight: 1.5 }}
                      >
                        {b}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Right: Form */}
              <Box
                sx={{
                  flex: 1,
                  p: { md: 5 },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"

                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <motion.div

                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 56, color: "#f25c05", mb: 1.5 }} />
                          </motion.div>
                          <Typography fontWeight={800} sx={{ fontSize: "1.2rem", color: "#1a1a1a", mb: 0.75 }}>
                            Đăng ký thành công!
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Chúng tôi sẽ gửi ưu đãi tốt nhất đến{" "}
                            <Box component="span" sx={{ color: "#f25c05", fontWeight: 600 }}>
                              {email}
                            </Box>
                          </Typography>
                        </Box>
                      </motion.div>
                    ) : (
                      <motion.div key="form" animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Typography
                          fontWeight={700}
                          sx={{ fontSize: "0.95rem", color: "#333", mb: 2 }}
                        >
                          Điền thông tin để đăng ký
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                          <Stack spacing={1.5}>
                            <TextField
                              placeholder="Họ và tên (tuỳ chọn)"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              size="small"
                              fullWidth
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  fontSize: "0.9rem",
                                  bgcolor: "#fafafa",
                                  "&:hover fieldset": { borderColor: "#f25c05" },
                                  "&.Mui-focused fieldset": { borderColor: "#f25c05" },
                                },
                              }}
                            />
                            <TextField
                              placeholder="Email của bạn *"
                              type="email"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setError(""); }}
                              size="small"
                              fullWidth
                              required
                              error={!!error}
                              helperText={error}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <EmailOutlinedIcon sx={{ color: "#f25c05", fontSize: 18 }} />
                                    </InputAdornment>
                                  ),
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  fontSize: "0.9rem",
                                  bgcolor: "#fafafa",
                                  "&:hover fieldset": { borderColor: "#f25c05" },
                                  "&.Mui-focused fieldset": { borderColor: "#f25c05" },
                                },
                                "& .MuiFormHelperText-root": { mx: 0, mt: 0.5 },
                              }}
                            />
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                  background: "linear-gradient(90deg, #f25c05, #ff8c00)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  py: 1.25,
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontSize: "0.95rem",
                                  boxShadow: "0 4px 16px rgba(242,92,5,0.25)",
                                  "&:hover": {
                                    background: "linear-gradient(90deg, #e04e00, #f07800)",
                                    boxShadow: "0 6px 20px rgba(242,92,5,0.35)",
                                  },
                                  "&:disabled": {
                                    background: "rgba(0,0,0,0.12)",
                                    color: "rgba(0,0,0,0.26)",
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                {loading ? "Đang gửi..." : "Đăng ký nhận ưu đãi"}
                              </Button>
                            </motion.div>
                          </Stack>

                          <Typography
                            variant="caption"
                            sx={{ color: "#bbb", mt: 1.5, display: "block", textAlign: "center" }}
                          >
                            Không spam. Hủy đăng ký bất kỳ lúc nào.
                          </Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
