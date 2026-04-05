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
} from "@mui/material";
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

const STATUS_OPTIONS: WarrantyStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export default function WarrantyManagementPage() {
  // data
  const { data, isLoading, isError } = useWarrantyClaims();
  const claims = (data?.result ?? []) as WarrantyClaim[];

  // table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(
    null
  );
  const [status, setStatus] = useState<WarrantyStatus | string>("");
  const [note, setNote] = useState("");

  const { showToast } = useToast();

  // global search
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const filtered = useMemo(() => {
    if (!keyword) return claims;
    return claims.filter((c) => {
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
  }, [claims, keyword]);

  const visible = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    setOpenDialog(true);
  };

  const closeEdit = () => {
    setOpenDialog(false);
    setSelectedClaim(null);
    setStatus("");
    setNote("");
  };

  const saveUpdate = async () => {
    if (!selectedClaim) return;
    try {
      await updateClaim.mutateAsync({
        claimId: selectedClaim.id,
        status,
        resolutionNote: note,
      });
      showToast("Cập nhật thành công", "success");
      closeEdit();
    } catch (e: any) {
      showToast(e?.message || "Cập nhật yêu cầu bảo hành thất bại", "error");
      closeEdit();
    }
  };

  return (
    <Card>
      <CardHeader
        title="Quản lý bảo hành"
        titleTypographyProps={{ variant: "h6" }}
        action={
          isLoading ? (
            <Typography variant="body2" color="text.secondary">
              Đang tải...
            </Typography>
          ) : isError ? (
            <Typography variant="body2" color="error">
              Không thể tải dữ liệu
            </Typography>
          ) : null
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã yêu cầu</TableCell>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Mô tả lỗi</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell align="center">Cập nhật</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                      {claim.claimCode ?? `#${claim.id}`}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                      {claim.orderCode ?? "—"}
                    </TableCell>
                    <TableCell>{claim.productName ?? "—"}</TableCell>
                    <TableCell>{claim.userName ?? claim.userEmail ?? "—"}</TableCell>
                    <TableCell>{claim.issueDesc}</TableCell>
                    <TableCell>{claim.status}</TableCell>
                    <TableCell>
                      {claim.imageUrl ? (
                        <Image
                          src={claim.imageUrl}
                          alt="Ảnh lỗi"
                          width={60}
                          height={60}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => openEdit(claim)}
                      >
                        Cập nhật
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      {isLoading
                        ? "Đang tải..."
                        : filtered.length === 0
                        ? "Không có dữ liệu"
                        : null}
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

        {/* Dialog cập nhật */}
        <Dialog open={openDialog} onClose={closeEdit} fullWidth maxWidth="sm">
          <DialogTitle>Cập nhật yêu cầu bảo hành</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Trạng thái"
              fullWidth
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Giải pháp / Ghi chú xử lý"
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit}>Hủy</Button>
            <Button
              variant="contained"
              onClick={saveUpdate}
              disabled={updateClaim.isPending}
            >
              {updateClaim.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>

      </CardContent>
    </Card>
  );
}
