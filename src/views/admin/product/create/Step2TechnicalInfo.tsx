"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2TechnicalInfo = ({ formData, onChange, onNext, onBack }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 2: Thông số kỹ thuật
      </Typography>

      {/* Responsive layout: 2-2 on desktop, 1-1 on mobile */}
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

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};

export default Step2TechnicalInfo;
