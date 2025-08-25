// src/features/admin/products/components/steps/Step4Images.tsx
"use client";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import type { Product } from "../../types";

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
}));

const Picker = styled("label")(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(1.5, 3),
  background: theme.palette.primary.main,
  color: "#fff",
  fontWeight: 600,
  borderRadius: 8,
  cursor: "pointer",
  input: { display: "none" },
}));

export default function Step4Images({
  formData,
  onChange,
  onSubmit,
  backLabel,
  onBack,
}: {
  formData: Product;
  onChange: (k: keyof Product, v: any) => void;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
  backLabel?: string;
}) {
  const [preview, setPreview] = useState({
    avatar: "",
    d1: "",
    d2: "",
    d3: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const url = (f: File | string | null | undefined) => {
      if (!f) return "";
      if (typeof f === "string")
        return f.startsWith("http") ? f : `/uploads/product/${f}`;
      try {
        return URL.createObjectURL(f);
      } catch {
        return "";
      }
    };
    setPreview({
      avatar: url(formData.imageAvt),
      d1: url(formData.imageDetail1),
      d2: url(formData.imageDetail2),
      d3: url(formData.imageDetail3),
    });
  }, [formData]);

  const pick = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Product) => {
    const file = e.target.files?.[0] || null;
    if (file) onChange(key, file);
  };

  const handleSave = async () => {
    try {
      await onSubmit();
      setToast({ open: true, message: "Lưu ảnh thành công!", type: "success" });
    } catch (e: any) {
      setToast({
        open: true,
        message: e.message || "Lưu ảnh thất bại",
        type: "error",
      });
    }
  };

  const Item = ({
    label,
    keyName,
    src,
  }: {
    label: string;
    keyName: keyof Product;
    src: string;
  }) => (
    <Box>
      <Typography fontWeight={600} mb={1}>
        {label}
      </Typography>
      <UploadBox>
        <Picker>
          Chọn ảnh
          <input
            type="file"
            accept="image/*"
            onChange={(e) => pick(e, keyName)}
          />
        </Picker>
        {src && (
          <Box mt={2} display="flex" justifyContent="center">
            <Image
              src={src}
              alt={label}
              width={140}
              height={140}
              style={{
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}
      </UploadBox>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h6" fontWeight={700}>
        Bước 4: Hình ảnh sản phẩm
      </Typography>

      <Item label="Ảnh đại diện *" keyName="imageAvt" src={preview.avatar} />
      <Item label="Hình minh hoạ 1" keyName="imageDetail1" src={preview.d1} />
      <Item label="Hình minh hoạ 2" keyName="imageDetail2" src={preview.d2} />
      <Item label="Hình minh hoạ 3" keyName="imageDetail3" src={preview.d3} />

      <Box
        display="flex"
        justifyContent={onBack ? "space-between" : "flex-end"}
      >
        {onBack && (
          <Button variant="outlined" onClick={onBack}>
            {backLabel ?? "Quay lại"}
          </Button>
        )}
        <Button variant="contained" color="success" onClick={handleSave}>
          Hoàn tất
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
