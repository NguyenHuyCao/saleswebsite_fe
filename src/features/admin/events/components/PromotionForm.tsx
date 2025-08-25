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
  Snackbar,
  Alert,
} from "@mui/material";
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

  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  // form state
  const [name, setName] = useState("");
  const [requiresCode, setRequiresCode] = useState(false);
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState<string>(""); // UI hiển thị %
  const [maxDiscount, setMaxDiscount] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(7, "day"));
  const [productIds, setProductIds] = useState<number[]>([]);

  // hydrate khi edit
  useEffect(() => {
    if (promo && mode === "edit") {
      setName(promo.name);
      setRequiresCode(promo.requiresCode);
      setCode(promo.code ?? "");
      setDiscountPct(String(Math.round(promo.discount * 100)));
      setMaxDiscount(String(promo.maxDiscount || ""));
      setStartDate(dayjs(promo.startDate));
      setEndDate(dayjs(promo.endDate));
    }
  }, [promo, mode]);

  useEffect(() => {
    if (mode === "edit" && applied?.length) {
      setProductIds(applied.map((p: any) => p.id));
    }
  }, [mode, applied]);

  const toggleProduct = (pid: number) =>
    setProductIds((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
    );

  const { mutateAsync: doUpsert, isPending } = useUpsertPromotion(
    mode === "edit" ? id : undefined
  );

  const payload = useMemo(
    () => ({
      name,
      requiresCode,
      code: requiresCode ? code : null,
      discount: discountPct ? Number(discountPct) / 100 : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      productIds,
    }),
    [
      name,
      requiresCode,
      code,
      discountPct,
      maxDiscount,
      startDate,
      endDate,
      productIds,
    ]
  );

  const handleSubmit = async () => {
    try {
      await doUpsert(payload);
      setSnack({
        open: true,
        type: "success",
        msg: mode === "edit" ? "Cập nhật thành công" : "Tạo mới thành công",
      });
      if (mode === "edit") setTimeout(() => router.push("/admin/events"), 1200);
      else {
        setName("");
        setRequiresCode(false);
        setCode("");
        setDiscountPct("");
        setMaxDiscount("");
        setProductIds([]);
      }
    } catch (e: any) {
      setSnack({ open: true, type: "error", msg: e?.message || "Thất bại" });
    }
  };

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          {mode === "edit" ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi mới"}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{xs:12, md:6}} >
            <TextField
              label="Tên khuyến mãi"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid size={{xs:12, md:6}} >
            <FormControlLabel
              control={
                <Checkbox
                  checked={requiresCode}
                  onChange={(e) => setRequiresCode(e.target.checked)}
                />
              }
              label="Yêu cầu mã khuyến mãi"
            />
            {requiresCode && (
              <TextField
                fullWidth
                label="Mã khuyến mãi"
                sx={{ mt: 2 }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            )}
          </Grid>

          <Grid size={{xs:6}}>
            <TextField
              type="number"
              label="Tỷ lệ giảm (%)"
              fullWidth
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
            />
          </Grid>
          <Grid size={{xs:6}}>
            <TextField
              type="number"
              label="Giảm tối đa (VNĐ)"
              fullWidth
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
          </Grid>

          <Grid size={{xs:6}}>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(d) => d && setStartDate(d)}
            />
          </Grid>
          <Grid size={{xs:6}}>
            <DatePicker
              label="Ngày kết thúc"
              value={endDate}
              onChange={(d) => d && setEndDate(d)}
            />
          </Grid>

          <Grid size={{xs:12}} >
            <Typography variant="h6" mb={2}>
              Chọn sản phẩm áp dụng
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

          <Grid size={{xs:12}}  textAlign="center">
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

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.type} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
