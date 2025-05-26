"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface Step4Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
}

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledInput = styled("label")(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  fontWeight: 600,
  borderRadius: 8,
  cursor: "pointer",
  marginTop: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  input: {
    display: "none",
  },
}));

const Step4Images = ({ formData, onChange, onBack }: Step4Props) => {
  const [preview, setPreview] = useState({
    avatar: "",
    detail1: "",
    detail2: "",
    detail3: "",
  });

  const router = useRouter();

  const handleSave = () => {
    router.push("/admin/products");
  };

  useEffect(() => {
    const createPreview = (file: File | string | null) => {
      if (!file) return "";
      if (typeof file === "string") return file;
      try {
        return URL.createObjectURL(file);
      } catch {
        return "";
      }
    };

    setPreview({
      avatar: createPreview(formData.imageAvt),
      detail1: createPreview(formData.imageDetail1),
      detail2: createPreview(formData.imageDetail2),
      detail3: createPreview(formData.imageDetail3),
    });
  }, [formData]);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof preview,
    keyMapValue: string
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange(keyMapValue, file);
      setPreview((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const renderUploadField = (
    label: string,
    field: keyof typeof preview,
    keyMapValue: string
  ) => (
    <Box>
      <Typography fontWeight={600} mb={1}>
        {label}
      </Typography>
      <UploadBox>
        <StyledInput>
          Chọn ảnh
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, field, keyMapValue)}
          />
        </StyledInput>
        {preview[field] && (
          <Box mt={2} display="flex" justifyContent="center">
            <Image
              src={preview[field]}
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

      {renderUploadField("Ảnh đại diện *", "avatar", "imageAvt")}
      {renderUploadField("Hình minh hoạ 1", "detail1", "imageDetail1")}
      {renderUploadField("Hình minh hoạ 2", "detail2", "imageDetail2")}
      {renderUploadField("Hình minh hoạ 3", "detail3", "imageDetail3")}

      <Box display="flex" justifyContent="flex-start" mt={4}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ ml: 2 }}
          color="success"
        >
          Hoàn tất
        </Button>
      </Box>
    </Box>
  );
};

export default Step4Images;
