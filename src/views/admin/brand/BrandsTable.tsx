// ** React & MUI Imports
"use client";

import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteBrand from "@/model/brand/ConfirmDeleteBrand";
import ModalFormBrandCreate from "@/model/brand/ModalFormBrandCreate";
import ModalFormBrandEdit from "@/model/brand/ModalFormBrandEdit";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { Typography } from "@mui/material";

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleOpenEdit = (brand: BrandData) => {
    setEditingBrand(brand);
    setOpenEdit(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    setBrands((prev) => prev.filter((b) => b.id !== deleteConfirmId));
    setDeleteConfirmId(null);
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
      const newBrand = await res.json();
      setBrands((prev) => [...prev, newBrand.data]);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error creating brand:", error);
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
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id ? { ...b, ...updatedBrand.data } : b
        )
      );
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating brand:", error);
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
        <TableContainer>
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
                      src={`/images/favicon.png`}
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
                    <IconButton
                      color="warning"
                      onClick={() => handleOpenEdit(brand)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(brand.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
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

      <ConfirmDeleteBrand
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </Card>
  );
};

export default BrandTablePage;
