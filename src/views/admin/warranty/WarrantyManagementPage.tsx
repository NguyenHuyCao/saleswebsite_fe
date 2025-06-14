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
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";

interface WarrantyClaim {
  id: number;
  issueDesc: string;
  status: string;
  resolutionNote: string | null;
  adminMessage: string | null;
  imageUrl: string;
  validWarranty: boolean;
  userName: string;
}

interface MetaData {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

const WarrantyManagementPage = () => {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<WarrantyClaim[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    page: 1,
    pageSize: 5,
    pages: 1,
    total: 0,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(
    null
  );
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/warranty_claims/admin?page=${page + 1}&size=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === 200) {
        setClaims(data.data.result);
        setMeta(data.data.meta);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách yêu cầu bảo hành:", err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const filtered = claims.filter((claim) => {
      return (
        claim.userName.toLowerCase().includes(keyword) ||
        claim.issueDesc.toLowerCase().includes(keyword) ||
        claim.status.toLowerCase().includes(keyword)
      );
    });
    setFilteredClaims(filtered);
    if (keyword) setPage(0);
  }, [claims, keyword]);

  const handleOpenDialog = (claim: WarrantyClaim) => {
    setSelectedClaim(claim);
    setStatus(claim.status);
    setNote(claim.resolutionNote || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClaim(null);
    setStatus("");
    setNote("");
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdate = async () => {
    if (!selectedClaim) return;
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("status", status);
      formData.append("resolutionNote", note);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/warranty_claim/${selectedClaim.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const result = await res.json();

      if (res.status === 200) {
        setSnackbar({ open: true, type: "success", message: result.message });
        fetchClaims();
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, type: "error", message: result.message });
        handleCloseDialog();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu cầu bảo hành:", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Đã xảy ra lỗi khi cập nhật.",
      });
      handleCloseDialog();
    }
  };

  return (
    <Card>
      <CardHeader
        title="Quản lý bảo hành"
        action={
          <Typography variant="body2">
            Xem và xử lý yêu cầu bảo hành từ người dùng
          </Typography>
        }
        titleTypographyProps={{ variant: "h6" }}
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
                {filteredClaims
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>{claim.id}</TableCell>
                      <TableCell>{claim.userName}</TableCell>
                      <TableCell>{claim.issueDesc}</TableCell>
                      <TableCell>{claim.status}</TableCell>
                      <TableCell>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/public/images/${claim.imageUrl}`}
                          alt="Ảnh lỗi"
                          width={60}
                          height={60}
                          style={{ objectFit: "contain" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenDialog(claim)}
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
            count={filteredClaims.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị"
            SelectProps={{
              MenuProps: {
                disableScrollLock: true,
              },
            }}
          />
        </Paper>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Cập nhật yêu cầu bảo hành</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Trạng thái"
              fullWidth
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
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
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={snackbar.type === "error" ? 6000 : 4000}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.type as "success" | "error"}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default WarrantyManagementPage;
