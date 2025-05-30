"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Avatar,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const cartItems = [
  {
    productId: 1,
    productName: "Máy xay cỏ",
    productDescription: "Máy xay sinh tố công suất lớn, thiết kế hiện đại.",
    productImage: "1748346020588-4.jpg",
    unitPrice: 0,
    quantity: 2,
    totalPrice: 0,
  },
  {
    productId: 6,
    productName: "Máy cày",
    productDescription: "Máy cày cao cấp, tiết kiệm nhiên liệu.",
    productImage: "3.jpg",
    unitPrice: 123134123,
    quantity: 2,
    totalPrice: 246268246,
  },
];

const CartItemList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Sản phẩm trong giỏ hàng
      </Typography>

      {/* Desktop Table */}
      {!isMobile ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên</TableCell>
              {/* <TableCell>Mô tả</TableCell> */}
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Tổng</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <Avatar
                    src={`/images/products/${item.productImage}`}
                    alt={item.productName}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                </TableCell>
                {/* <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.productDescription}
                  </Typography>
                </TableCell> */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton size="small" color="primary">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      size="small"
                      type="number"
                      inputProps={{ min: 1 }}
                      sx={{ width: 60 }}
                    />
                    <IconButton size="small" color="primary">
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{item.unitPrice.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  {item.totalPrice.toLocaleString("vi-VN")}₫
                </TableCell>
                <TableCell>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // Mobile View
        <Stack spacing={2}>
          {cartItems.map((item) => (
            <Paper
              key={item.productId}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={`/images/products/${item.productImage}`}
                  alt={item.productName}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.productName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.productDescription}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Số lượng:</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton size="small" color="primary">
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: 50 }}
                  />
                  <IconButton size="small" color="primary">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Đơn giá:</Typography>
                <Typography>
                  {item.unitPrice.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Tổng:</Typography>
                <Typography fontWeight={600}>
                  {item.totalPrice.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>

              <Box mt={2} textAlign="right">
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CartItemList;
