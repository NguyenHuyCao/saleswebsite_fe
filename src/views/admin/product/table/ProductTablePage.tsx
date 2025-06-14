"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/navigation";
import AlertSnackbar from "@/model/notify/AlertSnackbar";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";

interface ProductData {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  stockQuantity: number;
  price: number;
  brandName: string;
  power: string;
  fuelType: string;
  weight: number;
  active: boolean;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
}

const columns: Column[] = [
  { id: "id", label: "ID", minWidth: 50, align: "left" },
  { id: "product", label: "Sản phẩm", minWidth: 80, align: "left" },
  { id: "stockQuantity", label: "Số lượng", minWidth: 100, align: "right" },
  { id: "price", label: "Giá", minWidth: 100, align: "right" },
  { id: "power", label: "Công suất", minWidth: 100, align: "left" },
  { id: "fuelType", label: "Động cơ", minWidth: 100, align: "left" },
  { id: "weight", label: "Cân nặng", minWidth: 100, align: "left" },
  { id: "brand", label: "Thương hiệu", minWidth: 110, align: "left" },
  { id: "status", label: "Trạng thái", minWidth: 100, align: "center" },
  { id: "actions", label: "Thao tác", minWidth: 100, align: "center" },
];

const ProductTablePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState(""); // "0-1000000"
  const [powerFilter, setPowerFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [weightFilter, setWeightFilter] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const router = useRouter();

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  useEffect(() => {
    const filtered = products.filter((product) => {
      const keywordMatch = [
        product.name,
        product.stockQuantity.toString(),
        product.price.toString(),
        product.power,
        product.fuelType,
        product.weight.toString(),
        product.brandName || "",
      ].some((val) => val.toLowerCase().includes(keyword.trim().toLowerCase()));

      // --- Lọc theo giá
      let priceMatch = true;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        priceMatch = product.price >= min && product.price <= max;
      }

      // --- Công suất
      const powerMatch = powerFilter
        ? product.power.toLowerCase().includes(powerFilter.toLowerCase())
        : true;

      // --- Loại động cơ
      const fuelTypeMatch = fuelTypeFilter
        ? product.fuelType.toLowerCase().includes(fuelTypeFilter.toLowerCase())
        : true;

      // --- Cân nặng
      const weightMatch = weightFilter
        ? product.weight.toString() === weightFilter
        : true;

      return (
        keywordMatch && priceMatch && powerMatch && fuelTypeMatch && weightMatch
      );
    });

    setFilteredProducts(filtered);
    setPage(0);
  }, [
    products,
    keyword,
    priceRange,
    powerFilter,
    fuelTypeFilter,
    weightFilter,
  ]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?page=1&size=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProducts(data.data.result);
        setTotal(data.data.meta.total);
      } else {
        setAlert({ open: true, message: data.message, type: "error" });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "Lỗi kết nối tới máy chủ. Vui lòng thử lại sau.",
        type: "error",
      });
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => router.push("/admin/products?page=create");
  const handleUpdateProduct = (slug: string) =>
    router.push(`/admin/products?page=edit&productSlug=${slug}`);
  const handleViewProduct = (slug: string) =>
    router.push(`/admin/products?page=view&productSlug=${slug}`);

  const handleToggleStatus = async (slug: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${slug}/toggle-active`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAlert({
          open: true,
          message: "Cập nhật trạng thái thành công!",
          type: "success",
        });
        fetchProducts(); // reload
      } else {
        setAlert({
          open: true,
          message: data.message || "Cập nhật trạng thái thất bại!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: "Lỗi khi cập nhật trạng thái.",
        type: "error",
      });
    }
  };

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
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={handleAddProduct}
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
            <Table stickyHeader aria-label="product table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{ minWidth: column.minWidth, fontWeight: 600 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow hover key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={`/images/products/${product.imageAvt}`}
                            alt={product.name}
                            variant="rounded"
                          />
                          <Typography
                            noWrap
                            title={product.name}
                            maxWidth={160}
                          >
                            {product.name.length > 25
                              ? product.name.slice(0, 25) + "..."
                              : product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {product.stockQuantity}
                      </TableCell>
                      <TableCell align="right">
                        {product.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell>{product.power}</TableCell>
                      <TableCell>{product.fuelType}</TableCell>
                      <TableCell>{product.weight}g</TableCell>
                      <TableCell>{product.brandName || "-"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color={product.active ? "success" : "inherit"}
                          size="small"
                          onClick={() => handleToggleStatus(product.slug)}
                        >
                          {product.active ? "Bật" : "Tắt"}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex">
                          <LightTooltip title="Xem chi tiết">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewProduct(product.slug)}
                            >
                              <PreviewOutlinedIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                          </LightTooltip>

                          <LightTooltip title="Cập nhật">
                            <IconButton
                              color="warning"
                              onClick={() => handleUpdateProduct(product.slug)}
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
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
                setRowsPerPage(+e.target.value);
                setPage(0);
              }}
              labelRowsPerPage="Hiển thị"
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            />
          </Box>
        </Paper>
      </CardContent>
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        type={alert.type as "error" | "success"}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Card>
  );
};

export default ProductTablePage;
