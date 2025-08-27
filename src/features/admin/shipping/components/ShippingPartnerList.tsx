"use client";

import { useMemo, useState, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import {
  useCreateShippingPartner,
  useShippingPartners,
  useUpdateShippingPartner,
} from "../queries";
import type { ShippingPartner, CreateShippingPartner } from "../types";
import ModalShippingCreate from "./modals/ModalShippingCreate";
import ModalShippingEdit from "./modals/ModalShippingEdit";

const Alert = MuiAlert as React.ElementType;
const DEFAULT_ROWS = 5;

export default function ShippingPartnerList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);

  const { data: partners = [], isLoading, isError } = useShippingPartners();
  const { mutateAsync: createMut } = useCreateShippingPartner();
  const { mutateAsync: updateMut } = useUpdateShippingPartner();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ShippingPartner | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    type: "success" | "error";
    msg: string;
  }>({ open: false, type: "success", msg: "" });

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

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

  const handleCreate = async (data: CreateShippingPartner) => {
    try {
      await createMut(data);
      setSnack({ open: true, type: "success", msg: "Thêm đơn vị thành công" });
      setOpenCreate(false);
      setPage(0);
    } catch (e: any) {
      setSnack({ open: true, type: "error", msg: e?.message || "Thất bại" });
    }
  };

  const handleUpdate = async (data: {
    name: string;
    apiUrl: string | null;
    active: boolean;
  }) => {
    if (!selected) return;
    try {
      await updateMut({ id: selected.id, payload: data });
      setSnack({ open: true, type: "success", msg: "Cập nhật thành công" });
      setOpenEdit(false);
      setSelected(null);
    } catch (e: any) {
      setSnack({ open: true, type: "error", msg: e?.message || "Thất bại" });
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
                  <TableCell>Mã</TableCell>
                  <TableCell>API URL</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered
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
                    ))
                )}

                {!isLoading && !isError && filtered.length === 0 && (
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
          initialData={selected}
          onSubmit={handleUpdate}
        />
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key={`${snack.type}-${snack.msg}`}
      >
        <Alert severity={snack.type} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Card>
  );
}
