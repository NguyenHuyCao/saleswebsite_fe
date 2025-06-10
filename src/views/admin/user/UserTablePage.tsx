"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
}

const UserTablePage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users?page=1&size=1000`, // lấy nhiều nhất có thể
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.status === 200 && Array.isArray(data.data.result)) {
        const nonAdminUsers = data.data.result.filter(
          (user: User) => user.email !== "admin@gmail.com"
        );
        setAllUsers(nonAdminUsers);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword)
    );
    setFilteredUsers(filtered);
    setPage(0); // reset về trang đầu khi tìm kiếm
  }, [keyword, allUsers]);

  // Tính dữ liệu hiển thị dựa trên trang và số dòng
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRowClick = (userId: number) => {
    router.push(`/admin/users?userId=${userId}`);
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
          <TableContainer sx={{ maxHeight: 600, minHeight: 350 }}>
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
                {paginatedUsers.map((user) => (
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
            count={filteredUsers.length} // Đúng số sau lọc
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
