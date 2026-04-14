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
      if (!data.contactInfo) return "Vui lòng nhập email tài khoản";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactInfo)) {
        return "Email không đúng định dạng";
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
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 3;

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

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const remaining = MAX_IMAGES - previews.length;
    if (remaining <= 0) {
      setAlert({ open: true, type: "error", message: `Chỉ được đính kèm tối đa ${MAX_IMAGES} ảnh` });
      return;
    }
    const toAdd = newFiles.slice(0, remaining);
    const oversized = toAdd.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setAlert({ open: true, type: "error", message: "Kích thước mỗi ảnh không được vượt quá 5MB" });
      return;
    }
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, { url: reader.result as string, file }]);
      };
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-added if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
  };

  const handleRemoveImage = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmitWarrantyRequest = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      // orderCode: mã đơn hàng (ORD-YYYYMMDD-XXXXX)
      body.append("orderCode", formData.orderCode);
      // email: dùng contactInfo (user nhập email tài khoản)
      body.append("email", formData.contactInfo);
      // productId: ID sản phẩm (selectedProduct giờ lưu productId)
      body.append("productId", formData.selectedProduct);
      body.append("issueDesc", formData.errorDescription);

      previews.forEach((p) => body.append("images", p.file));

      const result = await submitWarrantyClaim(body);

      setAlert({
        open: true,
        type: "success",
        message: result.claimCode
          ? `Đã gửi yêu cầu ${result.claimCode} thành công!`
          : "Đã gửi yêu cầu bảo hành thành công!",
      });

      // Reset form
      setFormData({
        orderCode: "",
        contactInfo: "",
        selectedProduct: "",
        errorDescription: "",
      });
      setOrderProducts([]);
      setPreviews([]);
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
                  placeholder="VD: ORD-20240315-00001"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email tài khoản đã đặt hàng *"
                  fullWidth
                  type="email"
                  value={formData.contactInfo}
                  onChange={(e) => handleChange("contactInfo", e.target.value)}
                  placeholder="example@gmail.com"
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
                    // value = productId (số nguyên) — BE nhận productId để tìm OrderDetail
                    <MenuItem key={p.productId} value={String(p.productId)}>
                      {p.productName} (SL: {p.quantity}) -{" "}
                      {p.unitPrice?.toLocaleString()}₫
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
                {/* Drop zone — chỉ hiện khi chưa đủ MAX_IMAGES */}
                {previews.length < MAX_IMAGES && (
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: previews.length > 0 ? "#4caf50" : "#ccc",
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      bgcolor: previews.length > 0 ? "#f1f8e9" : "#fafafa",
                      "&:hover": { borderColor: "#0d47a1", bgcolor: "#e3f2fd" },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <CloudUploadIcon fontSize="large" color={previews.length > 0 ? "success" : "primary"} />
                    <Typography mt={1} variant="body2">
                      Kéo &amp; thả hoặc nhấn để thêm ảnh
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hỗ trợ: JPG, PNG, WebP · Tối đa 5MB/ảnh · {previews.length}/{MAX_IMAGES} ảnh
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      multiple
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleFileChange}
                    />
                  </Box>
                )}

                {/* Preview grid */}
                {previews.length > 0 && (
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" mt={previews.length < MAX_IMAGES ? 2 : 0}>
                    {previews.map((p, idx) => (
                      <Box
                        key={idx}
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <Image
                          src={p.url}
                          alt={`Ảnh ${idx + 1}`}
                          width={100}
                          height={100}
                          style={{ objectFit: "cover", border: "1px solid #ddd", borderRadius: 8 }}
                        />
                        <Chip
                          icon={<DeleteIcon />}
                          label="Xóa"
                          size="small"
                          onClick={() => handleRemoveImage(idx)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: "#f44336",
                            color: "#fff",
                            "& .MuiChip-icon": { color: "#fff" },
                            "&:hover": { bgcolor: "#d32f2f" },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
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
