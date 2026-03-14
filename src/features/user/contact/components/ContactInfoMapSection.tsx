"use client";

import {
  Box,
  Typography,
  Paper,
  Link,
  Stack,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const contactInfo = [
  {
    icon: <RoomIcon sx={{ color: "#f25c05", fontSize: 28 }} />,
    label: "Địa chỉ",
    value: "7FGV+PM Lục Nam District, Bac Giang, Vietnam",
    action: "https://maps.google.com",
  },
  {
    icon: <PhoneIcon sx={{ color: "#f25c05", fontSize: 28 }} />,
    label: "Hotline",
    value: "0909 123 456",
    action: "tel:0909123456",
    subValue: "Tư vấn 24/7",
  },
  {
    icon: <EmailIcon sx={{ color: "#f25c05", fontSize: 28 }} />,
    label: "Email",
    value: "info@dolatool.vn",
    action: "mailto:info@dolatool.vn",
    subValue: "Phản hồi trong 24h",
  },
  {
    icon: <AccessTimeIcon sx={{ color: "#f25c05", fontSize: 28 }} />,
    label: "Giờ làm việc",
    value: "Thứ 2 – Thứ 7",
    subValue: "8:00 – 17:30",
  },
];

const socialLinks = [
  {
    icon: <FacebookIcon />,
    url: "https://facebook.com/dolatool",
    label: "Facebook",
  },
  {
    icon: <YouTubeIcon />,
    url: "https://youtube.com/dolatool",
    label: "YouTube",
  },
  {
    icon: <TwitterIcon />,
    url: "https://twitter.com/dolatool",
    label: "Twitter",
  },
  {
    icon: <InstagramIcon />,
    url: "https://instagram.com/dolatool",
    label: "Instagram",
  },
];

export default function ContactInfoMapSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box px={{ xs: 2, sm: 4 }} py={8} bgcolor="#f9f9f9">
      <Grid container spacing={4}>
        {/* Contact Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                height: "100%",
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Kết nối với chúng tôi qua các kênh dưới đây
              </Typography>

              <Stack spacing={3}>
                {contactInfo.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#fff8f0",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
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
                            underline="hover"
                            sx={{
                              fontWeight: 600,
                              color: "#333",
                              fontSize: "1rem",
                            }}
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <Typography fontWeight={600} color="#333">
                            {item.value}
                          </Typography>
                        )}
                        {item.subValue && (
                          <Typography variant="caption" color="text.secondary">
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
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Kết nối với chúng tôi
                </Typography>
                <Stack direction="row" spacing={1}>
                  {socialLinks.map((social) => (
                    <IconButton
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      sx={{
                        bgcolor: "#f5f5f5",
                        "&:hover": {
                          bgcolor: "#f25c05",
                          color: "#fff",
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>

              {/* QR Code for WeChat/Zalo (optional) */}
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
                  }}
                >
                  <img
                    src="/images/qr-code.png"
                    alt="QR Code"
                    width={50}
                    height={50}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Quét mã QR để chat Zalo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Kết nối nhanh chóng qua Zalo
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
          >
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: isMobile ? 300 : 500,
                position: "relative",
              }}
            >
              <iframe
                title="DolaTool Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44565.070290525546!2d106.44437623455282!3d21.273365680042907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1sen!2sus!4v1748509785866!5m2!1sen!2sus"
              />

              {/* Map overlay with directions button */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  zIndex: 10,
                }}
              >
                <Chip
                  label="Chỉ đường"
                  component="a"
                  href="https://maps.google.com/?q=7FGV+PM+Lục+Nam+District+Bac+Giang+Vietnam"
                  target="_blank"
                  clickable
                  sx={{
                    bgcolor: "#fff",
                    color: "#f25c05",
                    fontWeight: 600,
                    boxShadow: 2,
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
    </Box>
  );
}
