// src/features/admin/users/components/UserTablePage.tsx
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
  TableRow,
  TablePagination,
  IconButton,
  Typography,
} from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import { apiListUsers } from "../../users/api";
import type { User } from "../../users/types";

export default function UserTablePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  useEffect(() => {
    apiListUsers()
      .then(setUsers)
      .catch((e) => console.error(e));
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.username.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword) ||
          (u.phone ?? "").toLowerCase().includes(keyword)
      ),
    [users, keyword]
  );

  useEffect(() => setPage(0), [keyword]);

  const paged = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <CardHeader
        title="Danh sách người dùng"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Typography variant="body2" color="text.secondary">
            Quản lý tài khoản người dùng
          </Typography>
        }
      />
      <CardContent>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600, minHeight: 350 }}>
            <Table stickyHeader>
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
                {paged.map((u) => (
                  <TableRow hover key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell>{u.address}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() =>
                          router.push(`/admin/users?userId=${u.id}`)
                        }
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
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, p) => setPage(p)}
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}
