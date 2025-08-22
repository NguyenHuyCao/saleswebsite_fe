"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

const countries = [
  "Việt Nam",
  "Nhật Bản",
  "Hàn Quốc",
  "Trung Quốc",
  "Hoa Kỳ",
  "Pháp",
  "Đức",
  "Anh",
  "Úc",
  "Canada",
];

const Step1BasicInfo = ({ formData, onChange, onNext }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();

        setCategories(catData.data.result);
        setBrands(brandData.data.result);
      } catch (err) {
        console.error("Error fetching categories or brands:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      origin: formData.origin,
      category: { id: formData.categoryId },
      brand: { id: formData.brandId },
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/step1/${formData.id}`,
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
        const newSlug = data.data.slug;
        const currentParams = new URLSearchParams(searchParams.toString());
        const currentSlug = searchParams.get("name");

        if (newSlug && newSlug !== currentSlug) {
          currentParams.set("name", newSlug);
        }

        currentParams.set("step", "0");

        router.push(`/admin/products?${currentParams.toString()}`);
        onNext();
      } else if (res.status === 400) {
        const messages = Array.isArray(data.message)
          ? data.message
          : [data.message];
        setErrors(messages);
        setAlert({
          open: true,
          message: "Vui lòng kiểm tra lại các trường nhập liệu.",
          type: "error",
        });
      }
    } catch (err) {
      setErrors(["Đã xảy ra lỗi khi kết nối tới máy chủ."]);
      setAlert({
        open: true,
        message: "Lỗi kết nối tới máy chủ.",
        type: "error",
      });
      console.error("Error submitting form:", err);
    }
  };

  const hasError = (fieldLabel: string) =>
    errors.some((msg) => msg.toLowerCase().includes(fieldLabel.toLowerCase()));

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 1: Thông tin cơ bản
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            label="Tên sản phẩm"
            value={formData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
            fullWidth
            error={hasError("Tên sản phẩm")}
          />
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            select
            label="Xuất xứ"
            value={formData.origin || ""}
            onChange={(e) => onChange("origin", e.target.value)}
            fullWidth
            error={hasError("Xuất xứ")}
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            select
            label="Danh mục"
            value={formData.categoryId || ""}
            onChange={(e) => onChange("categoryId", Number(e.target.value))}
            fullWidth
            error={hasError("Danh mục") || hasError("category")}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {categories.length === 0 && formData.categoryId && (
              <MenuItem value={formData.categoryId}>
                {formData.categoryName}
              </MenuItem>
            )}
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            select
            label="Thương hiệu"
            value={formData.brandId || ""}
            onChange={(e) => onChange("brandId", Number(e.target.value))}
            fullWidth
            error={hasError("Thương hiệu") || hasError("brand")}
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          >
            {brands.length === 0 && formData.brandId && (
              <MenuItem value={formData.brandId}>{formData.brandName}</MenuItem>
            )}
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box>
        <TextField
          label="Mô tả"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          multiline
          rows={4}
          fullWidth
          error={hasError("Mô tả")}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ px: 4, py: 1.5 }}
        >
          Tiếp theo
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

export default Step1BasicInfo;
