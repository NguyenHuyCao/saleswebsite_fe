"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Pagination,
  Stack,
  Snackbar,
  Alert as MuiAlert,
  Typography,
} from "@mui/material";

import Image from "next/image";
import ModalFormBrandCreate from "@/model/brand/ModalFormBrandCreate";
import ModalFormBrandEdit from "@/model/brand/ModalFormBrandEdit";

const Alert = MuiAlert as React.ElementType;

interface BrandData {
  id: number;
  name: string;
  logo: string;
  website?: string | null;
  originCountry?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

const BrandTablePage = () => {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandData | null>(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const fetchBrands = async (currentPage: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands?page=${currentPage}&size=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!data.data || !Array.isArray(data.data.result)) {
        throw new Error("Invalid API response format");
      }

      setBrands(data.data.result);
      setTotalPages(data.data.meta.pages);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setSnackbarMessage("Không thể tải danh sách thương hiệu");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handleOpenCreate = () => setOpenCreate(true);

  const handleOpenEdit = (brand: BrandData) => {
    setEditingBrand(brand);
    setOpenEdit(true);
  };

  const handleCreate = async (data: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("website", data.website);
      formData.append("originCountry", data.originCountry);
      if (data.logoFile) {
        formData.append("logo", data.logoFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        // 👇 Ghi lỗi nhẹ nhàng, không báo đỏ ở console
        console.warn("Lỗi khi thêm thương hiệu:", result.message);
        setSnackbarMessage(result.message || "Thêm thương hiệu thất bại");
        setSnackbarType("error");
        setOpenSnackbar(true);
        return;
      }

      setSnackbarMessage("Thêm thương hiệu thành công");
      setSnackbarType("success");
      setOpenSnackbar(true);

      setOpenCreate(false);
      setPage(1);
      fetchBrands(1); // refetch danh sách từ đầu
    } catch (error: any) {
      console.error("Lỗi hệ thống khi thêm thương hiệu:", error);
      setSnackbarMessage("Lỗi hệ thống. Vui lòng thử lại.");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleUpdate = async (data: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
  }) => {
    try {
      if (!editingBrand) return;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("website", data.website);
      formData.append("originCountry", data.originCountry);
      if (data.logoFile) {
        formData.append("logo", data.logoFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands/${editingBrand.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      const updatedBrand = await res.json();
      if (!res.ok)
        throw new Error(updatedBrand.message || "Lỗi không xác định");

      setSnackbarMessage("Cập nhật thương hiệu thành công");
      setSnackbarType("success");
      setOpenSnackbar(true);

      setOpenEdit(false);
      fetchBrands(page); // cập nhật danh sách ở trang hiện tại
    } catch (error: any) {
      console.error("Error updating brand:", error);
      setSnackbarMessage(error.message || "Lỗi khi cập nhật thương hiệu");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Thương hiệu sản phẩm"
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button variant="contained" onClick={handleOpenCreate}>
            Thêm thương hiệu
          </Button>
        }
      />
      <CardContent>
        <TableContainer style={{ minHeight: 394 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên thương hiệu</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Nguồn gốc</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Cập nhật gần nhất</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id} hover>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Image
                      alt="Logo Tương hiệu"
                      src={"/images/favicon.png"}
                      width={40}
                      height={40}
                    />
                    <Typography fontSize={14}>{brand.name}</Typography>
                  </TableCell>
                  <TableCell>{brand.website}</TableCell>
                  <TableCell>{brand.originCountry}</TableCell>
                  <TableCell>
                    {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {brand.updatedAt
                      ? new Date(brand.updatedAt).toLocaleDateString("vi-VN")
                      : "-"}
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
                      }}
                      onClick={() => handleOpenEdit(brand)}
                    >
                      Cập nhật
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Stack>
      </CardContent>

      <ModalFormBrandCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />

      <ModalFormBrandEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdate}
        initialData={editingBrand}
      />

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

export default BrandTablePage;
