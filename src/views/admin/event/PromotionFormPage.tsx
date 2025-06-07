"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";

interface ProductOption {
  id: number;
  name: string;
}

const PromotionFormPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promotionId = searchParams.get("id");
  const action = searchParams.get("action");

  const [form, setForm] = useState({
    name: "",
    code: "",
    requiresCode: false,
    discount: 0,
    maxDiscount: 0,
    startDate: dayjs(),
    endDate: dayjs().add(7, "day"),
    productIds: [] as number[],
  });

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/products");
      const json = await res.json();
      const list = (json?.data?.result || []).map((p: any) => ({
        id: p.id,
        name: p.name,
      }));
      setProducts(list);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    }
  };

  const fetchPromotionById = async () => {
    if (action === "edit" && promotionId) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/promotions/id?promotionId=${promotionId}`
        );
        const json = await res.json();
        const promo = json.data;

        setForm((prev) => ({
          ...prev,
          name: promo.name || "",
          code: promo.code || "",
          requiresCode: promo.requiresCode,
          discount: promo.discount || 0,
          maxDiscount: promo.maxDiscount || 0,
          startDate: dayjs(promo.startDate),
          endDate: dayjs(promo.endDate),
          productIds: promo.productIds || [],
        }));
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khuyến mãi:", err);
        setSnackbar({
          open: true,
          type: "error",
          message: "Không thể tải thông tin khuyến mãi",
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        name: form.name,
        code: form.requiresCode ? form.code : null,
        requiresCode: form.requiresCode,
        discount: form.discount,
        maxDiscount: form.maxDiscount,
        startDate: form.startDate.format("YYYY-MM-DD"),
        endDate: form.endDate.format("YYYY-MM-DD"),
        productIds: form.productIds,
      };

      const isEditing = action === "edit" && promotionId;
      const url = isEditing
        ? `http://localhost:8080/api/v1/promotions/${promotionId}`
        : "http://localhost:8080/api/v1/promotions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi dữ liệu khuyến mãi");
      const result = await res.json();

      setSnackbar({
        open: true,
        type: "success",
        message: result.message || "Thành công",
      });

      // Nếu là cập nhật → chuyển trang sau 1.5s
      if (isEditing) {
        setTimeout(() => router.push("/admin/events"), 1500);
      } else {
        // Nếu là thêm mới → reset form
        setForm({
          name: "",
          code: "",
          requiresCode: false,
          discount: 0,
          maxDiscount: 0,
          startDate: dayjs(),
          endDate: dayjs().add(7, "day"),
          productIds: [],
        });
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Thất bại khi gửi dữ liệu khuyến mãi",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPromotionById();
  }, []);

  return (
    <Box p={4} maxWidth={720} mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          {action === "edit" ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi mới"}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Tên khuyến mãi"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.requiresCode}
                  onChange={(e) =>
                    setForm({ ...form, requiresCode: e.target.checked })
                  }
                />
              }
              label="Yêu cầu mã khuyến mãi"
            />
            {form.requiresCode && (
              <TextField
                fullWidth
                label="Mã khuyến mãi"
                sx={{ mt: 2 }}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="number"
              label="Tỷ lệ giảm (%)"
              fullWidth
              value={
                form.discount === 0 ? "" : (form.discount * 100).toString()
              }
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  discount: value === "" ? 0 : +value / 100,
                });
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="number"
              label="Giảm tối đa (VNĐ)"
              fullWidth
              value={form.maxDiscount === 0 ? "" : form.maxDiscount.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setForm({
                  ...form,
                  maxDiscount: value === "" ? 0 : +value,
                });
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Ngày bắt đầu"
              value={form.startDate}
              onChange={(date) =>
                setForm({ ...form, startDate: date || dayjs() })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Ngày kết thúc"
              value={form.endDate}
              onChange={(date) =>
                setForm({ ...form, endDate: date || dayjs() })
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              options={products}
              getOptionLabel={(option) => option.name}
              value={products.filter((p) => form.productIds.includes(p.id))}
              onChange={(_, selected) =>
                setForm({ ...form, productIds: selected.map((s) => s.id) })
              }
              renderInput={(params) => (
                <TextField {...params} label="Sản phẩm áp dụng" />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} textAlign="center">
            <Button variant="contained" onClick={handleSubmit} size="large">
              {action === "edit" ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <GlobalSnackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default PromotionFormPage;
