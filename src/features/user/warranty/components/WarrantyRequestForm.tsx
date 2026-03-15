// warranty/components/WarrantyRequestForm.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Alert,
  AlertTitle,
  Stack,
  Chip,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { motion, AnimatePresence } from "framer-motion";
import { getOrderItems, submitWarrantyClaim } from "../api";

const steps = [
  "Nhập thông tin đơn hàng",
  "Chọn sản phẩm",
  "Mô tả lỗi và hình ảnh",
];

// Validation rules
const validateStep = (step: number, data: any, products: any[]) => {
  switch (step) {
    case 0:
      if (!data.orderCode) return "Vui lòng nhập mã đơn hàng";
      if (!data.contactInfo) return "Vui lòng nhập email hoặc số điện thoại";
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$|(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(
          data.contactInfo,
        )
      ) {
        return "Email hoặc số điện thoại không hợp lệ";
      }
      break;
    case 1:
      if (products.length === 0) return "Không tìm thấy sản phẩm nào";
      if (!data.selectedProduct) return "Vui lòng chọn sản phẩm";
      break;
    case 2:
      if (!data.errorDescription) return "Vui lòng mô tả lỗi";
      if (data.errorDescription.length < 10) return "Mô tả lỗi quá ngắn";
      break;
  }
  return null;
};

export default function WarrantyRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = parseInt(searchParams.get("step") || "0", 10);
  const formRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState<number>(stepParam);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orderCode: "",
    contactInfo: "",
    selectedProduct: "",
    errorDescription: "",
  });

  const [orderProducts, setOrderProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (window.location.hash === "#warranty-request") {
      scrollToForm();
    }
  }, []);

  useEffect(() => {
    setActiveStep(stepParam);
  }, [stepParam]);

  // Lấy sản phẩm theo mã đơn hàng
  useEffect(() => {
    const run = async () => {
      if (!formData.orderCode) return;
      setFetchingProducts(true);
      try {
        const items = await getOrderItems(formData.orderCode);
        setOrderProducts(items);
      } catch (error) {
        setOrderProducts([]);
      } finally {
        setFetchingProducts(false);
      }
    };
    run();
  }, [formData.orderCode]);

  const updateStepInUrl = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleNext = () => {
    // Validate current step
    const error = validateStep(activeStep, formData, orderProducts);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    if (activeStep === steps.length - 1) {
      handleSubmitWarrantyRequest();
    } else {
      const next = activeStep + 1;
      setActiveStep(next);
      updateStepInUrl(next);
    }
  };;

  const handleBack = () => {
    const back = activeStep - 1;
    setActiveStep(back);
    updateStepInUrl(back);
    setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          open: true,
          type: "error",
          message: "Kích thước ảnh không được vượt quá 5MB",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } } as any);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmitWarrantyRequest = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("orderId", formData.orderCode);
      body.append("email", formData.contactInfo);
      body.append("productId", formData.selectedProduct);
      body.append("issueDesc", formData.errorDescription);

      const file = fileInputRef.current?.files?.[0];
      if (file) body.append("imageUrl", file);

      const result = await submitWarrantyClaim(body);

      setAlert({
        open: true,
        type: "success",
        message: result.message || "Đã gửi yêu cầu bảo hành thành công!",
      });

      // Reset form
      setFormData({
        orderCode: "",
        contactInfo: "",
        selectedProduct: "",
        errorDescription: "",
      });
      setOrderProducts([]);
      setPreview(null);
      setActiveStep(0);
      updateStepInUrl(0);
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        message: error?.message || "Lỗi gửi yêu cầu. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      ref={formRef}
      sx={{ p: 4, mt: 4, borderRadius: 3 }}
      id="warranty-request"
    >
      <Typography variant="h5" fontWeight={800} color="#333" gutterBottom>
        Gửi yêu cầu bảo hành
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Điền đầy đủ thông tin bên dưới để được hỗ trợ nhanh nhất
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {validationError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Lỗi</AlertTitle>
              {validationError}
            </Alert>
          )}

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Mã đơn hàng *"
                  fullWidth
                  value={formData.orderCode}
                  onChange={(e) => handleChange("orderCode", e.target.value)}
                  placeholder="VD: DH-2024-001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email hoặc SĐT *"
                  fullWidth
                  value={formData.contactInfo}
                  onChange={(e) => handleChange("contactInfo", e.target.value)}
                  placeholder="example@gmail.com hoặc 0909123456"
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <>
              {fetchingProducts ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Đang tải sản phẩm...</Typography>
                </Box>
              ) : orderProducts.length === 0 ? (
                <Alert severity="warning">
                  <AlertTitle>Không tìm thấy sản phẩm</AlertTitle>
                  Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hotline để được
                  hỗ trợ.
                </Alert>
              ) : (
                <TextField
                  select
                  fullWidth
                  label="Chọn sản phẩm bảo hành *"
                  value={formData.selectedProduct}
                  onChange={(e) =>
                    handleChange("selectedProduct", e.target.value)
                  }
                >
                  {orderProducts.map((p) => (
                    <MenuItem key={p.productDetailId} value={p.productDetailId}>
                      {p.productName} (SL: {p.quantity}) -{" "}
                      {p.price?.toLocaleString()}₫
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Mô tả lỗi *"
                  fullWidth
                  multiline
                  minRows={4}
                  value={formData.errorDescription}
                  onChange={(e) =>
                    handleChange("errorDescription", e.target.value)
                  }
                  placeholder="Vui lòng mô tả chi tiết lỗi của sản phẩm..."
                />
                <FormHelperText>
                  {formData.errorDescription.length}/500 ký tự
                </FormHelperText>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: preview ? "#4caf50" : "#ccc",
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    bgcolor: preview ? "#f1f8e9" : "#fafafa",
                    "&:hover": { borderColor: "#0d47a1", bgcolor: "#e3f2fd" },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <CloudUploadIcon
                    fontSize="large"
                    color={preview ? "success" : "primary"}
                  />
                  <Typography mt={1} variant="body2">
                    {preview
                      ? "Ảnh đã được tải lên"
                      : "Kéo & thả hoặc nhấn để tải ảnh lên"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hỗ trợ: JPG, PNG (tối đa 5MB)
                  </Typography>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                  />

                  {preview && (
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        mt: 2,
                      }}
                    >
                      <Image
                        src={preview}
                        alt="Preview"
                        width={120}
                        height={120}
                        style={{
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: 4,
                        }}
                      />
                      <Chip
                        icon={<DeleteIcon />}
                        label="Xóa"
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "#f44336",
                          color: "#fff",
                          "&:hover": { bgcolor: "#d32f2f" },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          sx={{
            bgcolor: "#0d47a1",
            color: "#fff",
            "&:hover": { bgcolor: "#1565c0" },
          }}
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

      <GlobalSnackbar
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      />
    </Paper>
  );
}
