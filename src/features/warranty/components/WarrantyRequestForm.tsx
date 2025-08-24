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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { motion } from "framer-motion";

const steps = [
  "Nhập thông tin đơn hàng",
  "Chọn sản phẩm",
  "Mô tả lỗi và hình ảnh minh hoạ",
];

const WarrantyRequestForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = parseInt(searchParams.get("step") || "0", 10);
  const formRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState<number>(stepParam);
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
      const rect = formRef.current.getBoundingClientRect();
      const scrollOffset =
        window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: scrollOffset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (window.location.hash === "#warranty-check") {
      scrollToForm();
    }
  }, []);

  useEffect(() => {
    setActiveStep(stepParam);
  }, [stepParam]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!formData.orderCode) return;
      setFetchingProducts(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${formData.orderCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        console.log("Order details:", result);
        setOrderProducts(result?.status === 200 ? result.data.items : []);
      } catch (error) {
        setOrderProducts([]);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchOrderDetails();
  }, [formData.orderCode]);

  const updateStepInUrl = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (activeStep === steps.length - 1) return handleSubmitWarrantyRequest();
    const next = activeStep + 1;
    setActiveStep(next);
    updateStepInUrl(next);
  };

  const handleBack = () => {
    const back = activeStep - 1;
    setActiveStep(back);
    updateStepInUrl(back);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
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
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();
      formDataToSend.append("orderId", formData.orderCode);
      formDataToSend.append("email", formData.contactInfo);
      formDataToSend.append("productId", formData.selectedProduct);
      formDataToSend.append("issueDesc", formData.errorDescription);

      const file = fileInputRef.current?.files?.[0];
      if (file) formDataToSend.append("imageUrl", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/warranty_claim`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );

      const result = await res.json();

      if (res.status === 201) {
        setAlert({ open: true, type: "success", message: result.message });
        setFormData({
          orderCode: "",
          contactInfo: "",
          selectedProduct: "",
          errorDescription: "",
        });
        setPreview(null);
        setActiveStep(0);
        updateStepInUrl(0);
      } else {
        throw new Error(result.message || "Đã xảy ra lỗi!");
      }
    } catch (error: any) {
      setAlert({ open: true, type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper ref={formRef} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Mã đơn hàng"
                fullWidth
                value={formData.orderCode}
                onChange={(e) => handleChange("orderCode", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email hoặc SĐT"
                fullWidth
                value={formData.contactInfo}
                onChange={(e) => handleChange("contactInfo", e.target.value)}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <>
            {fetchingProducts ? (
              <Typography>Đang tải danh sách sản phẩm...</Typography>
            ) : orderProducts.length === 0 ? (
              <Typography color="error">
                Không tìm thấy sản phẩm. Kiểm tra mã đơn hàng.
              </Typography>
            ) : (
              <TextField
                select
                fullWidth
                label="Chọn sản phẩm bảo hành"
                value={formData.selectedProduct}
                onChange={(e) =>
                  handleChange("selectedProduct", e.target.value)
                }
              >
                {orderProducts.map((p) => (
                  <MenuItem key={p.productDetailId} value={p.productDetailId}>
                    {p.productName} (SL: {p.quantity})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Mô tả lỗi"
                fullWidth
                multiline
                minRows={4}
                value={formData.errorDescription}
                onChange={(e) =>
                  handleChange("errorDescription", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  border: "1px dashed #ccc",
                  p: 3,
                  textAlign: "center",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CloudUploadIcon fontSize="large" color="primary" />
                <Typography mt={1} variant="body2">
                  Kéo & thả hoặc nhấn để tải ảnh lên
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <Box mt={2}>
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
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </motion.div>

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

      <GlobalSnackbar
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      />
    </Paper>
  );
};

export default WarrantyRequestForm;
