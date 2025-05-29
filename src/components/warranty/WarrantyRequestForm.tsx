// WarrantyRequestForm.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const steps = ["Nhập thông tin đơn hàng", "Chọn sản phẩm", "Mô tả lỗi và gửi"];

const WarrantyRequestForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    orderCode: "",
    contactInfo: "",
    selectedProduct: "",
    errorDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setActiveStep(0);
        setFormData({
          orderCode: "",
          contactInfo: "",
          selectedProduct: "",
          errorDescription: "",
        });
      }, 1500);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Gửi yêu cầu bảo hành
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Mã đơn hàng"
              value={formData.orderCode}
              onChange={(e) => handleChange("orderCode", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email hoặc SĐT"
              value={formData.contactInfo}
              onChange={(e) => handleChange("contactInfo", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <TextField
          select
          label="Chọn sản phẩm cần bảo hành"
          value={formData.selectedProduct}
          onChange={(e) => handleChange("selectedProduct", e.target.value)}
          fullWidth
        >
          <MenuItem value="Máy cắt cỏ Makita">Máy cắt cỏ Makita</MenuItem>
          <MenuItem value="Máy cưa Husqvarna">Máy cưa Husqvarna</MenuItem>
          <MenuItem value="Máy khoan Hyundai">Máy khoan Hyundai</MenuItem>
        </TextField>
      )}

      {activeStep === 2 && (
        <TextField
          label="Mô tả lỗi (nếu có thể kèm ảnh)"
          multiline
          minRows={4}
          value={formData.errorDescription}
          onChange={(e) => handleChange("errorDescription", e.target.value)}
          fullWidth
        />
      )}

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            "Gửi yêu cầu"
          ) : (
            "Tiếp tục"
          )}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <MuiAlert severity="success" elevation={6} variant="filled">
          Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default WarrantyRequestForm;
