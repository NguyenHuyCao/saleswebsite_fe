"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const fuelOptions = [
  "Xăng",
  "Diesel",
  "Điện",
  "Hơi nước",
  "Khí nén",
  "Thuỷ lực",
];

const engineTypes = [
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

const Step2TechnicalInfo = ({ formData, onChange }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const slug = searchParams.get("name");

  useEffect(() => {
    if (!formData.fuelType) onChange("fuelType", fuelOptions[0]);
    if (!formData.engineType) onChange("engineType", engineTypes[0]);
  }, []);

  const validateFields = () => {
    const missingFields = [];
    if (!formData.power) missingFields.push("power");
    if (!formData.fuelType) missingFields.push("fuelType");
    if (!formData.engineType) missingFields.push("engineType");
    if (formData.weight === null || formData.weight === undefined)
      missingFields.push("weight");
    if (!formData.dimensions) missingFields.push("dimensions");
    if (formData.tankCapacity === null || formData.tankCapacity === undefined)
      missingFields.push("tankCapacity");
    return missingFields;
  };

  const handleSubmit = async () => {
    const missing = validateFields();
    if (missing.length > 0) {
      setErrorFields(missing);
      setAlert({
        open: true,
        message: "Vui lòng điền đầy đủ các trường bắt buộc.",
        type: "error",
      });
      return;
    }

    setErrorFields([]);

    const payload = {
      power: formData.power,
      fuelType: formData.fuelType,
      engineType: formData.engineType,
      weight: Math.abs(formData.weight),
      dimensions: formData.dimensions,
      tankCapacity: Math.abs(formData.tankCapacity),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/products/step2/${slug}`,
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
          `/admin/products?page=create&step=2&name=${data.data.slug}`
        );
      } else {
        const messages = Array.isArray(data.message)
          ? data.message
          : [data.message];
        setAlert({ open: true, message: messages.join("\n"), type: "error" });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "Đã xảy ra lỗi khi kết nối tới máy chủ.",
        type: "error",
      });
      console.error("Error submitting technical info:", err);
    }
  };

  const isError = (field: string) => errorFields.includes(field);

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 2: Thông số kỹ thuật
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={4}>
        {["power", "weight", "dimensions", "tankCapacity"].map((field) => (
          <Box key={field} flex={{ xs: "100%", md: "1 1 45%" }} minWidth={300}>
            <TextField
              fullWidth
              label={
                field === "power"
                  ? "Công suất"
                  : field === "weight"
                  ? "Trọng lượng (gram)"
                  : field === "dimensions"
                  ? "Kích thước (D x R x C)"
                  : "Dung tích bình (lít)"
              }
              type={
                field === "weight" || field === "tankCapacity"
                  ? "number"
                  : "text"
              }
              value={formData[field] || ""}
              onChange={(e) =>
                onChange(
                  field,
                  field === "weight" || field === "tankCapacity"
                    ? Math.abs(Number(e.target.value))
                    : e.target.value
                )
              }
              error={isError(field)}
              helperText={isError(field) ? "Không được để trống" : ""}
            />
          </Box>
        ))}

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={300}>
          <TextField
            select
            fullWidth
            label="Nhiên liệu"
            value={formData.fuelType || fuelOptions[0]}
            onChange={(e) => onChange("fuelType", e.target.value)}
            error={isError("fuelType")}
            helperText={isError("fuelType") ? "Không được để trống" : ""}
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
          >
            {fuelOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={300}>
          <TextField
            select
            fullWidth
            label="Loại động cơ"
            value={formData.engineType || engineTypes[0]}
            onChange={(e) => onChange("engineType", e.target.value)}
            error={isError("engineType")}
            helperText={isError("engineType") ? "Không được để trống" : ""}
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
          >
            {engineTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ px: 4, py: 1.5 }}
        >
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

export default Step2TechnicalInfo;
