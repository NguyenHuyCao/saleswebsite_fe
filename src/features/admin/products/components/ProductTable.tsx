// src/features/admin/products/components/ProductTable.tsx
"use client";

import { useEffect, useMemo, useState, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
  Box,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import { useProducts, Mutations } from "../../products/queries";
import type { Product } from "../../products/types";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";

const LightTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#fff",
    color: "rgba(0,0,0,.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default function ProductTable() {
  const router = useRouter();
  const { data, loading, error, refetch } = useProducts();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [priceRange, setPriceRange] = useState("");
  const [powerFilter, setPowerFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [weightFilter, setWeightFilter] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );
  const products = data?.result ?? [];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const keywordMatch = [
        p.name,
        String(p.stockQuantity ?? ""),
        String(p.price ?? ""),
        p.power,
        p.fuelType,
        String(p.weight ?? ""),
        p.brandName ?? "",
      ].some((v) => (v ?? "").toLowerCase().includes(keyword));
      let priceMatch = true;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        priceMatch = (p.price ?? 0) >= min && (p.price ?? 0) <= max;
      }
      const powerMatch = powerFilter
        ? (p.power ?? "").toLowerCase().includes(powerFilter.toLowerCase())
        : true;
      const fuelMatch = fuelTypeFilter
        ? (p.fuelType ?? "")
            .toLowerCase()
            .includes(fuelTypeFilter.toLowerCase())
        : true;
      const weightMatch = weightFilter
        ? String(p.weight ?? "") === weightFilter
        : true;
      return (
        keywordMatch && priceMatch && powerMatch && fuelMatch && weightMatch
      );
    });
  }, [
    products,
    keyword,
    priceRange,
    powerFilter,
    fuelTypeFilter,
    weightFilter,
  ]);

  const onToggle = async (slug: string) => {
    try {
      await Mutations.toggleActive(slug);
      setToast({
        open: true,
        message: "Cập nhật trạng thái thành công!",
        type: "success",
      });
      await refetch();
    } catch (e: any) {
      setToast({
        open: true,
        message: e.message || "Cập nhật trạng thái thất bại!",
        type: "error",
      });
    }
  };

  if (loading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardHeader
        title="Danh sách sản phẩm"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push("/admin/products/create")}
          >
            Thêm sản phẩm
          </Button>
        }
      />
      <CardContent>
        <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
          <TextField
            select
            label="Lọc theo giá"
            size="small"
            SelectProps={{ native: true }}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          >
            <option value="">Tất cả</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-5000000">1 - 5 triệu</option>
            <option value="5000000-10000000">5 - 10 triệu</option>
            <option value="10000000-999999999">Trên 10 triệu</option>
          </TextField>
          <TextField
            label="Lọc theo công suất"
            size="small"
            value={powerFilter}
            onChange={(e) => setPowerFilter(e.target.value)}
          />
          <TextField
            label="Loại động cơ"
            size="small"
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value)}
          />
          <TextField
            label="Cân nặng (g)"
            size="small"
            value={weightFilter}
            onChange={(e) => setWeightFilter(e.target.value)}
          />
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "ID",
                    "Sản phẩm",
                    "Số lượng",
                    "Giá",
                    "Công suất",
                    "Động cơ",
                    "Cân nặng",
                    "Thương hiệu",
                    "Trạng thái",
                    "Thao tác",
                  ].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p: Product) => (
                    <TableRow hover key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={
                              typeof p.imageAvt === "string"
                                ? `/images/products/${p.imageAvt}`
                                : ""
                            }
                            alt={p.name}
                            variant="rounded"
                          />
                          <Typography noWrap maxWidth={180} title={p.name}>
                            {p.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {p.stockQuantity ?? "-"}
                      </TableCell>
                      <TableCell align="right">
                        {(p.price ?? 0).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell>{p.power}</TableCell>
                      <TableCell>{p.fuelType}</TableCell>
                      <TableCell>{p.weight}g</TableCell>
                      <TableCell>{p.brandName ?? "-"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color={p.active ? "success" : "inherit"}
                          size="small"
                          onClick={() => onToggle(p.slug)}
                        >
                          {p.active ? "Bật" : "Tắt"}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex">
                          <LightTooltip title="Xem chi tiết">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                router.push(
                                  `/admin/products/view?productSlug=${p.slug}`
                                )
                              }
                            >
                              <PreviewOutlinedIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                          </LightTooltip>
                          <LightTooltip title="Cập nhật">
                            <IconButton
                              color="warning"
                              onClick={() =>
                                router.push(
                                  `/admin/products/update?productSlug=${p.slug}`
                                )
                              }
                            >
                              <EditIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                          </LightTooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end">
            <TablePagination
              component="div"
              count={filtered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_e, p) => setPage(p)}
              onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
                setRowsPerPage(+e.target.value);
                setPage(0);
              }}
              labelRowsPerPage="Hiển thị"
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            />
          </Box>
        </Paper>
      </CardContent>

      <AlertSnackbar
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Card>
  );
}
