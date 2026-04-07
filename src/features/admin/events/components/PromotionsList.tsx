"use client";

import { useMemo, useState } from "react";
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from "@mui/material";
import { useToast } from "@/lib/toast/ToastContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import {
  useClosePromotion,
  useDeleteProductFromPromotion,
  useDeletePromotion,
  usePromotionProducts,
  usePromotions,
} from "../queries";
import type { Promotion, PromotionStatus } from "../types";

const STATUS_COLORS: Record<PromotionStatus, "success" | "warning" | "default" | "error"> = {
  ACTIVE:   "success",
  UPCOMING: "warning",
  EXPIRED:  "default",
  CLOSED:   "error",
};

const STATUS_LABELS: Record<PromotionStatus, string> = {
  ACTIVE:   "Đang chạy",
  UPCOMING: "Sắp diễn ra",
  EXPIRED:  "Đã kết thúc",
  CLOSED:   "Đã tắt",
};

function ProductsOfPromotion({ promoId }: { promoId: number }) {
  const { data: products = [] } = usePromotionProducts(promoId);
  const { mutateAsync: doDelete } = useDeleteProductFromPromotion();
  const { showToast } = useToast();

  const handleDelete = async (pid: number) => {
    try {
      await doDelete({ promotionId: promoId, productId: pid });
      showToast("Đã xoá sản phẩm khỏi khuyến mãi", "success");
    } catch (e: any) {
      showToast(e?.message || "Xoá thất bại", "error");
    }
  };

  return (
    <Grid container spacing={1} mt={0.5}>
      {products.length ? (
        products.map((p: any) => (
          <Grid key={p.id} size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="action.hover"
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
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            Không có sản phẩm nào
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default function PromotionsList() {
  const router = useRouter();
  const { data: promotions = [], isLoading, isError } = usePromotions();
  const { mutateAsync: doClose } = useClosePromotion();
  const { mutateAsync: doDelete } = useDeletePromotion();
  const { showToast } = useToast();

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "close" | "delete";
    id: number;
    name: string;
  } | null>(null);

  const list = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().trim();
    return promotions.slice().sort((a, b) => {
      const hit = (p: Promotion) =>
        norm(p.name).includes(keyword) ||
        (p.code ?? "").toLowerCase().includes(keyword) ||
        (p.startDate ?? "").includes(keyword) ||
        String(Math.round(p.discount * 100)) === keyword;
      const A = hit(a), B = hit(b);
      return A === B ? 0 : A ? -1 : 1;
    });
  }, [promotions, keyword]);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setConfirmOpen(false);
    try {
      if (pendingAction.type === "close") {
        await doClose(pendingAction.id);
        showToast("Đã đóng khuyến mãi sớm", "success");
      } else {
        await doDelete(pendingAction.id);
        showToast("Đã xoá khuyến mãi", "success");
      }
    } catch (e: any) {
      showToast(e?.message || "Thao tác thất bại", "error");
    }
    setPendingAction(null);
  };

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
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Danh sách khuyến mãi ({list.length})</Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/events?action=add")}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <Grid container spacing={3}>
        {list.map((promo) => {
          const status = (promo.status ?? "ACTIVE") as PromotionStatus;
          const canClose = status === "ACTIVE" || status === "UPCOMING";
          return (
            <Grid key={promo.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ opacity: status === "CLOSED" || status === "EXPIRED" ? 0.75 : 1 }}>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography fontWeight={700}>{promo.name}</Typography>
                      <Chip
                        label={STATUS_LABELS[status]}
                        color={STATUS_COLORS[status]}
                        size="small"
                      />
                      {!promo.isActive && status !== "CLOSED" && (
                        <Chip label="Tắt" color="error" size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                  subheader={`${promo.startDate} → ${promo.endDate}`}
                  action={
                    <Stack direction="row" spacing={0.5} mt={1} mr={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          router.push(`/admin/events?action=edit&id=${promo.id}`)
                        }
                      >
                        Sửa
                      </Button>
                      {canClose && (
                        <Tooltip title="Đóng ngay, giữ dữ liệu">
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => {
                              setPendingAction({ type: "close", id: promo.id, name: promo.name });
                              setConfirmOpen(true);
                            }}
                          >
                            Đóng
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip title="Xoá vĩnh viễn">
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setPendingAction({ type: "delete", id: promo.id, name: promo.name });
                            setConfirmOpen(true);
                          }}
                        >
                          Xoá
                        </Button>
                      </Tooltip>
                    </Stack>
                  }
                />
                <CardContent>
                  {promo.description && (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {promo.description}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    Giảm:{" "}
                    <strong>{(promo.discount * 100).toFixed(0)}%</strong>
                    {promo.maxDiscount > 0
                      ? `, tối đa ${promo.maxDiscount.toLocaleString("vi-VN")}₫`
                      : " (không giới hạn)"}
                  </Typography>
                  {promo.requiresCode && promo.code && (
                    <Chip
                      label={`Mã: ${promo.code}`}
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                  {!promo.requiresCode && (
                    <Chip
                      label="PUBLIC — tự động áp dụng"
                      color="info"
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  )}

                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" mb={0.5}>
                    Sản phẩm áp dụng:
                  </Typography>
                  <ProductsOfPromotion promoId={promo.id} />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {pendingAction?.type === "delete" ? "Xác nhận xoá" : "Xác nhận đóng sớm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingAction?.type === "delete"
              ? `Bạn có chắc muốn xoá vĩnh viễn khuyến mãi "${pendingAction?.name}"? Hành động này không thể hoàn tác.`
              : `Đóng sớm khuyến mãi "${pendingAction?.name}"? KM sẽ ngừng áp dụng ngay lập tức.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Huỷ</Button>
          <Button
            onClick={handleConfirm}
            color={pendingAction?.type === "delete" ? "error" : "warning"}
            variant="contained"
          >
            {pendingAction?.type === "delete" ? "Xoá" : "Đóng ngay"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
