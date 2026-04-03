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
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useBrands, useCreateBrand, useUpdateBrand } from "../queries";
import type { Brand } from "../types";

import ModalFormBrandCreate from "@/model/brand/ModalFormBrandCreate";
import ModalFormBrandEdit from "@/model/brand/ModalFormBrandEdit";
import { useToast } from "@/lib/toast/ToastContext";

const DEFAULT_ROWS = 10;

const LogoCell = ({ logo, name }: { logo: string; name: string }) => {
  if (!logo) return <Box sx={{ width: 40, height: 40, bgcolor: "#f5f5f5", borderRadius: 1 }} />;
  return (
    <Image
      src={logo}
      alt={name}
      width={40}
      height={40}
      style={{ objectFit: "contain", borderRadius: 4, border: "1px solid #eee" }}
    />
  );
};

export default function BrandsView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);

  const { data, isLoading, isError } = useBrands(1, 1000);
  const all = (data?.result ?? []) as Brand[];

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const { showToast } = useToast();
  const { mutateAsync: doCreate } = useCreateBrand(1, 1000);
  const { mutateAsync: doUpdate } = useUpdateBrand(1, 1000);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!keyword) return all;
    return all.filter((b) => {
      const createdDate = new Date(b.createdAt).toLocaleDateString("vi-VN");
      return (
        b.name.toLowerCase().includes(keyword) ||
        (b.website ?? "").toLowerCase().includes(keyword) ||
        (b.originCountry ?? "").toLowerCase().includes(keyword) ||
        (b.description ?? "").toLowerCase().includes(keyword) ||
        createdDate.includes(keyword)
      );
    });
  }, [all, keyword]);

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
    year: string;
    description: string;
    active: boolean;
  }) => {
    if (!editing) return;
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("website", v.website);
      fd.append("originCountry", v.originCountry);
      fd.append("year", v.year);
      fd.append("description", v.description);
      fd.append("active", String(v.active));
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
          <TableContainer sx={{ maxHeight: 560 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>ID</TableCell>
                  <TableCell width={56}>Logo</TableCell>
                  <TableCell>Tên thương hiệu</TableCell>
                  <TableCell>Quốc gia</TableCell>
                  <TableCell>Năm TL</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell align="center">Sản phẩm</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Typography align="center" py={2}>
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

                        <TableCell>
                          <LogoCell logo={brand.logo} name={brand.name} />
                        </TableCell>

                        <TableCell>
                          <Box>
                            <Typography fontSize={13} fontWeight={600}>{brand.name}</Typography>
                            {brand.description && (
                              <Tooltip title={brand.description} arrow>
                                <Typography
                                  fontSize={11}
                                  color="text.secondary"
                                  sx={{
                                    maxWidth: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    cursor: "default",
                                  }}
                                >
                                  {brand.description}
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>{brand.originCountry ?? "—"}</TableCell>
                        <TableCell>{brand.year ?? "—"}</TableCell>

                        <TableCell>
                          {brand.website ? (
                            <Typography
                              component="a"
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              fontSize={12}
                              sx={{ color: "primary.main", textDecoration: "none" }}
                            >
                              {brand.website.replace(/^https?:\/\//, "")}
                            </Typography>
                          ) : "—"}
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={brand.productCount ?? 0}
                            size="small"
                            sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, height: 20, fontSize: 11 }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={brand.active ? "Hoạt động" : "Tạm ẩn"}
                            size="small"
                            color={brand.active ? "success" : "default"}
                          />
                        </TableCell>

                        <TableCell>
                          {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>

                        <TableCell align="center">
                          <Button variant="outlined" size="small" onClick={() => handleOpenEdit(brand)}>
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
            slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
          />
        </Paper>
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
        initialData={editing}
      />
    </Card>
  );
}
