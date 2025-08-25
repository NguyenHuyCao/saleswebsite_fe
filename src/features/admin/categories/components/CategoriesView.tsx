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
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../queries";
import type { Category } from "../types";

// Reuse your existing modals (giữ nguyên đường dẫn model bạn đã có)
import ModalCreateCategory from "@/model/category/ModalCreateCategory";
import ModalEditCategory from "@/model/category/ModalEditCategory";
import ConfirmDeleteCategory from "@/model/category/ConfirmDeleteCategory";

const Alert = MuiAlert as React.ElementType;
const DEFAULT_ROWS = 5;

const imgURL = (img?: string | null) =>
  img?.startsWith("http")
    ? img
    : img
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${img}`
    : "/images/placeholder.png";

export default function CategoriesView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);

  const { data, isLoading, isError } = useCategories(1, 1000);
  const all = (data?.result ?? []) as Category[];

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  // snackbar
  const [snack, setSnack] = useState<{
    open: boolean;
    type: "success" | "error";
    msg: string;
  }>({ open: false, type: "success", msg: "" });

  const { mutateAsync: doCreate } = useCreateCategory(1, 1000);
  const { mutateAsync: doUpdate } = useUpdateCategory(1, 1000);
  const { mutateAsync: doDelete } = useDeleteCategory(1, 1000);

  // global search
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const filtered = useMemo(() => {
    if (!keyword) return all;
    return all.filter((c) => {
      const createdDate = new Date(c.createdAt).toLocaleDateString("vi-VN");
      return (
        c.name.toLowerCase().includes(keyword) || createdDate.includes(keyword)
      );
    });
  }, [all, keyword]);

  // handlers
  const openEditModal = (c: Category) => {
    setEditing(c);
    setOpenEdit(true);
  };

  const openDeleteModal = (c: Category) => {
    setDeleting(c);
    setOpenDelete(true);
  };

  const handleCreate = async (name: string, imageFile?: File) => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      if (imageFile) fd.append("image", imageFile);
      await doCreate(fd);
      setSnack({
        open: true,
        type: "success",
        msg: "Thêm danh mục thành công",
      });
      setOpenCreate(false);
      setPage(0);
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.message || "Lỗi khi thêm danh mục",
      });
    }
  };

  const handleUpdate = async (name: string, imageFile?: File) => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("name", name);
      if (imageFile) fd.append("image", imageFile);
      await doUpdate({ id: editing.id, fd });
      setSnack({
        open: true,
        type: "success",
        msg: "Cập nhật danh mục thành công",
      });
      setOpenEdit(false);
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.message || "Lỗi khi cập nhật danh mục",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await doDelete(deleting.id);
      setSnack({ open: true, type: "success", msg: "Xóa danh mục thành công" });
      setOpenDelete(false);
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.message || "Lỗi khi xóa danh mục",
      });
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Card>
      <CardHeader
        title="Danh mục sản phẩm"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Thêm danh mục
          </Button>
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
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
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>
                          <Image
                            src={imgURL(c.image ?? undefined)}
                            alt={c.name}
                            width={80}
                            height={80}
                            style={{
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid #eee",
                            }}
                          />
                        </TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>
                          {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {c.updatedAt
                            ? new Date(c.updatedAt).toLocaleDateString("vi-VN")
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Button
                              variant="outlined"
                              onClick={() => openEditModal(c)}
                            >
                              Cập nhật
                            </Button>
                            <Button
                              color="error"
                              variant="outlined"
                              onClick={() => openDeleteModal(c)}
                            >
                              Xóa
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Hiển thị"
            SelectProps={{ MenuProps: { disableScrollLock: true } }}
          />
        </Paper>
      </CardContent>

      {/* Modals (xài lại modal bạn có sẵn trong thư mục model) */}
      <ModalCreateCategory
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />

      {editing && (
        <ModalEditCategory
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleUpdate}
          initialName={editing.name}
          initialImageUrl={imgURL(editing.image ?? undefined)}
        />
      )}

      <ConfirmDeleteCategory
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
      />

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
