"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import Image from "next/image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ModalEditCategory from "@/model/category/ModalEditCategory";

const Alert = MuiAlert as React.ElementType;

interface CategoryData {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string | null;
}

const CategoryTablePage = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories?page=${
          page + 1
        }&size=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data.result))
        throw new Error("Invalid API response format");
      setCategories(data.data.result);
      setTotalRows(data.data.meta.total);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateCategory = async (
    id: number,
    name: string,
    imageFile?: File
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi cập nhật danh mục");

      setSuccessMessage("Cập nhật danh mục thành công");
      setSnackbarType("success");
      setOpenSnackbar(true);
      fetchCategories(); // cập nhật lại bảng
    } catch (error: any) {
      setErrorMessage(error.message || "Lỗi không xác định");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", newName);
      if (newImage) formData.append("image", newImage);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi không xác định");

      setSuccessMessage("Thêm danh mục thành công");
      setSnackbarType("success");
      setOpenSnackbar(true);
      setOpenModal(false);
      setNewName("");
      setNewImage(null);
      setPreview(null);
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
          <Button variant="contained" onClick={() => setOpenModal(true)}>
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
                  <TableCell>Ảnh đại diện</TableCell>
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
                    <TableCell>
                      <Image
                        src={
                          category.image
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${category.image}`
                            : "/no-image.png"
                        }
                        alt={category.name}
                        width={80}
                        height={80}
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #eee",
                        }}
                      />
                    </TableCell>
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
                        onClick={() => {
                          setEditingCategory(category);
                          setOpenEditModal(true);
                        }}
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Thêm danh mục</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            margin="dense"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Hình ảnh danh mục
            </Typography>
            <Box
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
              }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {preview && (
                <Box mt={2}>
                  <Image
                    src={preview}
                    alt="Preview"
                    width={120}
                    height={120}
                    style={{
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid #eee",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Hủy</Button>
          <Button
            onClick={handleCreateCategory}
            variant="contained"
            disabled={!newName.trim()}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {editingCategory && (
        <ModalEditCategory
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          onSubmit={(name, imageFile) =>
            handleUpdateCategory(editingCategory.id, name, imageFile)
          }
          initialName={editingCategory.name}
          initialImageUrl={
            editingCategory.image
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${editingCategory.image}`
              : undefined
          }
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
