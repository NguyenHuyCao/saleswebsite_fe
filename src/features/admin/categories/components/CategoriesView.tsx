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
  Typography,
  Box,
  Chip,
  Tooltip,
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

import ModalCreateCategory from "@/model/category/ModalCreateCategory";
import ModalEditCategory from "@/model/category/ModalEditCategory";
import ConfirmDeleteCategory from "@/model/category/ConfirmDeleteCategory";
import { useToast } from "@/lib/toast/ToastContext";

const DEFAULT_ROWS = 10;

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

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const { showToast } = useToast();
  const { mutateAsync: doCreate } = useCreateCategory(1, 1000);
  const { mutateAsync: doUpdate } = useUpdateCategory(1, 1000);
  const { mutateAsync: doDelete } = useDeleteCategory(1, 1000);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!keyword) return all;
    return all.filter((c) => {
      const createdDate = new Date(c.createdAt).toLocaleDateString("vi-VN");
      return (
        c.name.toLowerCase().includes(keyword) ||
        (c.description ?? "").toLowerCase().includes(keyword) ||
        (c.slug ?? "").toLowerCase().includes(keyword) ||
        createdDate.includes(keyword)
      );
    });
  }, [all, keyword]);

  const openEditModal = (c: Category) => {
    setEditing(c);
    setOpenEdit(true);
  };

  const openDeleteModal = (c: Category) => {
    setDeleting(c);
    setOpenDelete(true);
  };

  const handleCreate = async (name: string, description: string, imageFile?: File) => {
    try {
      const fd = new FormData();
      fd.append("name", name);
      if (description) fd.append("description", description);
      if (imageFile) fd.append("image", imageFile);
      await doCreate(fd);
      showToast("Thêm danh mục thành công", "success");
      setOpenCreate(false);
      setPage(0);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi thêm danh mục", "error");
    }
  };

  const handleUpdate = async (name: string, description: string, active: boolean, imageFile?: File) => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("active", String(active));
      if (imageFile) fd.append("image", imageFile);
      await doUpdate({ id: editing.id, fd });
      showToast("Cập nhật danh mục thành công", "success");
      setOpenEdit(false);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi cập nhật danh mục", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await doDelete(deleting.id);
      showToast("Xóa danh mục thành công", "success");
      setOpenDelete(false);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi xóa danh mục", "error");
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
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Thêm danh mục
          </Button>
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>ID</TableCell>
                  <TableCell width={90}>Ảnh</TableCell>
                  <TableCell>Tên danh mục</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell align="center">Sản phẩm</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Cập nhật</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography py={2}>
                        {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                      </Typography>
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
                            width={64}
                            height={64}
                            style={{ borderRadius: 6, objectFit: "cover", border: "1px solid #eee" }}
                          />
                        </TableCell>

                        <TableCell>
                          <Box>
                            <Typography fontSize={13} fontWeight={600}>{c.name}</Typography>
                            {c.description && (
                              <Tooltip title={c.description} arrow>
                                <Typography
                                  fontSize={11}
                                  color="text.secondary"
                                  sx={{
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    cursor: "default",
                                  }}
                                >
                                  {c.description}
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={11} color="text.secondary" fontFamily="monospace">
                            {c.slug ?? "—"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={c.productCount ?? 0}
                            size="small"
                            sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, height: 20, fontSize: 11 }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={c.active !== false ? "Hiển thị" : "Ẩn"}
                            size="small"
                            color={c.active !== false ? "success" : "default"}
                          />
                        </TableCell>

                        <TableCell>
                          {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("vi-VN") : "—"}
                        </TableCell>

                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Button variant="outlined" size="small" onClick={() => openEditModal(c)}>
                              Cập nhật
                            </Button>
                            <Button color="error" variant="outlined" size="small" onClick={() => openDeleteModal(c)}>
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
            slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
          />
        </Paper>
      </CardContent>

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
          initialDescription={editing.description ?? ""}
          initialActive={editing.active ?? true}
          initialImageUrl={imgURL(editing.image ?? undefined)}
        />
      )}

      <ConfirmDeleteCategory
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
