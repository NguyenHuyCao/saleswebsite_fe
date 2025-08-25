// src/features/admin/products/components/steps/Step3PriceStock.tsx
"use client";

import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import type { Product } from "../../types";

export default function Step3PriceStock({
  formData,
  onChange,
  onNext,
  onBack,
}: {
  formData: Product;
  onChange: (k: keyof Product, v: any) => void;
  onNext: () => Promise<void> | void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const isErr = (k: string) => errors.includes(k);

  const validate = () => {
    const miss: string[] = [];
    if (!formData.price || formData.price <= 0) miss.push("price");
    if (!formData.costPrice || formData.costPrice <= 0) miss.push("costPrice");
    if (!formData.stockQuantity || formData.stockQuantity <= 0)
      miss.push("stockQuantity");
    if (!formData.warrantyMonths || formData.warrantyMonths <= 0)
      miss.push("warrantyMonths");
    return miss;
  };

  const submit = async () => {
    const miss = validate();
    if (miss.length) {
      setErrors(miss);
      setToast({
        open: true,
        message: "Vui lòng nhập các giá trị > 0.",
        type: "error",
      });
      return;
    }
    // số dương an toàn
    onChange("price", Math.abs(Number(formData.price)));
    onChange("costPrice", Math.abs(Number(formData.costPrice)));
    onChange("stockQuantity", Math.abs(Number(formData.stockQuantity)));
    onChange("warrantyMonths", Math.abs(Number(formData.warrantyMonths)));

    setErrors([]);
    await onNext();
  };

  const formatVnd = (n?: number | null) => (n ? n.toLocaleString("vi-VN") : "");

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 3: Giá và tồn kho
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <TextField
            fullWidth
            label="Giá bán (VND)"
            value={formatVnd(formData.price)}
            onChange={(e) =>
              onChange(
                "price",
                Math.abs(Number(e.target.value.replace(/\D/g, "")))
              )
            }
            error={isErr("price")}
            helperText={isErr("price") ? "Giá phải lớn hơn 0" : ""}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <TextField
            fullWidth
            label="Giá gốc (VND)"
            value={formatVnd(formData.costPrice ?? null)}
            onChange={(e) =>
              onChange(
                "costPrice",
                Math.abs(Number(e.target.value.replace(/\D/g, "")))
              )
            }
            error={isErr("costPrice")}
            helperText={isErr("costPrice") ? "Giá gốc phải lớn hơn 0" : ""}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <TextField
            fullWidth
            type="number"
            label="Số lượng trong kho"
            value={formData.stockQuantity ?? ""}
            onChange={(e) =>
              onChange("stockQuantity", Math.abs(Number(e.target.value)))
            }
            error={isErr("stockQuantity")}
            helperText={isErr("stockQuantity") ? "Số lượng phải lớn hơn 0" : ""}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <TextField
            fullWidth
            type="number"
            label="Bảo hành (tháng)"
            value={formData.warrantyMonths ?? ""}
            onChange={(e) =>
              onChange("warrantyMonths", Math.abs(Number(e.target.value)))
            }
            error={isErr("warrantyMonths")}
            helperText={
              isErr("warrantyMonths") ? "Bảo hành phải lớn hơn 0" : ""
            }
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={submit}>
          Tiếp tục
        </Button>
      </Box>

      <AlertSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
