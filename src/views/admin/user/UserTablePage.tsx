// ** React & MUI Imports
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/navigation";

const userData = {
  meta: {
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 7,
  },
  result: [
    {
      id: 1,
      username: "user",
      email: "user@gmail.com",
      phone: "1-800-123-4567",
      address: "1234 Maple St, Springfield, IL 62701",
    },
    {
      id: 2,
      username: "admin",
      email: "admin@gmail.com",
      phone: "123456",
      address: "1234 Maple St, Springfield, IL 62701",
    },
    {
      id: 3,
      username: "a",
      email: "a@gmail.com",
      phone: "123456",
      address: "1234 Maple St, Springfield, IL 62701",
    },
    {
      id: 4,
      username: "aa",
      email: "afds@gmail.com",
      phone: "123456",
      address: "1234 Maple St, Springfield, IL 62701",
    },
    {
      id: 5,
      username: "fasd",
      email: "admaain@gmail.com",
      phone: "132457",
      address: "huycaas fdsafsa",
    },
    {
      id: 6,
      username: "huycao",
      email: "cao@gmail.com",
      phone: "1234567`",
      address: "cao dum",
    },
    {
      id: 7,
      username: "h",
      email: "fasdf@gmail.com",
      phone: "13242",
      address: "huya",
    },
  ],
};

const UserTablePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  const handleRowClick = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Card>
      <CardHeader
        title="Danh sách người dùng"
        action={
          <Typography variant="body2" color="text.secondary">
            Quản lý tài khoản người dùng trong hệ thống
          </Typography>
        }
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600, minHeight: 300 }}>
            <Table stickyHeader aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên đăng nhập</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell align="center">Cập nhật</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.result
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRowClick(user.id)}
                        >
                          <UploadOutlinedIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={userData.result.length}
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

export default UserTablePage;
