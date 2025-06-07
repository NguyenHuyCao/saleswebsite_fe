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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";

interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

interface Brand {
  id: number;
  name: string;
  category: Category[];
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

  const [brands, setBrands] = useState<Brand[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8080/api/v1/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setBrands(json.data.result || []);
    } catch (err) {
      console.error("Lỗi lấy thương hiệu:", err);
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
          name: promo.name,
          code: promo.code,
          requiresCode: promo.requiresCode,
          discount: promo.discount,
          maxDiscount: promo.maxDiscount,
          startDate: dayjs(promo.startDate),
          endDate: dayjs(promo.endDate),
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

  const fetchAppliedProducts = async () => {
    if (action === "edit" && promotionId) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `http://localhost:8080/api/v1/promotions/${promotionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        const ids = (json.data || []).map((p: any) => p.id);
        setForm((prev) => ({ ...prev, productIds: ids }));
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm đã áp dụng:", err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        ...form,
        code: form.requiresCode ? form.code : null,
        startDate: form.startDate.format("YYYY-MM-DD"),
        endDate: form.endDate.format("YYYY-MM-DD"),
      };

      const url =
        action === "edit"
          ? `http://localhost:8080/api/v1/promotions/${promotionId}`
          : "http://localhost:8080/api/v1/promotions";

      const method = action === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi gửi dữ liệu");
      const result = await res.json();

      setSnackbar({
        open: true,
        type: "success",
        message: result.message || "Thành công",
      });

      if (action === "edit")
        setTimeout(() => router.push("/admin/events"), 1500);
      else setForm({ ...form, name: "", code: "", productIds: [] });
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Thất bại khi gửi dữ liệu",
      });
    }
  };

  const toggleProduct = (id: number) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((pid) => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  useEffect(() => {
    fetchBrands();
    fetchPromotionById();
    fetchAppliedProducts();
  }, []);

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          {action === "edit" ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi mới"}
        </Typography>

        <Grid container spacing={3}>
          {/* Tên khuyến mãi và Mã giảm giá */}
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

          {/* Thông tin giảm giá */}
          <Grid size={{ xs: 6 }}>
            <TextField
              type="number"
              label="Tỷ lệ giảm (%)"
              fullWidth
              value={
                form.discount === 0 ? "" : (form.discount * 100).toString()
              }
              onChange={(e) =>
                setForm({ ...form, discount: +e.target.value / 100 })
              }
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              type="number"
              label="Giảm tối đa (VNĐ)"
              fullWidth
              value={form.maxDiscount === 0 ? "" : form.maxDiscount.toString()}
              onChange={(e) =>
                setForm({ ...form, maxDiscount: +e.target.value })
              }
            />
          </Grid>

          {/* Ngày bắt đầu/kết thúc */}
          <Grid size={{ xs: 6 }}>
            <DatePicker
              label="Ngày bắt đầu"
              value={form.startDate}
              onChange={(date) =>
                setForm({ ...form, startDate: date || dayjs() })
              }
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <DatePicker
              label="Ngày kết thúc"
              value={form.endDate}
              onChange={(date) =>
                setForm({ ...form, endDate: date || dayjs() })
              }
            />
          </Grid>

          {/* Sản phẩm áp dụng */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" mb={2}>
              Chọn sản phẩm áp dụng
            </Typography>
            {brands.map((brand) => (
              <Accordion key={brand.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{brand.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {brand.category.map((cat) => (
                    <Box key={cat.id} mb={2}>
                      <Typography variant="subtitle1" fontWeight={500} mb={1}>
                        {cat.name}
                      </Typography>
                      <FormGroup row>
                        {cat.products.map((product) => (
                          <FormControlLabel
                            key={`${cat.id}-${product.id}`}
                            control={
                              <Checkbox
                                checked={form.productIds.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                              />
                            }
                            label={product.name}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid size={{ xs: 12 }} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit}>
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
