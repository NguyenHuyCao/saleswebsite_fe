// src/features/admin/shipping/components/ShippingPartnerList.tsx
"use client";

import { useCallback, useEffect, useMemo, useState, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import {
  apiCreatePartner,
  apiListPartners,
  apiUpdatePartner,
} from "../../shipping/api";
import type { ShippingPartner } from "../../shipping/types";
import ModalShippingCreate from "./modals/ModalShippingCreate";
import ModalShippingEdit from "./modals/ModalShippingEdit";

const Alert = MuiAlert as React.ElementType;

export default function ShippingPartnerList() {
  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ShippingPartner | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const fetchPartners = useCallback(async () => {
    try {
      const list = await apiListPartners();
      setPartners(list);
    } catch (e: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: e.message || "Lỗi tải danh sách",
      });
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const filtered = useMemo(() => {
    if (!keyword) return partners;
    return partners.filter((p) => {
      const statusVi = p.active ? "hoạt động" : "tạm ngưng";
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword) ||
        (p.apiUrl ?? "").toLowerCase().includes(keyword) ||
        statusVi.includes(keyword)
      );
    });
  }, [partners, keyword]);

  useEffect(() => {
    setPage(0);
  }, [keyword]);

  const handleCreate = async (data: {
    name: string;
    code: string;
    apiUrl: string | null;
    active: boolean;
  }) => {
    try {
      await apiCreatePartner(data);
      setSnackbar({
        open: true,
        type: "success",
        message: "Thêm đơn vị thành công",
      });
      setOpenCreate(false);
      fetchPartners();
    } catch (e: any) {
      setSnackbar({ open: true, type: "error", message: e.message });
    }
  };

  const handleUpdate = async (data: {
    name: string;
    apiUrl: string | null;
    active: boolean;
  }) => {
    if (!selected) return;
    try {
      await apiUpdatePartner(selected.id, data);
      setSnackbar({
        open: true,
        type: "success",
        message: "Cập nhật thành công",
      });
      setOpenEdit(false);
      setSelected(null);
      fetchPartners();
    } catch (e: any) {
      setSnackbar({ open: true, type: "error", message: e.message });
    }
  };

  return (
    <Card>
      <CardHeader
        title="Đơn vị vận chuyển"
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Thêm đơn vị vận chuyển
          </Button>
        }
      />
      <CardContent>
        <Paper>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên đơn vị</TableCell>
                  <TableCell>Mã đơn vị</TableCell>
                  <TableCell>API URL</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.code}</TableCell>
                      <TableCell>{p.apiUrl || "-"}</TableCell>
                      <TableCell>
                        {p.active ? "Hoạt động" : "Tạm ngưng"}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelected(p);
                            setOpenEdit(true);
                          }}
                        >
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box py={6} textAlign="center">
                        <Typography>Không có dữ liệu</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, p) => setPage(p)}
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            labelRowsPerPage="Hiển thị"
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          />
        </Paper>
      </CardContent>

      <ModalShippingCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />
      {selected && (
        <ModalShippingEdit
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setSelected(null);
          }}
          onSubmit={handleUpdate}
          initialData={selected}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key={snackbar.type + snackbar.message}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
