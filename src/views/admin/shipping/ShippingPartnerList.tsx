// File: views/admin/shipping/ShippingPartnerList.tsx
"use client";

import { useEffect, useState } from "react";
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
  Button,
} from "@mui/material";
import ModalFormShippingCreate from "@/model/shipping/ModalFormShippingCreate";
import ModalFormShippingEdit from "@/model/shipping/ModalFormShippingEdit";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

interface ShippingPartner {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}

const ShippingPartnerList = () => {
  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<ShippingPartner | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbar = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setOpenSnackbar(true);
  };

  const fetchPartners = async () => {
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
      setPartners(data.data);
    } catch (error: any) {
      handleSnackbar(error.message || "Lỗi tải danh sách", "error");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

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
        <TableContainer>
          <Table>
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
              {partners.map((partner) => (
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
                      size="small"
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

      <AlertSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </Card>
  );
};

export default ShippingPartnerList;
