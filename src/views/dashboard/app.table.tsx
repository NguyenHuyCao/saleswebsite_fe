"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { api } from "@/lib/api/http";
import { logIfNotCanceled } from "@/lib/utils/ignoreCanceledError";

interface UserFinance {
  totalSpent: number;
  gender: string;
  joinedAt: string;
  totalProducts: number;
  fullName: string;
  email: string;
  status: boolean;
}

const DashboardTable = () => {
  const [users, setUsers] = useState<UserFinance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const payload = await api.get<
          UserFinance[] | { result: UserFinance[] }
        >("/api/v1/dashboard/overview/user-finance", {
          signal: controller.signal,
        });

        const list: UserFinance[] = Array.isArray(payload)
          ? payload
          : ((payload as any)?.result ?? []);

        setUsers(Array.isArray(list) ? list : []);
      } catch (error) {
        // Sử dụng helper để chỉ log khi không phải CanceledError
        logIfNotCanceled(error, "Error fetching user finance data:");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("vi-VN");

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="Bảng người dùng chi tiêu">
          <TableHead>
            <TableRow>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Số SP đã mua</TableCell>
              <TableCell>Đã chi tiêu</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow hover key={user.email}>
                  <TableCell>
                    <Typography
                      sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}
                    >
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{formatDate(user.joinedAt)}</TableCell>
                  <TableCell>{user.totalProducts}</TableCell>
                  <TableCell>{formatCurrency(user.totalSpent)}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status ? "Hoạt động" : "Bị khoá"}
                      color={user.status ? "success" : "error"}
                      sx={{
                        height: 24,
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                        "& .MuiChip-label": { fontWeight: 500 },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        SelectProps={{ MenuProps: { disableScrollLock: true } }}
      />
    </Card>
  );
};

export default DashboardTable;
