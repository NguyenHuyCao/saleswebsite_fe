"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";

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
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const keyword = useSelector((state: AppState) =>
    state.search.keyword.toLowerCase()
  );

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts?page=1&size=1000`, // fetch toàn bộ trước, lọc sau
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setContacts(data.data.result);
    } catch (error) {
      console.error("Lỗi khi tải danh sách liên hệ:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(
      (item) =>
        item.fullName.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword)
    );
    setFilteredContacts(filtered);
    setPage(0);
  }, [contacts, keyword]);

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
          <Table stickyHeader>
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
              {filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hiển thị"
          SelectProps={{
            MenuProps: {
              disableScrollLock: true,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ContactTablePage;
