"use client";

import { useEffect, useState } from "react";
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

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  messageContent: string;
  createdAt: string;
  createdBy: string;
}

const ContactTablePage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8080/api/v1/contacts?page=${
          page + 1
        }&size=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setContacts(data.data.result);
      setTotalRows(data.data.meta.total);
    } catch (error) {
      console.error("Lỗi khi tải danh sách liên hệ:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, rowsPerPage]);

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
    <Box>
      <Box mb={4}>
        <Typography
          variant="h5"
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Danh sách liên hệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Danh sách hiển thị toàn bộ yêu cầu liên hệ được gửi từ người dùng đến
          hệ thống
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="contact table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Ngày gửi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
                    {row.messageContent}
                  </TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ContactTablePage;
