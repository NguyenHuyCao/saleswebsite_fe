"use client";

import { useState } from "react";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3PricingInventory = ({ formData, onChange }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("name");

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const isError = (field: string) => errorFields.includes(field);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const validateFields = () => {
    const missing = [];
    if (!formData.price || formData.price <= 0) missing.push("price");
    if (!formData.costPrice || formData.costPrice <= 0)
      missing.push("costPrice");
    if (!formData.stockQuantity || formData.stockQuantity <= 0)
      missing.push("stockQuantity");
    if (!formData.warrantyMonths || formData.warrantyMonths <= 0)
      missing.push("warrantyMonths");
    return missing;
  };

  const handleSubmit = async () => {
    const missing = validateFields();
    if (missing.length > 0) {
      setErrorFields(missing);
      setAlert({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin hợp lệ (> 0).",
        type: "error",
      });
      return;
    }

    setErrorFields([]);

    const payload = {
      price: formData.price,
      costPrice: formData.costPrice,
      stockQuantity: formData.stockQuantity,
      warrantyMonths: formData.warrantyMonths,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/step3/${slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.status === 201) {
        router.push(
          `/admin/products?page=create&step=3&name=${data.data.slug}`
        );
      } else {
        setAlert({
          open: true,
          message: data.message || "Lỗi không xác định.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error submitting pricing and inventory:", err);
      setAlert({
        open: true,
        message: "Đã xảy ra lỗi khi kết nối tới máy chủ.",
        type: "error",
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 3: Giá và tồn kho
      </Typography>

      <Grid container spacing={4}>
        {/* Giá bán */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Giá bán (VND)"
            value={formData.price ? formatCurrency(formData.price) : ""}
            onChange={(e) =>
              onChange(
                "price",
                Math.abs(Number(e.target.value.replace(/\D/g, "")))
              )
            }
            error={isError("price")}
            helperText={isError("price") ? "Giá phải lớn hơn 0" : ""}
          />
        </Grid>

        {/* Giá gốc */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Giá gốc (VND)"
            value={formData.costPrice ? formatCurrency(formData.costPrice) : ""}
            onChange={(e) =>
              onChange(
                "costPrice",
                Math.abs(Number(e.target.value.replace(/\D/g, "")))
              )
            }
            error={isError("costPrice")}
            helperText={isError("costPrice") ? "Giá gốc phải lớn hơn 0" : ""}
          />
        </Grid>

        {/* Tồn kho */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Số lượng trong kho"
            value={formData.stockQuantity || ""}
            onChange={(e) =>
              onChange("stockQuantity", Math.abs(Number(e.target.value)))
            }
            error={isError("stockQuantity")}
            helperText={
              isError("stockQuantity") ? "Số lượng phải lớn hơn 0" : ""
            }
          />
        </Grid>

        {/* Bảo hành */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Bảo hành (tháng)"
            value={formData.warrantyMonths || ""}
            onChange={(e) =>
              onChange("warrantyMonths", Math.abs(Number(e.target.value)))
            }
            error={isError("warrantyMonths")}
            helperText={
              isError("warrantyMonths") ? "Bảo hành phải lớn hơn 0" : ""
            }
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Tiếp tục
        </Button>
      </Box>

      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        type={alert.type as "error" | "success"}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Step3PricingInventory;
