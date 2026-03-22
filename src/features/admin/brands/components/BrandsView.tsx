"use client";

import { useMemo, useState, ChangeEvent } from "react";
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
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useBrands, useCreateBrand, useUpdateBrand } from "../queries";
import type { Brand } from "../types";

// Reuse your existing modals
import ModalFormBrandCreate from "@/model/brand/ModalFormBrandCreate";
import ModalFormBrandEdit from "@/model/brand/ModalFormBrandEdit";
import { useToast } from "@/lib/toast/ToastContext";

const DEFAULT_ROWS = 5;

export default function BrandsView() {
  // table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);

  // data
  const { data, isLoading, isError } = useBrands(1, 1000);
  const all = (data?.result ?? []) as Brand[];

  // modals + editing row
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const { showToast } = useToast();
  const { mutateAsync: doCreate } = useCreateBrand(1, 1000);
  const { mutateAsync: doUpdate } = useUpdateBrand(1, 1000);

  // global search (optional)
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const filtered = useMemo(() => {
    if (!keyword) return all;
    return all.filter((b) => {
      const createdDate = new Date(b.createdAt).toLocaleDateString("vi-VN");
      return (
        b.name.toLowerCase().includes(keyword) ||
        (b.website ?? "").toLowerCase().includes(keyword) ||
        (b.originCountry ?? "").toLowerCase().includes(keyword) ||
        createdDate.includes(keyword)
      );
    });
  }, [all, keyword]);

  // handlers
  const handleOpenEdit = (brand: Brand) => {
    setEditing(brand);
    setOpenEdit(true);
  };

  const handleCreate = async (v: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
    year: string;
    description: string;
  }) => {
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("website", v.website);
      fd.append("originCountry", v.originCountry);
      fd.append("year", v.year);
      fd.append("description", v.description);
      if (v.logoFile) fd.append("logo", v.logoFile);

      await doCreate(fd);
      showToast("Thêm thương hiệu thành công", "success");
      setOpenCreate(false);
      setPage(0);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi thêm thương hiệu", "error");
    }
  };

  const handleUpdate = async (v: {
    name: string;
    logoFile?: File;
    website: string;
    originCountry: string;
  }) => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("website", v.website);
      fd.append("originCountry", v.originCountry);
      if (v.logoFile) fd.append("logo", v.logoFile);

      await doUpdate({ id: editing.id, fd });
      showToast("Cập nhật thương hiệu thành công", "success");
      setOpenEdit(false);
    } catch (e: any) {
      showToast(e?.message || "Lỗi khi cập nhật thương hiệu", "error");
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
        title="Thương hiệu sản phẩm"
        titleTypographyProps={{ variant: "h5" }}
        action={
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Thêm thương hiệu
          </Button>
        }
      />

      <CardContent>
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
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
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography align="center">
                        {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((brand) => (
                      <TableRow key={brand.id} hover>
                        <TableCell>{brand.id}</TableCell>

                        <TableCell
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Image
                            alt="Logo"
                            src={"/images/favicon.png"}
                            width={40}
                            height={40}
                          />
                          <Typography fontSize={14}>{brand.name}</Typography>
                        </TableCell>

                        <TableCell>{brand.website}</TableCell>
                        <TableCell>{brand.originCountry}</TableCell>
                        <TableCell>
                          {new Date(brand.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          {brand.updatedAt
                            ? new Date(brand.updatedAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            onClick={() => handleOpenEdit(brand)}
                          >
                            Cập nhật
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
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

      {/* Modals */}
      <ModalFormBrandCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />
      <ModalFormBrandEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdate}
        initialData={editing}
      />

    </Card>
  );
}
