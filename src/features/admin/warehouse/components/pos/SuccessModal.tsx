"use client";

import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { StoreOrder } from "../../types";
import { useToast } from "@/lib/toast/ToastContext";

const GOLD = "#FFB300";
const vnd  = (n: number) => n.toLocaleString("vi-VN") + "đ";

const PM_VN: Record<string, string> = {
  CASH: "💵 Tiền mặt",
  TRANSFER: "🏦 Chuyển khoản",
  CARD: "💳 Quẹt thẻ",
};

interface Props {
  order: StoreOrder;
  onNewOrder: () => void;
  onPrint: () => void;
  onViewDetail: () => void;
}

export default function SuccessModal({ order, onNewOrder, onPrint, onViewDetail }: Props) {
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderCode).catch(() => {});
    showToast("Đã copy mã đơn", "success");
  };

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      onClose={(_, reason) => { if (reason === "escapeKeyDown") onNewOrder(); }}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>Thanh toán thành công</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.25}>
              <Typography variant="body2" color="text.secondary">Mã đơn:</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: GOLD }}>
                {order.orderCode}
              </Typography>
              <Tooltip title="Copy mã đơn">
                <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2.5, py: 2 }}>
        <Stack spacing={2}>

          {/* ── Info grid ── */}
          <Box
            sx={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 1, bgcolor: "action.hover", borderRadius: 1, p: 1.5,
            }}
          >
            {[
              ["Khách hàng", order.customerName || "Khách vãng lai"],
              ["Số điện thoại", order.customerPhone || "—"],
              ["Kho",          order.warehouseName],
              ["Thời gian",    date],
              ["Thanh toán",   PM_VN[order.paymentMethod] ?? order.paymentMethod],
              ["Nhân viên",    order.createdBy || "—"],
            ].map(([label, value]) => (
              <Box key={label}>
                <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                <Typography variant="body2" fontWeight={500}>{value}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Items table ── */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 48 }}>SL</TableCell>
                  <TableCell align="right"  sx={{ fontWeight: 700 }}>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{item.productNameSnap}</Typography>
                      {item.variantSnap && (
                        <Typography variant="caption" color="text.secondary">{item.variantSnap}</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} sx={{ color: GOLD }}>
                        {vnd(item.totalPrice)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ── Summary ── */}
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
              <Typography variant="body2">{vnd(order.subtotal)}</Typography>
            </Stack>
            {order.discountAmount > 0 && (
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
                <Typography variant="body2" color="error.main">-{vnd(order.discountAmount)}</Typography>
              </Stack>
            )}
            <Divider sx={{ my: 0.75 }} />
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="subtitle2" fontWeight={700}>TỔNG CỘNG</Typography>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: GOLD }}>
                {vnd(order.totalAmount)}
              </Typography>
            </Stack>
            {order.paymentMethod === "CASH" && (
              <>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">Tiền nhận</Typography>
                  <Typography variant="body2">{vnd(order.amountPaid)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Tiền thừa</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    {vnd(order.amountChange)}
                  </Typography>
                </Stack>
              </>
            )}
          </Box>

        </Stack>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={onPrint}
          size="small"
        >
          In hóa đơn
        </Button>
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={onViewDetail}
          size="small"
        >
          Xem chi tiết
        </Button>
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={onNewOrder}
          sx={{ bgcolor: GOLD, color: "#000", fontWeight: 700, "&:hover": { bgcolor: "#E0A000" }, ml: "auto !important" }}
        >
          Đơn mới
        </Button>
      </DialogActions>
    </Dialog>
  );
}
