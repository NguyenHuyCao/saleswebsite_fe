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
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import GlobalSnackbar from "../alert/GlobalSnackbar";

const steps = [
  "Nhập thông tin đơn hàng",
  "Chọn sản phẩm",
  "Mô tả lỗi và hình ảnh minh hoạ",
];

const WarrantyRequestForm = () => {
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const stepParam = parseInt(searchParams.get("step") || "0", 10);
  const [activeStep, setActiveStep] = useState<number>(stepParam);

  const [formData, setFormData] = useState({
    orderCode: "",
    contactInfo: "",
    selectedProduct: "",
    errorDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateStepInUrl = (step: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("step", step.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const [orderProducts, setOrderProducts] = useState<any[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!formData.orderCode) return;

      setFetchingProducts(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `http://localhost:8080/api/v1/orders/${formData.orderCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (result?.status === 200) {
          setOrderProducts(result.data.items || []);
        } else {
          setOrderProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        setOrderProducts([]);
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchOrderDetails();
  }, [formData.orderCode]);

  useEffect(() => {
    setActiveStep(stepParam);
  }, [stepParam]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitWarrantyRequest();
    } else {
      const next = activeStep + 1;
      setActiveStep(next);
      updateStepInUrl(next);
    }
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
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitWarrantyRequest = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("orderId", formData.orderCode);
      formDataToSend.append("email", formData.contactInfo);
      formDataToSend.append("productId", formData.selectedProduct);
      formDataToSend.append("issueDesc", formData.errorDescription);

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formDataToSend.append("imageUrl", file);
      }

      const res = await fetch("http://localhost:8080/api/v1/warranty_claim", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await res.json();

      if (res.status === 201) {
        setAlert({
          open: true,
          type: "success",
          message: result.message || "Gửi yêu cầu thành công!",
        });
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
        setAlert({
          open: true,
          type: "error",
          message: result.message || "Đã xảy ra lỗi!",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "Lỗi kết nối. Vui lòng thử lại.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
        <>
          {fetchingProducts ? (
            <Typography>Đang tải danh sách sản phẩm...</Typography>
          ) : orderProducts.length === 0 ? (
            <Typography color="error">
              Không tìm thấy sản phẩm trong đơn hàng. Vui lòng kiểm tra mã đơn
              hàng.
            </Typography>
          ) : (
            <TextField
              select
              label="Chọn sản phẩm cần bảo hành"
              value={formData.selectedProduct}
              onChange={(e) => handleChange("selectedProduct", e.target.value)}
              fullWidth
            >
              {orderProducts.map((item) => (
                <MenuItem key={item.productId} value={item.productId}>
                  {item.productName} (SL: {item.quantity})
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
              multiline
              minRows={4}
              value={formData.errorDescription}
              onChange={(e) => handleChange("errorDescription", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <CloudUploadIcon fontSize="large" sx={{ color: "#1976d2" }} />
              <Typography variant="body2" mt={1}>
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
                    alt="Ảnh lỗi sản phẩm"
                    width={120}
                    height={120}
                    style={{
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid #eee",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
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
      <GlobalSnackbar
        open={alert.open}
        type={alert.type as "success" | "error"}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      />
    </Paper>
  );
};

export default WarrantyRequestForm;
