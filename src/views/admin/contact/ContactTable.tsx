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

const contactData = {
  meta: {
    page: 1,
    pageSize: 2,
    pages: 2,
    total: 3,
  },
  result: [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyen.vana@example.com",
      phone: "+84901234567",
      subject: "Yêu cầu hỗ trợ sản phẩm",
      messageContent:
        "Kính gửi, tôi đã mua sản phẩm ABC từ cửa hàng, nhưng hiện tại sản phẩm gặp phải lỗi. Tôi mong muốn được hỗ trợ bảo hành. Cảm ơn!",
      createdAt: "2025-05-21T12:27:04.080030Z",
      createdBy: "anonymousUser",
    },
    {
      id: 2,
      fullName: "Nguyễn Văn A",
      email: "nguyen.vana@example.com",
      phone: "+84901234567",
      subject: "Yêu cầu hỗ trợ sản phẩm",
      messageContent:
        "Kính gửi, tôi đã mua sản phẩm ABC từ cửa hàng, nhưng hiện tại sản phẩm gặp phải lỗi. Tôi mong muốn được hỗ trợ bảo hành. Cảm ơn!",
      createdAt: "2025-05-21T12:27:36.717644Z",
      createdBy: "anonymousUser",
    },
    {
      id: 3,
      fullName: "Nguyễn Văn A",
      email: "nguyen.vana@example.com",
      phone: "+84901234567",
      subject: "Yêu cầu hỗ trợ sản phẩm",
      messageContent:
        "Kính gửi, tôi đã mua sản phẩm ABC từ cửa hàng, nhưng hiện tại sản phẩm gặp phải lỗi. Tôi mong muốn được hỗ trợ bảo hành. Cảm ơn!",
      createdAt: "2025-05-21T15:49:51.876244Z",
      createdBy: "anonymousUser",
    },
  ],
};

const ContactTablePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

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
              {contactData.result
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
          rowsPerPageOptions={[2, 5, 10]}
          component="div"
          count={contactData.result.length}
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
