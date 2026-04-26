// src/features/admin/products/components/steps/Step3PriceStock.tsx
"use client";

import { useState } from "react";
import {
  Box, Button, Grid, TextField, Typography, Alert, InputAdornment,
} from "@mui/material";
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
    open: false, message: "", type: "error" as "error" | "success",
  });

  const isMachine = !formData.productType || formData.productType === "MACHINE";
  const isErr = (k: string) => errors.includes(k);

  const validate = () => {
    const miss: string[] = [];
    if (!formData.price || formData.price <= 0) miss.push("price");
    if (!formData.costPrice || formData.costPrice <= 0) miss.push("costPrice");
    // Với non-machine: tồn kho có thể là 0 (sẽ cập nhật từ variants)
    if (isMachine && (!formData.stockQuantity || formData.stockQuantity <= 0))
      miss.push("stockQuantity");
    if (!formData.warrantyMonths || formData.warrantyMonths <= 0)
      miss.push("warrantyMonths");
    return miss;
  };

  const submit = async () => {
    const miss = validate();
    if (miss.length) {
      setErrors(miss);
      setToast({ open: true, message: "Vui lòng nhập các giá trị hợp lệ.", type: "error" });
      return;
    }
    onChange("price",          Math.abs(Number(formData.price)));
    onChange("costPrice",      Math.abs(Number(formData.costPrice)));
    onChange("stockQuantity",  Math.abs(Number(formData.stockQuantity ?? 0)));
    onChange("warrantyMonths", Math.abs(Number(formData.warrantyMonths)));
    setErrors([]);
    await onNext();
  };

  const formatVnd = (n?: number | null) => (n ? n.toLocaleString("vi-VN") : "");

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Bước 3: Giá và tồn kho
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nhập giá bán, giá vốn và thông tin bảo hành.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Giá bán */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth required
            label="Giá bán"
            value={formatVnd(formData.price)}
            onChange={(e) =>
              onChange("price", Math.abs(Number(e.target.value.replace(/\D/g, ""))))
            }
            error={isErr("price")}
            helperText={isErr("price") ? "Giá bán phải lớn hơn 0" : "Giá hiển thị cho khách hàng"}
            InputProps={{ endAdornment: <InputAdornment position="end">₫</InputAdornment> }}
            placeholder="VD: 3.500.000"
          />
        </Grid>

        {/* Giá vốn */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth required
            label="Giá vốn (nhập hàng)"
            value={formatVnd(formData.costPrice ?? null)}
            onChange={(e) =>
              onChange("costPrice", Math.abs(Number(e.target.value.replace(/\D/g, ""))))
            }
            error={isErr("costPrice")}
            helperText={isErr("costPrice") ? "Giá vốn phải lớn hơn 0" : "Dùng để tính lợi nhuận — không hiển thị cho khách"}
            InputProps={{ endAdornment: <InputAdornment position="end">₫</InputAdornment> }}
            placeholder="VD: 2.800.000"
          />
        </Grid>

        {/* Tồn kho — chỉ bắt buộc với MACHINE */}
        {isMachine ? (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth required
              type="number"
              label="Số lượng tồn kho"
              value={formData.stockQuantity ?? ""}
              onChange={(e) =>
                onChange("stockQuantity", Math.abs(Number(e.target.value)))
              }
              error={isErr("stockQuantity")}
              helperText={isErr("stockQuantity") ? "Số lượng phải lớn hơn 0" : "Số máy hiện có trong kho"}
              inputProps={{ min: 1 }}
            />
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ py: 0.75 }}>
              <strong>Tồn kho theo biến thể:</strong> Với sản phẩm quần áo / phụ kiện, tồn kho được
              tính tự động từ từng biến thể (size × màu) ở bước cuối. Bạn không cần nhập ở đây.
            </Alert>
          </Grid>
        )}

        {/* Bảo hành */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth required
            type="number"
            label="Thời gian bảo hành"
            value={formData.warrantyMonths ?? ""}
            onChange={(e) =>
              onChange("warrantyMonths", Math.abs(Number(e.target.value)))
            }
            error={isErr("warrantyMonths")}
            helperText={isErr("warrantyMonths") ? "Phải lớn hơn 0" : ""}
            InputProps={{ endAdornment: <InputAdornment position="end">tháng</InputAdornment> }}
            placeholder="VD: 12"
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      {/* Tóm tắt biên lợi nhuận */}
      {formData.price && formData.costPrice && formData.price > 0 && formData.costPrice > 0 && (
        <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" mb={0.5}>
            Dự tính lợi nhuận
          </Typography>
          <Typography variant="body2">
            Biên lợi nhuận:{" "}
            <strong style={{ color: "#f25c05" }}>
              {(((formData.price - formData.costPrice) / formData.price) * 100).toFixed(1)}%
            </strong>
            {" "}—{" "}
            {(formData.price - formData.costPrice).toLocaleString("vi-VN")}₫ / sản phẩm
          </Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Button variant="outlined" onClick={onBack}>Quay lại</Button>
        <Button variant="contained" onClick={submit}>Tiếp tục</Button>
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
