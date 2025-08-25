// src/features/admin/warranty/components/WarrantyManagementPage.tsx
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
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import { apiListWarrantyClaims, apiUpdateWarrantyClaim } from "../api";
import type { WarrantyClaim, WarrantyStatus } from "../types";

const STATUS_OPTIONS: WarrantyStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export default function WarrantyManagementPage() {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(
    null
  );
  const [status, setStatus] = useState<WarrantyStatus | string>("");
  const [note, setNote] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  // load 1 lần, lấy nhiều nhất có thể rồi lọc - phân trang ở client
  useEffect(() => {
    apiListWarrantyClaims()
      .then(({ result }) => setClaims(result))
      .catch((e) => console.error(e));
  }, []);

  const filtered = useMemo(
    () =>
      claims.filter((c) => {
        const k = keyword;
        return (
          c.userName?.toLowerCase().includes(k) ||
          c.issueDesc?.toLowerCase().includes(k) ||
          c.status?.toLowerCase().includes(k)
        );
      }),
    [claims, keyword]
  );

  useEffect(() => setPage(0), [keyword]);

  const visible = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const onChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const saveUpdate = async () => {
    if (!selectedClaim) return;
    try {
      await apiUpdateWarrantyClaim(selectedClaim.id, status, note);
      setSnackbar({
        open: true,
        type: "success",
        message: "Cập nhật thành công",
      });
      // cập nhật local list cho nhanh
      setClaims((prev) =>
        prev.map((c) =>
          c.id === selectedClaim.id ? { ...c, status, resolutionNote: note } : c
        )
      );
      closeEdit();
    } catch (e: any) {
      setSnackbar({ open: true, type: "error", message: e.message });
      closeEdit();
    }
  };

  return (
    <Card>
      <CardHeader
        title="Quản lý bảo hành"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Typography variant="body2">
            Xem và xử lý yêu cầu bảo hành từ người dùng
          </Typography>
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
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
                    <TableCell>{claim.id}</TableCell>
                    <TableCell>{claim.userName}</TableCell>
                    <TableCell>{claim.issueDesc}</TableCell>
                    <TableCell>{claim.status}</TableCell>
                    <TableCell>
                      <Image
                        src={claim.imageUrl}
                        alt="Ảnh lỗi"
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
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
            <Button variant="contained" onClick={saveUpdate}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={snackbar.type === "error" ? 6000 : 4000}
        >
          <Alert
            severity={snackbar.type}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
