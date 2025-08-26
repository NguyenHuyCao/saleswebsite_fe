"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import ContactTable from "./components/ContactTable";
import { useContacts } from "./queries";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";

const ContactsView = () => {
  const { contacts, isLoading, error } = useContacts();
  const keyword = useSelector((s: AppState) =>
    s.search.keyword.trim().toLowerCase()
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = useMemo(() => {
    if (!keyword) return contacts;
    return contacts.filter(
      (c) =>
        c.fullName.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword) ||
        c.subject.toLowerCase().includes(keyword)
    );
  }, [contacts, keyword]);

  useEffect(() => setPage(0), [keyword]);

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
            {error.message}
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
