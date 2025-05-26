// ** React & MUI Imports
"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const TAX_RATE = 0.07;
const ccyFormat = (num: number) => `${num.toLocaleString("vi-VN")} ₫`;

const mockOrder = {
  orderId: 1,
  status: "DELIVERED",
  shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
  paymentMethod: "COD",
  shippingMethod: "LOCAL_SHIPPER",
  totalAmount: 1000000,
  createdAt: "2025-05-20T11:56:02.709506Z",
  items: [
    {
      productName: "Máy xay cỏ",
      quantity: 2,
      unitPrice: 496000,
    },
  ],
  paymentStatus: "PAID",
  paidAt: "2025-05-21T05:22:19.373866Z",
};

const OrderDetailTable = () => {
  const [status, setStatus] = useState(mockOrder.status);
  const [paymentStatus, setPaymentStatus] = useState(mockOrder.paymentStatus);

  const subtotal = mockOrder.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = TAX_RATE * subtotal;
  const total = subtotal + tax;

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={`Chi tiết đơn hàng #${mockOrder.orderId}`}
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={4}
          >
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
              sx={{ opacity: 0.6 }}
            >
              <TextField
                fullWidth
                label="Ngày đặt hàng"
                value={new Date(mockOrder.createdAt).toLocaleString("vi-VN")}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
              sx={{ opacity: 0.6 }}
            >
              <TextField
                fullWidth
                label="Địa chỉ giao hàng"
                value={mockOrder.shippingAddress}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
              sx={{ opacity: 0.6 }}
            >
              <TextField
                fullWidth
                label="Phương thức thanh toán"
                value={mockOrder.paymentMethod}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Trạng thái thanh toán</InputLabel>
                <Select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  label="Trạng thái thanh toán"
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="PAID">PAID</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
              sx={{ opacity: 0.6 }}
            >
              <TextField
                fullWidth
                label="Ngày thanh toán"
                value={
                  mockOrder.paidAt
                    ? new Date(mockOrder.paidAt).toLocaleString("vi-VN")
                    : "-"
                }
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box
              flex={{
                xs: "100%",
                sm: "0 1 calc(33.33% - 16px)",
                md: "0 1 calc(33.33% - 16px)",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Trạng thái đơn hàng</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Trạng thái đơn hàng"
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Sản phẩm trong đơn hàng"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="order details table">
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockOrder.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {ccyFormat(item.unitPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {ccyFormat(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Tạm tính</TableCell>
                  <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Thuế VAT</TableCell>
                  <TableCell align="right">
                    {(TAX_RATE * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell align="right">{ccyFormat(tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Tổng tiền</TableCell>
                  <TableCell align="right">{ccyFormat(total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetailTable;
