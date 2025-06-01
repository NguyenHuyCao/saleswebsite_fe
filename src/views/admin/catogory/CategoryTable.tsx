"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  TablePagination,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

import ModalEditCategory from "@/model/category/ModalEditCategory";
import ModalCreateCategory from "@/model/category/ModalCreateCategory";

const Alert = MuiAlert as React.ElementType;

interface CategoryData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

const CategoryTablePage = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories?page=${
          page + 1
        }&size=${rowsPerPage}`,
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

      setCategories(data.data.result);
      setTotalRows(data.data.meta.total);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSave = async (name: string) => {
    try {
      if (editingCategory) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ name }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi không xác định");

        setSuccessMessage("Cập nhật danh mục thành công");
        setSnackbarType("success");
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ name }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi không xác định");

        setSuccessMessage("Thêm danh mục thành công");
        setSnackbarType("success");

        setPage(0);
      }

      setOpenSnackbar(true);
      setOpenModal(false);
      fetchCategories();
    } catch (error: any) {
      setErrorMessage(error.message || "Lỗi không xác định");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Danh mục sản phẩm"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Button variant="contained" onClick={handleOpenCreate}>
            Thêm danh mục
          </Button>
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
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
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenEdit(category)}
                        sx={{ textTransform: "none", fontWeight: 500 }}
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
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CardContent>

      {editingCategory ? (
        <ModalEditCategory
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSave}
          initialName={editingCategory.name}
        />
      ) : (
        <ModalCreateCategory
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSave}
        />
      )}

      <Snackbar
        key={snackbarType === "error" ? errorMessage : successMessage}
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
          {snackbarType === "error" ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default CategoryTablePage;
