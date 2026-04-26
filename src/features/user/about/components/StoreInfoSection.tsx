"use client";

import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import DirectionsIcon from "@mui/icons-material/Directions";

const contactItems = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 22, color: "#f25c05" }} />,
    label: "Địa chỉ",
    value: "293 TL293, Nghĩa Phương, Lương Tài, Bắc Ninh",
    action: null,
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 22, color: "#f25c05" }} />,
    label: "Điện thoại",
    value: "0392 923 392",
    action: { href: "tel:0392923392", label: "Gọi ngay" },
  },
  {
    icon: <EmailIcon sx={{ fontSize: 22, color: "#f25c05" }} />,
    label: "Email",
    value: "cuonghoa.may2thi@gmail.com",
    action: { href: "mailto:cuonghoa.may2thi@gmail.com", label: "Gửi email" },
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 22, color: "#f25c05" }} />,
    label: "Giờ làm việc",
    value: "Thứ 2 – Thứ 7: 7:30 – 18:00 | Chủ nhật: 8:00 – 12:00",
    action: null,
  },
];

export default function StoreInfoSection() {
  return (
    <Box
      py={{ xs: 6, md: 8 }}
      sx={{
        bgcolor: "#fff8f0",
        mx: { xs: -2, sm: -3, md: -3 },
        px: { xs: 2, sm: 3, md: 3 },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="LIÊN HỆ & CỬA HÀNG"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Tìm đến{" "}
          <Box component="span" sx={{ color: "#f25c05" }}>
            Cường Hoa
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
          Đến trực tiếp cửa hàng hoặc liên hệ để được tư vấn miễn phí — đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* Contact info */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #f5e6d8",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thông tin liên hệ
            </Typography>

            <Stack spacing={2.5} divider={<Divider />}>
              {contactItems.map((item, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25, lineHeight: 1.6 }}>
                      {item.value}
                    </Typography>
                    {item.action && (
                      <Button
                        href={item.action.href}
                        size="small"
                        variant="outlined"
                        sx={{
                          mt: 0.75,
                          borderColor: "#f25c05",
                          color: "#f25c05",
                          textTransform: "none",
                          fontWeight: 600,
                          py: 0.25,
                          fontSize: "0.78rem",
                          borderRadius: 1.5,
                          "&:hover": { bgcolor: "#fff3ee", borderColor: "#e64a19" },
                        }}
                      >
                        {item.action.label}
                      </Button>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>

            <Box sx={{ mt: "auto", pt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DirectionsIcon />}
                href="https://maps.google.com/?q=293+TL293,+Nghia+Phuong,+Luong+Tai,+Bac+Ninh"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1.25,
                  "&:hover": { bgcolor: "#e64a19" },
                }}
              >
                Chỉ đường đến cửa hàng
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Map embed */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              height: { xs: 280, md: "100%" },
              minHeight: 320,
              border: "1px solid #f5e6d8",
              position: "relative",
            }}
          >
            <iframe
              title="Vị trí cửa hàng Cường Hoa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14899.32!2d106.08!3d21.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA0JzEyLjAiTiAxMDbCsDA0JzQ4LjAiRQ!5e0!3m2!1svi!2svn!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
