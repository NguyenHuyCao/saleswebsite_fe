"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import ContactTable from "./components/ContactTable";
import { useContacts } from "./queries";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";

const ContactsView = () => {
  const { contacts, isLoading, error, refresh } = useContacts();

  // Từ slice search hiện tại
  const keyword = useSelector((state: AppState) =>
    state.search.keyword.trim().toLowerCase()
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Lọc theo keyword
  const filtered = useMemo(() => {
    const k = keyword;
    if (!k) return contacts;
    return contacts.filter(
      (c) =>
        c.fullName.toLowerCase().includes(k) ||
        c.email.toLowerCase().includes(k) ||
        c.phone.toLowerCase().includes(k) ||
        c.subject.toLowerCase().includes(k)
    );
  }, [contacts, keyword]);

  // Reset trang khi lọc
  useEffect(() => {
    setPage(0);
  }, [keyword]);

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
        {isLoading && (
          <Typography mt={1} variant="body2" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        )}
        {error && (
          <Typography mt={1} variant="body2" color="error">
            {(error as Error).message}
          </Typography>
        )}
      </Box>

      <ContactTable
        rows={filtered}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />
    </Box>
  );
};

export default ContactsView;
