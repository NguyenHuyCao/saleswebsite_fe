"use client";

import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useToast } from "@/lib/toast/ToastContext";
import Image from "next/image";
import { useMemo, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import {
  useUpdateWarrantyClaim,
  useWarrantyClaims,
} from "../../warranty/queries";
import type { WarrantyClaim, WarrantyStatus } from "../../warranty/types";

const WARRANTY_STATUS_OPTIONS = [
  { value: "",         label: "Tất cả trạng thái" },
  { value: "PENDING",  label: "Chờ xử lý" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
];

const STATUS_CHIP_COLOR: Record<string, "default" | "warning" | "success" | "error"> = {
  PENDING:  "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
};

function ClaimInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} component="div" sx={{ mt: 0.25 }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

export default function WarrantyManagementPage() {
  // data
  const { data, isLoading, isError } = useWarrantyClaims();
  const claims = (data?.result ?? []) as WarrantyClaim[];

  // table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [status, setStatus] = useState<WarrantyStatus | string>("");
  const [note, setNote] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  // lightbox state
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const { showToast } = useToast();

  // global search
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const hasFilter = Boolean(statusFilter);

  const clearFilters = () => {
    setStatusFilter("");
    setPage(0);
  };

  const filtered = useMemo(() => {
    let result = claims;

    if (keyword)
      result = result.filter((c) => {
        const k = keyword;
        return (
          (c.claimCode || "").toLowerCase().includes(k) ||
          (c.orderCode || "").toLowerCase().includes(k) ||
          (c.productName || "").toLowerCase().includes(k) ||
          (c.userName || "").toLowerCase().includes(k) ||
          (c.userEmail || "").toLowerCase().includes(k) ||
          (c.issueDesc || "").toLowerCase().includes(k) ||
          (c.status || "").toLowerCase().includes(k)
        );
      });

    if (statusFilter)
      result = result.filter((c) => c.status === statusFilter);

    return [...result].sort((a, b) => {
      const ta = new Date(a.createdAt ?? a.submittedAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? b.submittedAt ?? 0).getTime();
      return sortBy === "oldest" ? ta - tb : tb - ta;
    });
  }, [claims, keyword, statusFilter, sortBy]);

  const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const onChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // mutation
  const updateClaim = useUpdateWarrantyClaim();

  const openEdit = (claim: WarrantyClaim) => {
    setSelectedClaim(claim);
    setStatus(claim.status || "PENDING");
    setNote(claim.resolutionNote || "");
    setAdminMsg(claim.adminMessage || "");
    setOpenDialog(true);
  };

  const closeEdit = () => {
    setOpenDialog(false);
    setSelectedClaim(null);
    setStatus("");
    setNote("");
    setAdminMsg("");
  };

  const saveUpdate = async () => {
    if (!selectedClaim) return;
    try {
      await updateClaim.mutateAsync({
        claimId: selectedClaim.id,
        status,
        resolutionNote: note,
        adminMessage: adminMsg,
      });
      showToast("Cập nhật thành công", "success");
      closeEdit();
    } catch (e: any) {
      showToast(e?.message || "Cập nhật yêu cầu bảo hành thất bại", "error");
      closeEdit();
    }
  };

  // status counts for header
  const pendingCount  = claims.filter((c) => c.status === "PENDING").length;
  const approvedCount = claims.filter((c) => c.status === "APPROVED").length;
  const rejectedCount = claims.filter((c) => c.status === "REJECTED").length;

  // images helper
  const getImages = (claim: WarrantyClaim): string[] => {
    if (claim.imageUrls && claim.imageUrls.length > 0) return claim.imageUrls;
    if (claim.imageUrl) return [claim.imageUrl];
    return [];
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Quản lý bảo hành"
          titleTypographyProps={{ variant: "h6" }}
          subheader={
            !isLoading && !isError ? (
              <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                <Chip label={`Chờ xử lý: ${pendingCount}`}  size="small" color="warning" variant="outlined" />
                <Chip label={`Đã duyệt: ${approvedCount}`}  size="small" color="success" variant="outlined" />
                <Chip label={`Từ chối: ${rejectedCount}`}   size="small" color="error"   variant="outlined" />
              </Stack>
            ) : null
          }
          action={
            isLoading ? (
              <Typography variant="body2" color="text.secondary" sx={{ pt: 1.5, pr: 1 }}>Đang tải...</Typography>
            ) : isError ? (
              <Typography variant="body2" color="error" sx={{ pt: 1.5, pr: 1 }}>Không thể tải dữ liệu</Typography>
            ) : null
          }
        />
        <CardContent>
          {/* Filter bar */}
          <Box sx={{ mb: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sắp xếp</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sắp xếp" MenuProps={{ disableScrollLock: true }}>
                {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} label="Trạng thái" MenuProps={{ disableScrollLock: true }}>
                {WARRANTY_STATUS_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>

            {hasFilter && (
              <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </Box>

          {hasFilter && (
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
              {statusFilter && (
                <Chip
                  label={`Trạng thái: ${labelOf(WARRANTY_STATUS_OPTIONS, statusFilter)}`}
                  size="small"
                  onDelete={() => { setStatusFilter(""); setPage(0); }}
                />
              )}
            </Stack>
          )}

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Mã yêu cầu</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mã đơn hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mô tả lỗi</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ảnh</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Xử lý</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visible.map((claim) => {
                    const imgs = getImages(claim);
                    return (
                      <TableRow key={claim.id} hover>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                          {claim.claimCode ?? `#${claim.id}`}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                          {claim.orderCode ?? "—"}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 160 }}>
                          <Typography variant="body2" noWrap>{claim.productName ?? "—"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{claim.userName ?? "—"}</Typography>
                          <Typography variant="caption" color="text.secondary">{claim.userEmail ?? ""}</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" noWrap title={claim.issueDesc ?? ""}>{claim.issueDesc ?? "—"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={labelOf(WARRANTY_STATUS_OPTIONS, claim.status)}
                            color={STATUS_CHIP_COLOR[claim.status] ?? "default"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {imgs.length > 0 ? (
                            <Stack direction="row" spacing={0.5}>
                              {imgs.slice(0, 2).map((url, idx) => (
                                <Box
                                  key={idx}
                                  sx={{ position: "relative", cursor: "pointer", "&:hover img": { opacity: 0.8 } }}
                                  onClick={() => setLightboxUrl(url)}
                                >
                                  <Image
                                    src={url}
                                    alt={`Ảnh ${idx + 1}`}
                                    width={44}
                                    height={44}
                                    style={{ objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
                                  />
                                </Box>
                              ))}
                              {imgs.length > 2 && (
                                <Box
                                  sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                                  onClick={() => openEdit(claim)}
                                >
                                  +{imgs.length - 2}
                                </Box>
                              )}
                            </Stack>
                          ) : "—"}
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined" onClick={() => openEdit(claim)}>
                            Xử lý
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {isLoading ? "Đang tải..." : filtered.length === 0 ? "Không có dữ liệu" : null}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={filtered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_e, newPage) => setPage(newPage)}
              onRowsPerPageChange={onChangeRowsPerPage}
              labelRowsPerPage="Hiển thị"
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            />
          </Paper>
        </CardContent>
      </Card>

      {/* Dialog xử lý — 2 column */}
      {selectedClaim && (
        <Dialog open={openDialog} onClose={closeEdit} fullWidth maxWidth="md" scroll="paper">
          <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
            <Box>
              <Typography variant="h6" component="span">Xử lý yêu cầu bảo hành</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                {selectedClaim.claimCode ?? `#${selectedClaim.id}`}
              </Typography>
            </Box>
            <IconButton onClick={closeEdit} size="small"><CloseIcon /></IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Cột trái: thông tin claim (readonly) */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary">
                  Thông tin yêu cầu
                </Typography>

                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Trạng thái hiện tại" value={
                      <Chip
                        label={labelOf(WARRANTY_STATUS_OPTIONS, selectedClaim.status)}
                        color={STATUS_CHIP_COLOR[selectedClaim.status] ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    } />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Bảo hành hợp lệ" value={
                      <Chip
                        label={selectedClaim.validWarranty ? "Còn bảo hành" : "Hết bảo hành"}
                        color={selectedClaim.validWarranty ? "success" : "error"}
                        size="small"
                      />
                    } />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Mã đơn hàng" value={<span style={{ fontFamily: "monospace" }}>{selectedClaim.orderCode}</span>} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Ngày gửi" value={fmtDate(selectedClaim.submittedAt ?? selectedClaim.createdAt)} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <ClaimInfoRow label="Sản phẩm" value={selectedClaim.productName} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Khách hàng" value={selectedClaim.userName} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Email" value={selectedClaim.userEmail} />
                  </Grid>
                  {selectedClaim.userPhone && (
                    <Grid size={{ xs: 6 }}>
                      <ClaimInfoRow label="Điện thoại" value={selectedClaim.userPhone} />
                    </Grid>
                  )}
                  <Grid size={{ xs: 6 }}>
                    <ClaimInfoRow label="Thời hạn bảo hành" value={fmtDate(selectedClaim.warrantyExpiry)} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>
                  Mô tả sự cố
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap", color: "text.primary" }}>
                  {selectedClaim.issueDesc ?? "—"}
                </Typography>

                {/* Ảnh đính kèm */}
                {(() => {
                  const imgs = getImages(selectedClaim);
                  return imgs.length > 0 ? (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>
                        Ảnh đính kèm ({imgs.length})
                      </Typography>
                      <Stack direction="row" spacing={1.5} mt={1} flexWrap="wrap">
                        {imgs.map((url, idx) => (
                          <Box
                            key={idx}
                            sx={{ position: "relative", cursor: "zoom-in", borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider", "&:hover .zoom-icon": { opacity: 1 } }}
                            onClick={() => setLightboxUrl(url)}
                          >
                            <Image
                              src={url}
                              alt={`Ảnh ${idx + 1}`}
                              width={90}
                              height={90}
                              style={{ objectFit: "cover", display: "block" }}
                            />
                            <Box className="zoom-icon" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .2s" }}>
                              <ZoomInIcon sx={{ color: "#fff" }} />
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </>
                  ) : null;
                })()}
              </Grid>

              {/* Cột phải: form xử lý */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary">
                  Quyết định xử lý
                </Typography>

                <TextField
                  select
                  label="Trạng thái mới"
                  fullWidth
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                  sx={{ mb: 2 }}
                >
                  {WARRANTY_STATUS_OPTIONS.filter((o) => o.value && o.value !== "PENDING").map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Ghi chú xử lý (resolutionNote)"
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Lý do phê duyệt / từ chối, hướng dẫn tiếp theo..."
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Lời nhắn gửi khách hàng (tuỳ chọn)"
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={adminMsg}
                  onChange={(e) => setAdminMsg(e.target.value)}
                  placeholder="Lời nhắn thêm sẽ được gửi kèm trong email thông báo..."
                />

                <Box sx={{ mt: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Sau khi lưu, email thông báo sẽ được gửi tự động đến khách hàng.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 1.5 }}>
            <Button onClick={closeEdit} color="inherit">Huỷ</Button>
            <Button
              variant="contained"
              onClick={saveUpdate}
              disabled={updateClaim.isPending || !status}
            >
              {updateClaim.isPending ? "Đang lưu..." : "Lưu & gửi email"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Lightbox */}
      <Dialog open={Boolean(lightboxUrl)} onClose={() => setLightboxUrl(null)} maxWidth="md">
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setLightboxUrl(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 300 }}>
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt="Ảnh phóng to"
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", display: "block" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
