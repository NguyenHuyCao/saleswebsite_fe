"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import {
  useDeleteProductFromPromotion,
  usePromotionProducts,
  usePromotions,
} from "../queries";
import type { Promotion } from "../types";

function ProductsOfPromotion({ promoId }: { promoId: number }) {
  const { data: products = [] } = usePromotionProducts(promoId);
  const { mutateAsync: doDelete } = useDeleteProductFromPromotion();
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  const handleDelete = async (pid: number) => {
    try {
      await doDelete({ promotionId: promoId, productId: pid });
      setSnack({
        open: true,
        type: "success",
        msg: "Đã xoá sản phẩm khỏi khuyến mãi",
      });
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.message || "Xoá thất bại",
      });
    }
  };

  return (
    <>
      <Grid container spacing={2} mt={1}>
        {products.length ? (
          products.map((p: any) => (
            <Grid key={p.id} size={{xs:12}}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f9f9f9"
                p={1.5}
                borderRadius={2}
              >
                <Typography variant="body2">{p.name}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(p.id)}
                >
                  Xoá
                </Button>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid size={{xs:12}}>
            <Typography variant="body2" color="text.secondary">
              Không có sản phẩm nào
            </Typography>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.type} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function PromotionsList() {
  const router = useRouter();
  const { data: promotions = [], isLoading, isError } = usePromotions();
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const list = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().trim();
    return promotions.slice().sort((a, b) => {
      const hit = (p: Promotion) =>
        norm(p.name).includes(keyword) ||
        (p.code ?? "").toLowerCase().includes(keyword) ||
        p.startDate.includes(keyword) ||
        String(Math.round(p.discount * 100)) === keyword;
      const A = hit(a),
        B = hit(b);
      return A === B ? 0 : A ? -1 : 1;
    });
  }, [promotions, keyword]);

  if (isLoading || isError) {
    return (
      <Box p={3}>
        <Typography>
          {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between">
        <Typography variant="h5">Danh sách khuyến mãi</Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/events?action=add")}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <Grid container spacing={3}>
        {list.map((promo) => (
          <Grid key={promo.id} size={{xs:12, md:6}} >
            <Card>
              <CardHeader
                title={promo.name}
                subheader={`Từ ${promo.startDate} đến ${promo.endDate}`}
                action={
                  <Button
                    size="small"
                    onClick={() =>
                      router.push(`/admin/events?action=edit&id=${promo.id}`)
                    }
                  >
                    Cập nhật
                  </Button>
                }
              />
              <CardContent>
                <Typography variant="body2">
                  Giảm: {(promo.discount * 100).toFixed(0)}%, tối đa{" "}
                  {promo.maxDiscount.toLocaleString()}₫
                </Typography>
                {promo.requiresCode && promo.code && (
                  <Chip
                    label={`Mã: ${promo.code}`}
                    color="warning"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Sản phẩm áp dụng:</Typography>

                <ProductsOfPromotion promoId={promo.id} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
