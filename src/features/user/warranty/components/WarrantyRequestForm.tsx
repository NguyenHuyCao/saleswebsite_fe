"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  Chip,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import { motion, AnimatePresence } from "framer-motion";
import { getOrderItems, submitWarrantyClaim } from "../api";

const steps = [
  "Nhập thông tin đơn hàng",
  "Chọn sản phẩm",
  "Mô tả lỗi và hình ảnh",
];

const MAX_IMAGES = 3;
const MAX_DESC = 500;

const validateStep = (step: number, data: typeof EMPTY_FORM, products: any[]) => {
  switch (step) {
    case 0:
      if (!data.orderCode.trim()) return "Vui lòng nhập mã đơn hàng";
      if (!data.contactInfo.trim()) return "Vui lòng nhập email tài khoản";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactInfo))
        return "Email không đúng định dạng";
      break;
    case 1:
      if (products.length === 0) return "Không tìm thấy sản phẩm nào";
      if (!data.selectedProduct) return "Vui lòng chọn sản phẩm cần bảo hành";
      break;
    case 2:
      if (!data.errorDescription.trim()) return "Vui lòng mô tả lỗi sản phẩm";
      if (data.errorDescription.trim().length < 10)
        return "Mô tả lỗi quá ngắn (ít nhất 10 ký tự)";
      break;
  }
  return null;
};

const EMPTY_FORM = {
  orderCode: "",
  contactInfo: "",
  selectedProduct: "",
  errorDescription: "",
};

export default function WarrantyRequestForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [orderProducts, setOrderProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    if (field === "errorDescription" && value.length > MAX_DESC) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleNext = async () => {
    const error = validateStep(activeStep, formData, orderProducts);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    if (activeStep === 0) {
      setFetchingProducts(true);
      try {
        const items = await getOrderItems(formData.orderCode.trim());
        setOrderProducts(items);
        if (items.length === 0) {
          setValidationError(
            "Không tìm thấy sản phẩm nào trong đơn hàng này. Vui lòng kiểm tra lại mã."
          );
          return;
        }
        setActiveStep(1);
      } catch {
        setValidationError(
          "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng."
        );
      } finally {
        setFetchingProducts(false);
      }
      return;
    }

    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((s) => s - 1);
    setValidationError(null);
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - previews.length;
    if (remaining <= 0) {
      setAlert({
        open: true,
        type: "error",
        message: `Chỉ được đính kèm tối đa ${MAX_IMAGES} ảnh`,
      });
      return;
    }
    const toAdd = Array.from(files).slice(0, remaining);
    const oversized = toAdd.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setAlert({
        open: true,
        type: "error",
        message: "Kích thước mỗi ảnh không được vượt quá 5MB",
      });
      return;
    }
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => [...prev, { url: reader.result as string, file }]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("orderCode", formData.orderCode.trim());
      body.append("email", formData.contactInfo.trim());
      body.append("productId", formData.selectedProduct);
      body.append("issueDesc", formData.errorDescription.trim());
      previews.forEach((p) => body.append("images", p.file));

      const result = await submitWarrantyClaim(body);

      setAlert({
        open: true,
        type: "success",
        message: result.claimCode
          ? `Đã gửi yêu cầu ${result.claimCode} thành công!`
          : "Đã gửi yêu cầu bảo hành thành công!",
      });

      setFormData(EMPTY_FORM);
      setOrderProducts([]);
      setPreviews([]);
      setActiveStep(0);
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

  const isBusy = loading || fetchingProducts;

  return (
    <Paper
      ref={formRef}
      sx={{ p: { xs: 3, md: 4 }, mt: 4, borderRadius: 3 }}
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
                  onChange={(e) => handleChange("orderCode", e.target.value.toUpperCase())}
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
                  onChange={(e) => handleChange("selectedProduct", e.target.value)}
                >
                  {orderProducts.map((p) => (
                    <MenuItem key={p.productId} value={String(p.productId)}>
                      {p.productName} (SL: {p.quantity}) –{" "}
                      {p.unitPrice?.toLocaleString("vi-VN")}₫
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
                  onChange={(e) => handleChange("errorDescription", e.target.value)}
                  placeholder="Vui lòng mô tả chi tiết lỗi của sản phẩm..."
                  inputProps={{ maxLength: MAX_DESC }}
                />
                <FormHelperText sx={{ textAlign: "right" }}>
                  {formData.errorDescription.length}/{MAX_DESC} ký tự
                </FormHelperText>
              </Grid>

              <Grid size={{ xs: 12 }}>
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
                    onDrop={(e) => {
                      e.preventDefault();
                      addFiles(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <CloudUploadIcon
                      fontSize="large"
                      color={previews.length > 0 ? "success" : "primary"}
                    />
                    <Typography mt={1} variant="body2">
                      Kéo &amp; thả hoặc nhấn để thêm ảnh
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hỗ trợ: JPG, PNG, WebP · Tối đa 5MB/ảnh · {previews.length}/
                      {MAX_IMAGES} ảnh
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      multiple
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </Box>
                )}

                {previews.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    flexWrap="wrap"
                    mt={previews.length < MAX_IMAGES ? 2 : 0}
                  >
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
                          style={{
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                          }}
                        />
                        <Chip
                          icon={<DeleteIcon />}
                          label="Xóa"
                          size="small"
                          onClick={() =>
                            setPreviews((prev) => prev.filter((_, i) => i !== idx))
                          }
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
          disabled={activeStep === 0 || isBusy}
          onClick={handleBack}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isBusy}
          sx={{
            bgcolor: "#0d47a1",
            color: "#fff",
            "&:hover": { bgcolor: "#1565c0" },
            minWidth: 140,
          }}
        >
          {isBusy ? (
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
