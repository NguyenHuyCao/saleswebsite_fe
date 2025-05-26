// ** React & MUI Imports
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
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/navigation";

interface ProductData {
  id: number;
  name: string;
  imageAvt: string;
  stockQuantity: number;
  price: number;
  brand: { name: string };
  power: string;
  fuelType: string;
  weight: number;
}

const columns = [
  { id: "id", label: "ID", minWidth: 50, align: "left" },
  { id: "product", label: "Sản phẩm", minWidth: 80, align: "left" },
  { id: "stockQuantity", label: "Số lượng", minWidth: 100, align: "right" },
  { id: "price", label: "Giá", minWidth: 100, align: "right" },
  { id: "power", label: "Công suất", minWidth: 100, align: "left" },
  { id: "fuelType", label: "Động cơ", minWidth: 100, align: "left" },
  { id: "weight", label: "Cân nặng", minWidth: 100, align: "left" },
  { id: "brand", label: "Thương hiệu", minWidth: 110, align: "left" },
  { id: "actions", label: "Thao tác", minWidth: 100, align: "center" },
];

const fakeData = {
  result: new Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Máy xay cỏ ${index + 1}`,
    imageAvt: "4.jpg",
    stockQuantity: 100,
    price: 500000,
    power: "2000W",
    fuelType: "Điện",
    weight: 1500,
    brand: { name: "Máy cadf" },
  })),
};

const ProductTablePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    setProducts(fakeData.result.slice(start, end));
    setTotal(fakeData.result.length);
  }, [page, rowsPerPage]);

  const handleAddProduct = () => {
    router.push("/admin/products/create");
  };

  const handleUpdateProduct = (productId: number) => {
    router.push(`/admin/products/update?productId=${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/admin/products/view?productId=${productId}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
          <TextField label="Lọc theo giá" size="small" />
          <TextField label="Lọc theo công suất" size="small" />
          <TextField label="Loại động cơ" size="small" />
          <TextField label="Cân nặng" size="small" />
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500, minHeight: 270 }}>
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
                {products.map((product) => (
                  <TableRow hover key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={`/images/products/${product.imageAvt}`}
                          alt={product.name}
                          variant="rounded"
                        />
                        <Typography noWrap title={product.name} maxWidth={160}>
                          {product.name.length > 25
                            ? product.name.slice(0, 25) + "..."
                            : product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{product.stockQuantity}</TableCell>
                    <TableCell align="right">
                      {product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>{product.power}</TableCell>
                    <TableCell>{product.fuelType}</TableCell>
                    <TableCell>{product.weight}g</TableCell>
                    <TableCell>{product.brand?.name || "-"}</TableCell>
                    <TableCell align="center">
                      <Box display="flex">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <PreviewOutlinedIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => handleUpdateProduct(product.id)}
                        >
                          <EditIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[3, 5, 10]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ProductTablePage;
