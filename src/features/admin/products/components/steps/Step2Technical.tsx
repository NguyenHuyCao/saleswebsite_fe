// src/features/admin/products/components/steps/Step2Technical.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import type { Product } from "../../types";

const FUEL_OPTIONS = [
  "Xăng",
  "Diesel",
  "Điện",
  "Hơi nước",
  "Khí nén",
  "Thuỷ lực",
];
const ENGINE_TYPES = [
  "DIESEL",
  "GASOLINE",
  "ELECTRIC",
  "HYBRID",
  "STEAM",
  "TURBINE",
  "ROTARY",
  "TWO_STROKE",
  "FOUR_STROKE",
  "HYDRAULIC",
  "PNEUMATIC",
];

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
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });

  useEffect(() => {
    if (!formData.fuelType) onChange("fuelType", FUEL_OPTIONS[0]);
    if (!formData.engineType) onChange("engineType", ENGINE_TYPES[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isError = (key: string) => errors.includes(key);

  const validate = () => {
    const missing: string[] = [];
    if (!formData.power) missing.push("power");
    if (!formData.fuelType) missing.push("fuelType");
    if (!formData.engineType) missing.push("engineType");
    if (formData.weight == null) missing.push("weight");
    if (!formData.dimensions) missing.push("dimensions");
    if (formData.tankCapacity == null) missing.push("tankCapacity");
    return missing;
  };

  const submit = async () => {
    const missing = validate();
    if (missing.length) {
      setErrors(missing);
      setToast({
        open: true,
        message: "Vui lòng điền đầy đủ các trường bắt buộc.",
        type: "error",
      });
      return;
    }
    // số dương an toàn
    onChange("weight", Math.abs(Number(formData.weight)));
    onChange("tankCapacity", Math.abs(Number(formData.tankCapacity)));

    setErrors([]);
    await onNext();
  };

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 2: Thông số kỹ thuật
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Công suất"
            fullWidth
            value={formData.power || ""}
            onChange={(e) => onChange("power", e.target.value)}
            error={isError("power")}
            helperText={isError("power") ? "Không được để trống" : ""}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Nhiên liệu"
            fullWidth
            value={formData.fuelType || FUEL_OPTIONS[0]}
            onChange={(e) => onChange("fuelType", e.target.value)}
            error={isError("fuelType")}
            helperText={isError("fuelType") ? "Không được để trống" : ""}
          >
            {FUEL_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            label="Loại động cơ"
            fullWidth
            value={formData.engineType || ENGINE_TYPES[0]}
            onChange={(e) => onChange("engineType", e.target.value)}
            error={isError("engineType")}
            helperText={isError("engineType") ? "Không được để trống" : ""}
          >
            {ENGINE_TYPES.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Trọng lượng (gram)"
            type="number"
            fullWidth
            value={formData.weight ?? ""}
            onChange={(e) =>
              onChange("weight", Math.abs(Number(e.target.value)))
            }
            error={isError("weight")}
            helperText={isError("weight") ? "Không được để trống" : ""}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Kích thước (D x R x C)"
            fullWidth
            value={formData.dimensions || ""}
            onChange={(e) => onChange("dimensions", e.target.value)}
            error={isError("dimensions")}
            helperText={isError("dimensions") ? "Không được để trống" : ""}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Dung tích bình (lít)"
            type="number"
            fullWidth
            value={formData.tankCapacity ?? ""}
            onChange={(e) =>
              onChange("tankCapacity", Math.abs(Number(e.target.value)))
            }
            error={isError("tankCapacity")}
            helperText={isError("tankCapacity") ? "Không được để trống" : ""}
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
