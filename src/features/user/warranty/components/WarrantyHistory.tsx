"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Grid,
  Skeleton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Image from "next/image";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import {
  getUserWarrantyRequests,
  cancelWarrantyRequest,
  type WarrantyClaimResponse,
} from "../api";

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELLED: "Đã huỷ",
};

const normStatus = (s: string) => (s ?? "").toUpperCase();
const statusChipLabel = (s: string) => statusLabel[normStatus(s)] ?? s;

const statusColor = (
  status: string
): "default" | "warning" | "success" | "error" | "info" => {
  switch (normStatus(status)) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    case "CANCELLED":
      return "default";
    default:
      return "info";
  }
};

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textTransform: "uppercase",
          letterSpacing: ".5px",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25 }} component="div">
        {value ?? <span style={{ color: "gray" }}>—</span>}
      </Typography>
    </Box>
  );
}

function HistorySkeleton() {
  return (
    <Box sx={{ my: 6 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={220} height={32} />
      </Stack>
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ p: 2, borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default function WarrantyHistory() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [requests, setRequests] = useState<WarrantyClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WarrantyClaimResponse | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const fetchRequests = useCallback(() => {
    setLoading(true);
    getUserWarrantyRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCancel = async (id: number) => {
    setCancelling(true);
    try {
      await cancelWarrantyRequest(id);
      setSnackbar({ open: true, type: "success", message: "Đã huỷ yêu cầu bảo hành." });
      setSelected(null);
      fetchRequests();
    } catch (err: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: err?.message || "Không thể huỷ yêu cầu. Vui lòng thử lại.",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <HistorySkeleton />;
  if (!requests.length) return null;

  const getImages = (r: WarrantyClaimResponse): string[] => {
    if (r.imageUrls && r.imageUrls.length > 0) return r.imageUrls;
    if (r.imageUrl) return [r.imageUrl];
    return [];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Box sx={{ my: 6 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <HistoryIcon sx={{ color: "#0d47a1" }} />
            <Typography variant="h5" fontWeight={800} color="#333">
              Lịch sử yêu cầu bảo hành
            </Typography>
          </Stack>

          {/* Mobile: card list */}
          {isMobile ? (
            <Stack spacing={2}>
              {requests.map((req) => (
                <Card key={req.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ pb: "12px !important" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ fontFamily: "monospace" }}
                        >
                          {req.claimCode ?? `#${req.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {req.orderCode ?? "—"}
                        </Typography>
                      </Box>
                      <Chip
                        label={statusChipLabel(req.status)}
                        size="small"
                        color={statusColor(req.status)}
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1, mb: 0.5 }}
                      noWrap
                    >
                      {req.productName ?? "—"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fmtDate(req.submittedAt ?? req.createdAt)}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setSelected(req)}
                      >
                        Xem
                      </Button>
                      {req.status === "PENDING" && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<CancelOutlinedIcon />}
                          onClick={() => handleCancel(req.id)}
                          disabled={cancelling}
                        >
                          Huỷ
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            /* Desktop: table */
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Mã yêu cầu</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mã đơn hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày gửi</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Trạng thái
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} hover>
                      <TableCell
                        sx={{ fontWeight: 600, fontFamily: "monospace" }}
                      >
                        {req.claimCode ?? `#${req.id}`}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                        {req.orderCode ?? "—"}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {req.productName ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {fmtDate(req.submittedAt ?? req.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusChipLabel(req.status)}
                          size="small"
                          color={statusColor(req.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => setSelected(req)}
                          >
                            Xem
                          </Button>
                          {req.status === "PENDING" && (
                            <Button
                              size="small"
                              color="error"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => handleCancel(req.id)}
                              disabled={cancelling}
                            >
                              Huỷ
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </motion.div>

      {/* Detail modal */}
      {selected && (
        <Dialog
          open={Boolean(selected)}
          onClose={() => setSelected(null)}
          fullWidth
          maxWidth="sm"
          scroll="paper"
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Box>
              <Typography variant="h6" component="span">
                Chi tiết yêu cầu bảo hành
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "monospace" }}
              >
                {selected.claimCode ?? `#${selected.id}`}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelected(null)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <DetailRow
                  label="Trạng thái"
                  value={
                    <Chip
                      label={statusChipLabel(selected.status)}
                      size="small"
                      color={statusColor(selected.status)}
                    />
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailRow
                  label="Ngày gửi"
                  value={fmtDate(selected.submittedAt ?? selected.createdAt)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailRow label="Sản phẩm" value={selected.productName} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailRow
                  label="Mã đơn hàng"
                  value={
                    <span style={{ fontFamily: "monospace" }}>
                      {selected.orderCode}
                    </span>
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailRow
                  label="Hết hạn bảo hành"
                  value={fmtDate(selected.warrantyExpiry)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <DetailRow
              label="Mô tả sự cố"
              value={
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {selected.issueDesc ?? "—"}
                </Typography>
              }
            />

            {(() => {
              const imgs = getImages(selected);
              return imgs.length > 0 ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: ".5px",
                      fontWeight: 700,
                    }}
                  >
                    Ảnh đính kèm ({imgs.length})
                  </Typography>
                  <Stack direction="row" spacing={1.5} mt={1} flexWrap="wrap">
                    {imgs.map((url, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: "relative",
                          cursor: "zoom-in",
                          borderRadius: 1,
                          overflow: "hidden",
                          border: "1px solid #ddd",
                          "&:hover .zoom-overlay": { opacity: 1 },
                        }}
                        onClick={() => setLightboxUrl(url)}
                      >
                        <Image
                          src={url}
                          alt={`Ảnh ${idx + 1}`}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", display: "block" }}
                        />
                        <Box
                          className="zoom-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0,0,0,.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity .2s",
                          }}
                        >
                          <ZoomInIcon sx={{ color: "#fff", fontSize: 20 }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </>
              ) : null;
            })()}

            {(selected.resolutionNote || selected.adminMessage) && (
              <>
                <Divider sx={{ my: 2 }} />
                {selected.resolutionNote && (
                  <DetailRow
                    label="Ghi chú xử lý"
                    value={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {selected.resolutionNote}
                      </Typography>
                    }
                  />
                )}
                {selected.adminMessage && (
                  <DetailRow
                    label="Lời nhắn từ bộ phận hỗ trợ"
                    value={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {selected.adminMessage}
                      </Typography>
                    }
                  />
                )}
              </>
            )}

            {selected.updatedAt && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 1, display: "block" }}
              >
                Cập nhật lần cuối: {fmtDate(selected.updatedAt)}
              </Typography>
            )}

            {selected.status === "PENDING" && (
              <>
                <Divider sx={{ my: 2 }} />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelOutlinedIcon />}
                  onClick={() => handleCancel(selected.id)}
                  disabled={cancelling}
                  fullWidth
                >
                  {cancelling ? "Đang huỷ..." : "Huỷ yêu cầu này"}
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Lightbox */}
      <Dialog
        open={Boolean(lightboxUrl)}
        onClose={() => setLightboxUrl(null)}
        maxWidth="md"
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setLightboxUrl(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 280,
          }}
        >
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt="Ảnh phóng to"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <GlobalSnackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
