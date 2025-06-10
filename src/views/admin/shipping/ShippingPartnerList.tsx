// File: views/admin/shipping/ShippingPartnerList.tsx
"use client";

import { useEffect, useState, ChangeEvent, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Paper,
} from "@mui/material";
import ModalFormShippingCreate from "@/model/shipping/ModalFormShippingCreate";
import ModalFormShippingEdit from "@/model/shipping/ModalFormShippingEdit";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";

const Alert = MuiAlert as React.ElementType;

interface ShippingPartner {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}

const ShippingPartnerList = () => {
  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<ShippingPartner[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<ShippingPartner | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  const handleSnackbar = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const fetchPartners = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shipping_partners`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPartners(data.data || []);
      setTotalRows((data.data || []).length);
    } catch (error: any) {
      handleSnackbar(error.message || "Lỗi tải danh sách", "error");
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    const filtered = partners.filter((partner) => {
      const nameMatch = partner.name.toLowerCase().includes(keyword);
      const codeMatch = partner.code.toLowerCase().includes(keyword);
      const apiMatch = partner.apiUrl?.toLowerCase().includes(keyword) ?? false;
      const status = partner.active ? "hoạt động" : "tạm ngưng";
      const statusMatch = status.includes(keyword);
      return nameMatch || codeMatch || apiMatch || statusMatch;
    });

    setFilteredPartners(filtered);
    if (keyword) setPage(0);
  }, [partners, keyword]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCreate = async (data: {
    name: string;
    code: string;
    apiUrl: string | null;
    active: boolean;
  }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shipping_partners`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      handleSnackbar("Thêm đơn vị thành công", "success");
      setOpenCreate(false);
      fetchPartners();
    } catch (err: any) {
      handleSnackbar(err.message, "error");
    }
  };

  const handleUpdate = async (data: {
    name: string;
    apiUrl: string | null;
    active: boolean;
  }) => {
    if (!selectedPartner) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shipping_partners/${selectedPartner.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      handleSnackbar("Cập nhật thành công", "success");
      setOpenEdit(false);
      fetchPartners();
    } catch (err: any) {
      handleSnackbar(err.message, "error");
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
                {filteredPartners
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((partner) => (
                    <TableRow key={partner.id} hover>
                      <TableCell>{partner.id}</TableCell>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.code}</TableCell>
                      <TableCell>{partner.apiUrl || "-"}</TableCell>
                      <TableCell>
                        {partner.active ? "Hoạt động" : "Tạm ngưng"}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setOpenEdit(true);
                          }}
                        >
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPartners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị"
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          />
        </Paper>
      </CardContent>

      <ModalFormShippingCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />
      {selectedPartner && (
        <ModalFormShippingEdit
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleUpdate}
          initialData={selectedPartner}
        />
      )}

      <Snackbar
        key={
          snackbarType === "error"
            ? snackbarMessage
            : snackbarMessage + "-success"
        }
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ShippingPartnerList;
