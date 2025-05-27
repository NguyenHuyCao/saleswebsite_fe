"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

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
      stockQuantity: formData.stockQuantity,
      warrantyMonths: formData.warrantyMonths,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/products/step3/${slug}`,
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
      setAlert({
        open: true,
        message: "Đã xảy ra lỗi khi kết nối tới máy chủ.",
        type: "error",
      });
      console.error("Error submitting pricing and inventory:", err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 3: Giá và tồn kho
      </Typography>

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
            type="text"
            value={
              formData.price !== null && formData.price !== undefined
                ? formatCurrency(formData.price)
                : ""
            }
            onChange={(e) => {
              const raw = Number(e.target.value.replace(/\D/g, ""));
              const value = Math.abs(raw);
              onChange("price", value);
            }}
            error={isError("price")}
            helperText={isError("price") ? "Giá phải lớn hơn 0" : ""}
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
            onChange={(e) =>
              onChange("stockQuantity", Math.abs(Number(e.target.value)))
            }
            error={isError("stockQuantity")}
            helperText={
              isError("stockQuantity") ? "Số lượng phải lớn hơn 0" : ""
            }
            inputProps={{ min: 1 }}
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
            onChange={(e) =>
              onChange("warrantyMonths", Math.abs(Number(e.target.value)))
            }
            error={isError("warrantyMonths")}
            helperText={
              isError("warrantyMonths") ? "Bảo hành phải lớn hơn 0" : ""
            }
            inputProps={{ min: 1 }}
          />
        </Box>
      </Box>

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
