"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2TechnicalInfo = ({ formData, onChange, onNext, onBack }: Props) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const payload = {
      power: formData.power,
      fuelType: formData.fuelType,
      engineType: formData.engineType,
      weight: formData.weight,
      dimensions: formData.dimensions,
      tankCapacity: formData.tankCapacity,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/step2/${name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        onNext();
      } else {
        setError(data.message || "Vui lòng kiểm tra lại các trường nhập liệu.");
      }
    } catch (err) {
      setError("Lỗi kết nối tới máy chủ.");
      console.error("Error submitting step 2:", err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 2: Thông số kỹ thuật
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={4}>
        {[
          { label: "Công suất", key: "power", type: "text" },
          { label: "Nhiên liệu", key: "fuelType", type: "text" },
          { label: "Loại động cơ", key: "engineType", type: "text" },
          { label: "Trọng lượng (gram)", key: "weight", type: "number" },
          { label: "Kích thước (D x R x C)", key: "dimensions", type: "text" },
          {
            label: "Dung tích bình (lít)",
            key: "tankCapacity",
            type: "number",
          },
        ].map(({ label, key, type }) => (
          <Box
            key={key}
            flex={{ xs: "100%", md: "1 1 45%" }}
            minWidth={{ xs: "100%", md: 300 }}
          >
            <TextField
              fullWidth
              label={label}
              type={type}
              value={formData[key] || ""}
              onChange={(e) =>
                onChange(
                  key,
                  type === "number" ? Number(e.target.value) : e.target.value
                )
              }
            />
          </Box>
        ))}
      </Box>

      {error && (
        <Typography color="error" fontSize={14}>
          {error}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Tiếp tục
        </Button>
      </Box>

      <AlertSnackbar
        open={!!error}
        message={error}
        type="error"
        onClose={() => setError("")}
      />
    </Box>
  );
};

export default Step2TechnicalInfo;
