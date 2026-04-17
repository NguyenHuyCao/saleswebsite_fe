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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useBrands, useCreateBrand, useUpdateBrand } from "../queries";
import type { Brand } from "../types";

import ModalFormBrandCreate from "./modals/ModalFormBrandCreate";
import ModalFormBrandEdit from "./modals/ModalFormBrandEdit";
import { useToast } from "@/lib/toast/ToastContext";

const DEFAULT_ROWS = 10;

const ACTIVE_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "hidden", label: "Tắt" },
];

const SORT_OPTIONS = [
  { value: "newest",        label: "Mới nhất" },
  { value: "oldest",        label: "Cũ nhất" },
  { value: "name_az",       label: "Tên A → Z" },
  { value: "most_products", label: "Nhiều sản phẩm nhất" },
];

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

const logoSrc = (logo?: string | null) => {
  if (!logo) return "/images/placeholder.png";
  if (logo.startsWith("http")) return logo;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${logo}`;
};

export default function BrandsView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS);
  const [activeFilter, setActiveFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, isError } = useBrands(1, 1000);
  const all = (data?.result ?? []) as Brand[];

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const { showToast } = useToast();
  const { mutateAsync: doCreate } = useCreateBrand(1, 1000);
  const { mutateAsync: doUpdate } = useUpdateBrand(1, 1000);

  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const hasFilter = Boolean(activeFilter);

  const clearFilters = () => {
    setActiveFilter("");
    setPage(0);
  };

  const filtered = useMemo(() => {
    let result = all;

    if (keyword)
      result = result.filter((b) => {
        const createdDate = new Date(b.createdAt).toLocaleDateString("vi-VN");
        return (
          b.name.toLowerCase().includes(keyword) ||
          (b.website ?? "").toLowerCase().includes(keyword) ||
          (b.originCountry ?? "").toLowerCase().includes(keyword) ||
          (b.year ?? "").includes(keyword) ||
          (b.description ?? "").toLowerCase().includes(keyword) ||
          createdDate.includes(keyword)
        );
      });

    if (activeFilter === "active") result = result.filter((b) => b.active !== false);
    if (activeFilter === "hidden") result = result.filter((b) => b.active === false);

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name_az":       return a.name.localeCompare(b.name, "vi");
        case "most_products": return (b.productCount ?? 0) - (a.productCount ?? 0);
        default:              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [all, keyword, activeFilter, sortBy]);

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
        {/* Filter bar */}
        <Box sx={{ mb: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sắp xếp" MenuProps={{ disableScrollLock: true }}>
              {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); setPage(0); }} label="Trạng thái" MenuProps={{ disableScrollLock: true }}>
              {ACTIVE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          {hasFilter && (
            <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </Box>

        {hasFilter && (
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={1.5}>
            {activeFilter && (
              <Chip
                label={`Trạng thái: ${labelOf(ACTIVE_OPTIONS, activeFilter)}`}
                size="small"
                onDelete={() => { setActiveFilter(""); setPage(0); }}
              />
            )}
          </Stack>
        )}

        <Paper>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Thương hiệu</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Năm thành lập</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>Website</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Nguồn gốc</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Sản phẩm</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Trạng thái</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Ngày tạo</TableCell>
                  <TableCell align="center" sx={{ minWidth: 100 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Typography align="center" py={2}>
                        {isLoading ? "Đang tải..." : "Không thể tải dữ liệu"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Typography align="center" color="text.secondary" py={2}>
                        Không tìm thấy thương hiệu nào
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
                          <Box display="flex" alignItems="center" gap={1}>
                            <Image
                              alt={brand.name}
                              src={logoSrc(brand.logo)}
                              width={36}
                              height={36}
                              style={{ objectFit: "contain", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                              unoptimized
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={500} lineHeight={1.2}>
                                {brand.name}
                              </Typography>
                              {brand.description && (
                                <Tooltip title={brand.description} placement="bottom-start">
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  >
                                    {brand.description}
                                  </Typography>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>{brand.year || "—"}</TableCell>

                        <TableCell>
                          {brand.website ? (
                            <Typography
                              variant="body2"
                              component="a"
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                            >
                              {brand.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        <TableCell>{brand.originCountry || "—"}</TableCell>

                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {brand.productCount ?? "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={brand.active !== false ? "Hoạt động" : "Tắt"}
                            color={brand.active !== false ? "success" : "default"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Button size="small" variant="outlined" onClick={() => handleOpenEdit(brand)}>
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
