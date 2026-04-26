"use client";

import {
  Box,
  Typography,
  Paper,
  Link,
  Stack,
  Divider,
  IconButton,
  Container,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useState } from "react";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Image from "next/image";

const contactInfo = [
  {
    icon: <RoomIcon sx={{ color: "#f25c05", fontSize: 26 }} />,
    label: "Địa chỉ",
    value: "293 TL293, Nghĩa Phương, Bắc Ninh, Việt Nam",
    action:
      "https://www.google.com/maps/search/?api=1&query=293+TL293+Nghi%C3%A3+Ph%C6%B0%C6%A1ng+B%E1%BA%AFc+Ninh",
  },
  {
    icon: <PhoneIcon sx={{ color: "#f25c05", fontSize: 26 }} />,
    label: "Hotline",
    value: "0392 923 392",
    action: "tel:0392923392",
    subValue: "7:00 – 18:00 hàng ngày",
  },
  {
    icon: <EmailIcon sx={{ color: "#f25c05", fontSize: 26 }} />,
    label: "Email",
    value: "support@cuonghoa.vn",
    action: "mailto:support@cuonghoa.vn",
    subValue: "Phản hồi trong 24h",
  },
  {
    icon: <AccessTimeIcon sx={{ color: "#f25c05", fontSize: 26 }} />,
    label: "Giờ làm việc",
    value: "Thứ 2 – Chủ nhật",
    subValue: "7:00 – 18:00",
  },
];

const socialLinks = [
  {
    icon: <FacebookIcon />,
    url: "https://www.facebook.com/messages/e2ee/t/9200105130025225",
    label: "Facebook Messenger",
    color: "#1877F2",
  },
  {
    icon: <YouTubeIcon />,
    url: "https://youtube.com/@cuonghoa",
    label: "YouTube",
    color: "#FF0000",
  },
  {
    icon: <ChatBubbleOutlineIcon />,
    url: "https://zalo.me/0392923392",
    label: "Zalo",
    color: "#0068FF",
  },
];

export default function ContactInfoMapSection() {
  const [qrError, setQrError] = useState(false);

  return (
    <Box
      component="section"
      sx={{ bgcolor: "#f9f9f9", py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Contact Info Panel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ height: "100%" }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                  color="#333"
                  gutterBottom
                >
                  Thông tin liên hệ
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Kết nối với chúng tôi qua các kênh dưới đây
                </Typography>

                <Stack spacing={3} sx={{ flex: 1 }}>
                  {contactInfo.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            bgcolor: "#fff8f0",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.25 }}
                          >
                            {item.label}
                          </Typography>
                          {item.action ? (
                            <Link
                              href={item.action}
                              target={
                                item.action.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.action.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              underline="hover"
                              sx={{
                                fontWeight: 600,
                                color: "#222",
                                fontSize: "0.95rem",
                              }}
                            >
                              {item.value}
                            </Link>
                          ) : (
                            <Typography
                              fontWeight={600}
                              color="#222"
                              fontSize="0.95rem"
                            >
                              {item.value}
                            </Typography>
                          )}
                          {item.subValue && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {item.subValue}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Social Links */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    gutterBottom
                    color="#333"
                  >
                    Theo dõi chúng tôi
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {socialLinks.map((social) => (
                      <IconButton
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        sx={{
                          bgcolor: "#f5f5f5",
                          "&:hover": {
                            bgcolor: social.color,
                            color: "#fff",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>

                {/* Zalo QR Code */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {!qrError ? (
                      <Image
                        src="/images/qr-code.png"
                        alt="QR Code Zalo Cường Hoa"
                        width={50}
                        height={50}
                        onError={() => setQrError(true)}
                      />
                    ) : (
                      <ChatBubbleOutlineIcon
                        sx={{ color: "#0068FF", fontSize: 32 }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#222">
                      Quét mã QR để chat Zalo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tư vấn nhanh qua Zalo: 0392 923 392
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Google Map */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ height: "100%" }}
            >
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  height: { xs: 320, md: "100%" },
                  minHeight: { md: 480 },
                  position: "relative",
                }}
              >
                <iframe
                  title="Cường Hoa — Bản đồ cửa hàng"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44565.070290525546!2d106.44437623455282!3d21.273365680042907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8ar4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1sen!2sus!4v1748509785866!5m2!1sen!2sus"
                />

                {/* Directions Chip */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    zIndex: 10,
                  }}
                >
                  <Chip
                    label="📍 Chỉ đường"
                    component="a"
                    href="https://www.google.com/maps/search/?api=1&query=293+TL293+Nghi%C3%A3+Ph%C6%B0%C6%A1ng+B%E1%BA%AFc+Ninh"
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    sx={{
                      bgcolor: "#fff",
                      color: "#f25c05",
                      fontWeight: 700,
                      boxShadow: 3,
                      "&:hover": {
                        bgcolor: "#f25c05",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
