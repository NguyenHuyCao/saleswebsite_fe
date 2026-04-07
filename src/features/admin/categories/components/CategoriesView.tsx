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
        (c.brandName ?? "").toLowerCase().includes(keyword) ||
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

  const handleCreate = async (v: { name: string; description: string; imageFile?: File }) => {
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      if (v.description) fd.append("description", v.description);
      if (v.imageFile) fd.append("image", v.imageFile);
      await doCreate(fd);
      showToast("Thêm danh mục thành công", "success");
      setOpenCreate(false);
      setPage(0);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi thêm danh mục", "error");
    }
  };

  const handleUpdate = async (v: { name: string; description: string; active: boolean; imageFile?: File }) => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      if (v.description) fd.append("description", v.description);
      fd.append("active", String(v.active));
      if (v.imageFile) fd.append("image", v.imageFile);
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
                  <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Ảnh</TableCell>
                  <TableCell sx={{ minWidth: 180 }}>Tên danh mục</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Thương hiệu</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Sản phẩm</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Trạng thái</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Ngày tạo</TableCell>
                  <TableCell align="center" sx={{ minWidth: 140 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography py={2}>{isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}</Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" py={2}>Không tìm thấy danh mục nào</Typography>
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
                            width={48}
                            height={48}
                            style={{ borderRadius: 6, objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)" }}
                            unoptimized
                          />
                        </TableCell>

                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{c.name}</Typography>
                            {c.description && (
                              <Tooltip title={c.description} placement="bottom-start">
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                >
                                  {c.description}
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {c.brandName ? (
                            <Typography variant="body2">{c.brandName}</Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {c.productCount ?? "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={c.active !== false ? "Hiển thị" : "Ẩn"}
                            color={c.active !== false ? "success" : "default"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Button size="small" variant="outlined" onClick={() => openEditModal(c)}>
                              Cập nhật
                            </Button>
                            <Button size="small" color="error" variant="outlined" onClick={() => openDeleteModal(c)}>
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
          initialActive={editing.active !== false}
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
