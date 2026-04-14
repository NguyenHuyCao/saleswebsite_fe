// src/features/admin/products/components/steps/Step2Technical.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, MenuItem, TextField, Typography, Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import type { Product } from "../../types";

// ─── Nhiên liệu ───────────────────────────────────────────────────────────

const FUEL_OPTIONS = [
  { value: "Xăng",    label: "Xăng" },
  { value: "Diesel",  label: "Diesel (Dầu)" },
  { value: "Điện",    label: "Điện" },
  { value: "Hơi nước", label: "Hơi nước" },
  { value: "Khí nén",  label: "Khí nén" },
  { value: "Thuỷ lực", label: "Thuỷ lực" },
];

// ─── Loại động cơ — Tiếng Việt, 2 thì lên đầu ────────────────────────────

const ENGINE_TYPES: { value: string; label: string; fuelHint?: string }[] = [
  { value: "TWO_STROKE",  label: "Động cơ 2 thì (Hai thì)",       fuelHint: "Xăng" },
  { value: "FOUR_STROKE", label: "Động cơ 4 thì (Bốn thì)",       fuelHint: "Xăng" },
  { value: "GASOLINE",    label: "Động cơ xăng",                   fuelHint: "Xăng" },
  { value: "DIESEL",      label: "Động cơ diesel (Dầu)",           fuelHint: "Diesel" },
  { value: "ELECTRIC",    label: "Động cơ điện",                   fuelHint: "Điện" },
  { value: "HYBRID",      label: "Động cơ hybrid (Xăng + Điện)",   fuelHint: "Xăng" },
  { value: "HYDRAULIC",   label: "Hệ thống thuỷ lực",              fuelHint: "Thuỷ lực" },
  { value: "PNEUMATIC",   label: "Hệ thống khí nén",               fuelHint: "Khí nén" },
  { value: "STEAM",       label: "Động cơ hơi nước",               fuelHint: "Hơi nước" },
  { value: "TURBINE",     label: "Tua-bin",                        fuelHint: "Diesel" },
  { value: "ROTARY",      label: "Động cơ quay (Rotary)",          fuelHint: "Xăng" },
];

const DEFAULT_ENGINE = "TWO_STROKE";
const DEFAULT_FUEL   = "Xăng";

// ─── Component ────────────────────────────────────────────────────────────

export default function Step2Technical({
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

  // Khởi tạo giá trị mặc định (2 thì + Xăng)
  useEffect(() => {
    if (!formData.engineType) onChange("engineType", DEFAULT_ENGINE);
    if (!formData.fuelType)   onChange("fuelType",   DEFAULT_FUEL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill nhiên liệu khi đổi loại động cơ
  const handleEngineChange = (value: string) => {
    onChange("engineType", value);
    const hint = ENGINE_TYPES.find((e) => e.value === value)?.fuelHint;
    if (hint) onChange("fuelType", hint);
  };

  const isError = (key: string) => errors.includes(key);

  const validate = () => {
    const missing: string[] = [];
    if (!formData.power)      missing.push("power");
    if (!formData.fuelType)   missing.push("fuelType");
    if (!formData.engineType) missing.push("engineType");
    if (formData.weight == null || formData.weight < 0) missing.push("weight");
    if (!formData.dimensions)  missing.push("dimensions");
    if (formData.tankCapacity == null) missing.push("tankCapacity");
    return missing;
  };

  const submit = async () => {
    const missing = validate();
    if (missing.length) {
      setErrors(missing);
      setToast({ open: true, message: "Vui lòng điền đầy đủ các trường bắt buộc.", type: "error" });
      return;
    }
    onChange("weight",       Math.abs(Number(formData.weight)));
    onChange("tankCapacity", Math.abs(Number(formData.tankCapacity)));
    setErrors([]);
    await onNext();
  };

  const currentEngine = formData.engineType ?? DEFAULT_ENGINE;
  const isTwoStroke   = currentEngine === "TWO_STROKE";

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Bước 2: Thông số kỹ thuật
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nhập thông số kỹ thuật của máy. Thông tin này hiển thị trên trang sản phẩm.
        </Typography>
      </Box>

      {/* Gợi ý cho máy 2 thì */}
      {isTwoStroke && (
        <Alert severity="info" sx={{ py: 0.75 }}>
          <strong>Máy 2 thì:</strong> Thường dùng xăng pha nhớt 2 thì. Công suất ghi theo đơn vị HP hoặc kW.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Loại động cơ — QUAN TRỌNG NHẤT, để đầu */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select fullWidth required
            label="Loại động cơ"
            value={currentEngine}
            onChange={(e) => handleEngineChange(e.target.value)}
            error={isError("engineType")}
            helperText={isError("engineType") ? "Bắt buộc chọn loại động cơ" : ""}
          >
            {ENGINE_TYPES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Nhiên liệu — auto-fill nhưng vẫn cho sửa */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select fullWidth required
            label="Loại nhiên liệu"
            value={formData.fuelType || DEFAULT_FUEL}
            onChange={(e) => onChange("fuelType", e.target.value)}
            error={isError("fuelType")}
            helperText={isError("fuelType") ? "Bắt buộc" : "Tự động điền theo loại động cơ"}
          >
            {FUEL_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Công suất */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required
            label="Công suất"
            value={formData.power || ""}
            onChange={(e) => onChange("power", e.target.value)}
            error={isError("power")}
            helperText={isError("power") ? "Bắt buộc" : ""}
            placeholder="VD: 1.5 kW, 2 HP, 3.5 mã lực"
          />
        </Grid>

        {/* Trọng lượng — đơn vị KG cho máy */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required
            label="Trọng lượng (kg)"
            type="number"
            value={formData.weight ?? ""}
            onChange={(e) => onChange("weight", Math.abs(Number(e.target.value)))}
            error={isError("weight")}
            helperText={isError("weight") ? "Bắt buộc" : "Khối lượng máy tính bằng kg"}
            placeholder="VD: 5.8"
            inputProps={{ step: 0.1, min: 0 }}
          />
        </Grid>

        {/* Kích thước */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required
            label="Kích thước (D × R × C)"
            value={formData.dimensions || ""}
            onChange={(e) => onChange("dimensions", e.target.value)}
            error={isError("dimensions")}
            helperText={isError("dimensions") ? "Bắt buộc" : ""}
            placeholder="VD: 450 × 230 × 280 mm"
          />
        </Grid>

        {/* Dung tích bình */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth required
            label="Dung tích bình nhiên liệu (lít)"
            type="number"
            value={formData.tankCapacity ?? ""}
            onChange={(e) => onChange("tankCapacity", Math.abs(Number(e.target.value)))}
            error={isError("tankCapacity")}
            helperText={isError("tankCapacity") ? "Bắt buộc" : "Nhập 0 nếu không có bình nhiên liệu"}
            placeholder="VD: 0.5"
            inputProps={{ step: 0.1, min: 0 }}
          />
        </Grid>
      </Grid>

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
