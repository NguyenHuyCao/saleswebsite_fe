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

const Step3PricingInventory = ({
  formData,
  onChange,
  onNext,
  onBack,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 3: Giá và tồn kho
      </Typography>

      {/* Responsive layout: 1-3 on lg, 2-2 on md, 1-1 on xs */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={4}
        justifyContent="space-between"
      >
        <Box
          flex={{
            xs: "100%",
            sm: "calc(50% - 16px)",
            lg: "calc(33.33% - 16px)",
          }}
          minWidth={250}
        >
          <TextField
            fullWidth
            label="Giá bán (VND)"
            type="number"
            value={formData.price || ""}
            onChange={(e) => onChange("price", Number(e.target.value))}
          />
        </Box>

        <Box
          flex={{
            xs: "100%",
            sm: "calc(50% - 16px)",
            lg: "calc(33.33% - 16px)",
          }}
          minWidth={250}
        >
          <TextField
            fullWidth
            label="Số lượng trong kho"
            type="number"
            value={formData.stockQuantity || ""}
            onChange={(e) => onChange("stockQuantity", Number(e.target.value))}
          />
        </Box>

        <Box
          flex={{
            xs: "100%",
            sm: "calc(50% - 16px)",
            lg: "calc(33.33% - 16px)",
          }}
          minWidth={250}
        >
          <TextField
            fullWidth
            label="Bảo hành (tháng)"
            type="number"
            value={formData.warrantyMonths || ""}
            onChange={(e) => onChange("warrantyMonths", Number(e.target.value))}
          />
        </Box>
      </Box>

      {/* Button group */}
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

export default Step3PricingInventory;
