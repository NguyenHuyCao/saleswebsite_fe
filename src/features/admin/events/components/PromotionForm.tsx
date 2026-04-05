"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Alert,
} from "@mui/material";
import { useToast } from "@/lib/toast/ToastContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useBrandsTree,
  usePromotion,
  usePromotionProducts,
  useUpsertPromotion,
} from "../queries";

type Props = { mode: "create" | "edit"; id?: string };

export default function PromotionForm({ mode, id }: Props) {
  const router = useRouter();
  const { data: brands = [] } = useBrandsTree();
  const { data: promo } = usePromotion(mode === "edit" ? id : undefined);
  const { data: applied = [] } = usePromotionProducts(
    mode === "edit" ? Number(id) : 0
  );

  const { showToast } = useToast();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [requiresCode, setRequiresCode] = useState(false);
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState<string>("");
  const [maxDiscount, setMaxDiscount] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(7, "day"));
  const [productIds, setProductIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // hydrate khi edit — dùng promo (PromotionResponse) làm nguồn chính
  useEffect(() => {
    if (promo && mode === "edit") {
      setName(promo.name);
      setDescription(promo.description ?? "");
      setIsActive(promo.isActive ?? true);
      setRequiresCode(promo.requiresCode);
      setCode(promo.code ?? "");
      setDiscountPct(String(Math.round(promo.discount * 100)));
      setMaxDiscount(String(promo.maxDiscount || ""));
      if (promo.startDate) setStartDate(dayjs(promo.startDate));
      if (promo.endDate) setEndDate(dayjs(promo.endDate));
      // Pre-select sản phẩm từ applicableProductIds (có ngay trong PromotionResponse)
      if (promo.applicableProductIds?.length) {
        setProductIds(promo.applicableProductIds);
      }
    }
  }, [promo, mode]);

  // Fallback: nếu promo chưa có applicableProductIds thì lấy từ /products endpoint
  useEffect(() => {
    if (mode === "edit" && applied?.length && productIds.length === 0) {
      setProductIds(applied.map((p: any) => p.id));
    }
  }, [mode, applied]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleProduct = (pid: number) =>
    setProductIds((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
    );

  const { mutateAsync: doUpsert, isPending } = useUpsertPromotion(
    mode === "edit" ? id : undefined
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Tên khuyến mãi không được để trống";
    const pct = Number(discountPct);
    if (!discountPct || isNaN(pct) || pct <= 0 || pct > 100)
      errs.discount = "Tỷ lệ giảm phải từ 1% đến 100%";
    if (requiresCode && !code.trim())
      errs.code = "Mã khuyến mãi là bắt buộc khi yêu cầu nhập mã";
    if (productIds.length === 0)
      errs.products = "Phải chọn ít nhất 1 sản phẩm áp dụng";
    if (endDate.isBefore(startDate))
      errs.date = "Ngày kết thúc phải sau ngày bắt đầu";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const payload = useMemo(
    () => ({
      name: name.trim(),
      description: description.trim() || null,
      isActive,
      requiresCode,
      code: requiresCode ? code.trim() : null,
      discount: discountPct ? Number(discountPct) / 100 : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      productIds,
    }),
    [name, description, isActive, requiresCode, code, discountPct, maxDiscount, startDate, endDate, productIds]
  );

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await doUpsert(payload);
      showToast(mode === "edit" ? "Cập nhật thành công" : "Tạo mới thành công", "success");
      if (mode === "edit") {
        setTimeout(() => router.push("/admin/events"), 1200);
      } else {
        setName(""); setDescription(""); setIsActive(true);
        setRequiresCode(false); setCode("");
        setDiscountPct(""); setMaxDiscount(""); setProductIds([]);
        setErrors({});
      }
    } catch (e: any) {
      showToast(e?.message || "Thất bại", "error");
    }
  };

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          {mode === "edit" ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi mới"}
        </Typography>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {Object.values(errors).map((e, i) => <div key={i}>{e}</div>)}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Tên */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Tên khuyến mãi *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Bật/Tắt */}
          <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="success"
                />
              }
              label={isActive ? "Đang bật" : "Đã tắt"}
            />
          </Grid>

          {/* Mô tả */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Mô tả khuyến mãi"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Giảm 20% cho tất cả máy cắt cỏ Honda..."
            />
          </Grid>

          {/* Yêu cầu mã */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={requiresCode}
                  onChange={(e) => setRequiresCode(e.target.checked)}
                />
              }
              label="Yêu cầu nhập mã (CODED)"
            />
            {requiresCode && (
              <TextField
                fullWidth
                label="Mã khuyến mãi *"
                sx={{ mt: 1 }}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                error={!!errors.code}
                helperText={errors.code || "VD: SUMMER20, FLASH50"}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            )}
          </Grid>

          {/* Tỷ lệ giảm */}
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              type="number"
              label="Tỷ lệ giảm (%) *"
              fullWidth
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              inputProps={{ min: 1, max: 100 }}
              error={!!errors.discount}
              helperText={errors.discount || "1 – 100"}
            />
          </Grid>

          {/* Giảm tối đa */}
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              type="number"
              label="Giảm tối đa (VNĐ)"
              fullWidth
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              inputProps={{ min: 0 }}
              helperText="0 = không giới hạn"
            />
          </Grid>

          {/* Ngày bắt đầu */}
          <Grid size={{ xs: 6 }}>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(d) => d && setStartDate(d)}
            />
          </Grid>

          {/* Ngày kết thúc */}
          <Grid size={{ xs: 6 }}>
            <DatePicker
              label="Ngày kết thúc"
              value={endDate}
              onChange={(d) => d && setEndDate(d)}
              minDate={startDate}
            />
            {errors.date && (
              <Typography color="error" variant="caption">{errors.date}</Typography>
            )}
          </Grid>

          {/* Sản phẩm áp dụng */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" mb={1}>
              Chọn sản phẩm áp dụng *
            </Typography>
            {errors.products && (
              <Typography color="error" variant="caption" display="block" mb={1}>
                {errors.products}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Đã chọn: {productIds.length} sản phẩm
            </Typography>
            {brands.map((b) => (
              <Accordion key={b.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{b.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {b.category.map((c) => (
                    <Box key={c.id} mb={2}>
                      <Typography variant="subtitle1" fontWeight={500} mb={1}>
                        {c.name}
                      </Typography>
                      <FormGroup row>
                        {c.products.map((p) => (
                          <FormControlLabel
                            key={`${c.id}-${p.id}`}
                            control={
                              <Checkbox
                                checked={productIds.includes(p.id)}
                                onChange={() => toggleProduct(p.id)}
                              />
                            }
                            label={p.name}
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
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => router.push("/admin/events")}
            >
              Huỷ
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {mode === "edit" ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
