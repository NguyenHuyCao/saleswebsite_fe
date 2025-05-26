// ** React & MUI Imports
"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import ModalFormCategory from "@/model/category/ModalFormCategory";
import ConfirmDeleteCategory from "@/model/category/ConfirmDeleteCategory";

interface CategoryData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

const sampleData: CategoryData[] = [
  {
    id: 1,
    name: "Máy cắt cỏ adf",
    createdAt: "2025-05-20T11:53:52.555381Z",
    updatedAt: null,
  },
];

const CategoryTablePage = () => {
  const [categories, setCategories] = useState<CategoryData[]>(sampleData);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    setCategories((prev) => prev.filter((cat) => cat.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleSave = (name: string) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name, updatedAt: new Date().toISOString() }
            : cat
        )
      );
    } else {
      const newCategory: CategoryData = {
        id: Date.now(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setOpenModal(false);
  };

  return (
    <Card>
      <CardHeader
        title="Danh mục sản phẩm"
        titleTypographyProps={{
          variant: "h5",
          sx: { fontWeight: 600, color: "primary.main" },
        }}
        action={
          <Button variant="contained" onClick={handleOpenCreate}>
            Thêm danh mục
          </Button>
        }
      />
      <CardContent>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên danh mục</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Cập nhật gần nhất</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {category.updatedAt
                        ? new Date(category.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="warning"
                        onClick={() => handleOpenEdit(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </CardContent>

      <ModalFormCategory
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSave}
        initialName={editingCategory?.name}
      />

      <ConfirmDeleteCategory
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </Card>
  );
};

export default CategoryTablePage;
