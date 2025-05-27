"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

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
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("name");

  const handleSave = async () => {
    const formDataUpload = new FormData();
    if (formData.imageAvt) formDataUpload.append("imageAvt", formData.imageAvt);
    if (formData.imageDetail1)
      formDataUpload.append("imageDetails", formData.imageDetail1);
    if (formData.imageDetail2)
      formDataUpload.append("imageDetails", formData.imageDetail2);
    if (formData.imageDetail3)
      formDataUpload.append("imageDetails", formData.imageDetail3);

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/products/step4/${slug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formDataUpload,
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        setAlert({
          open: true,
          message: "Tải ảnh thành công!",
          type: "success",
        });
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setAlert({
          open: true,
          message: data.message || "Tải ảnh thất bại.",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({ open: true, message: "Lỗi kết nối máy chủ.", type: "error" });
      console.error("Upload error:", err);
    }
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
  ) => {
    const imageSrc =
      preview[field] &&
      (preview[field].startsWith("blob:") || preview[field].startsWith("http"))
        ? preview[field]
        : "/images/favicon.png";

    return (
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
          <Box mt={2} display="flex" justifyContent="center">
            <Image
              src={imageSrc}
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
        </UploadBox>
      </Box>
    );
  };

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

      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        type={alert.type as "success" | "error"}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Step4Images;
