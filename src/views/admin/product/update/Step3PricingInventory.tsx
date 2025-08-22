"use client";

import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

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
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const handleSubmit = async () => {
    const payload = {
      price: formData.price,
      costPrice: formData.costPrice,
      stockQuantity: formData.stockQuantity,
      warrantyMonths: formData.warrantyMonths,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/step3/${name}`,
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
        setAlert({
          open: true,
          message: data.message || "Lỗi khi cập nhật bước 3.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Lỗi kết nối máy chủ:", err);
      setAlert({
        open: true,
        message: "Lỗi kết nối máy chủ.",
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Giá bán (VND)"
            type="number"
            value={formData.price || ""}
            onChange={(e) => onChange("price", Number(e.target.value))}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Giá gốc (VND)"
            type="number"
            value={formData.costPrice || ""}
            onChange={(e) => onChange("costPrice", Number(e.target.value))}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Số lượng trong kho"
            type="number"
            value={formData.stockQuantity || ""}
            onChange={(e) => onChange("stockQuantity", Number(e.target.value))}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Bảo hành (tháng)"
            type="number"
            value={formData.warrantyMonths || ""}
            onChange={(e) => onChange("warrantyMonths", Number(e.target.value))}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Tiếp tục
        </Button>
      </Box>

      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        type={alert.type as "success" | "error"}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Step3PricingInventory;
