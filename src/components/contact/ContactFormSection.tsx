"use client";

import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";

const topics = ["Báo giá", "Bảo hành", "Kỹ thuật", "Hợp tác đại lý"];

const ContactFormSection = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Đã gửi liên hệ thành công!");
    }, 1500);
  };

  return (
    <Box py={8} px={4} bgcolor="#f5f5f5">
      <Paper
        elevation={4}
        sx={{ maxWidth: 800, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
          Liên hệ với chúng tôi
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                required
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Chủ đề cần tư vấn"
                defaultValue="Báo giá"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {topics.map((topic, index) => (
                  <MenuItem key={index} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nội dung liên hệ"
                required
                multiline
                minRows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MessageOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                disabled={loading}
                sx={{ px: 5, py: 1.5, fontWeight: "bold" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Gửi liên hệ"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactFormSection;
