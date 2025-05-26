"use client";

import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Button from "@mui/material/Button";
import ModalFormShippingCreate from "@/model/shipping/ModalFormShippingCreate";
import ModalFormShippingEdit from "@/model/shipping/ModalFormShippingEdit";
import { useRouter } from "next/navigation";

interface ShippingPartner {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}

const fakePartners: ShippingPartner[] = [
  {
    id: 1,
    name: "Nhà xe Phương Trang",
    code: "INTERNAL",
    apiUrl: null,
    active: true,
  },
  {
    id: 2,
    name: "Giao Hàng Nhanh",
    code: "GHN",
    apiUrl: "https://api.ghn.vn",
    active: false,
  },
];

const ShippingPartnerList = () => {
  const [partners, setPartners] = useState<ShippingPartner[]>(fakePartners);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<ShippingPartner | null>(null);
  const router = useRouter();

  const handleEdit = (partner: ShippingPartner) => {
    router.push(`/admin/shippings?shippingId=${partner.id}`);
    setSelectedPartner(partner);
    setOpenEdit(true);
  };

  const handleAdd = () => {
    setOpenCreate(true);
  };

  return (
    <Card>
      <CardHeader
        title="Đơn vị vận chuyển"
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button variant="contained" onClick={handleAdd}>
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
                      sx={{
                        backgroundColor: "#ff700",
                        textTransform: "none",
                        fontWeight: 500,
                        px: 2,
                        py: 0.5,
                        fontSize: "0.8rem",
                        // "&:hover": {
                        //   backgroundColor: "#e46600",
                        // },
                      }}
                      onClick={() => handleEdit(partner)}
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
      />
      {selectedPartner && (
        <ModalFormShippingEdit
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          partner={selectedPartner}
        />
      )}
    </Card>
  );
};

export default ShippingPartnerList;
