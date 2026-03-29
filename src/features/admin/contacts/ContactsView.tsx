"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MailOutline from "@mui/icons-material/MailOutline";
import DraftsOutlined from "@mui/icons-material/DraftsOutlined";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import FiberNewOutlined from "@mui/icons-material/FiberNewOutlined";

import ContactTable from "./components/ContactTable";
import ContactDetailDialog from "./components/ContactDetailDialog";
import DeleteContactDialog from "./components/DeleteContactDialog";
import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { useContacts } from "./queries";
import { useSelector } from "react-redux";
import type { AppState } from "@/redux/store";
import type { Contact, ContactStatus } from "./types";

type StatusFilter = "ALL" | ContactStatus;
type SnackState = { open: boolean; message: string; type: "success" | "error" };

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL",     label: "Tất cả" },
  { value: "NEW",     label: "Mới" },
  { value: "READ",    label: "Đã xem" },
  { value: "REPLIED", label: "Đã trả lời" },
  { value: "CLOSED",  label: "Đã đóng" },
];

const INIT_SNACK: SnackState = { open: false, message: "", type: "success" };

const ContactsView = () => {
  const { contacts, isLoading, error, patchStatus, remove } = useContacts();
  const keyword = useSelector((s: AppState) => s.search.keyword.trim().toLowerCase());

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [snack, setSnack] = useState<SnackState>(INIT_SNACK);

  // dialogs
  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  // stats
  const today = new Date().toDateString();
  const totalNew     = contacts.filter((c) => (c.status ?? "NEW") === "NEW").length;
  const totalReplied = contacts.filter((c) => c.status === "REPLIED").length;
  const todayCount   = contacts.filter((c) => new Date(c.createdAt).toDateString() === today).length;

  const stats = [
    { label: "Tổng liên hệ", value: contacts.length, icon: <MailOutline />,      color: "primary.main" },
    { label: "Chưa đọc",     value: totalNew,         icon: <FiberNewOutlined />, color: "warning.main" },
    { label: "Đã trả lời",   value: totalReplied,     icon: <ReplyOutlined />,    color: "success.main" },
    { label: "Hôm nay",      value: todayCount,       icon: <DraftsOutlined />,   color: "info.main" },
  ];

  const filtered = useMemo(() => {
    let list = contacts;
    if (statusFilter !== "ALL") list = list.filter((c) => (c.status ?? "NEW") === statusFilter);
    if (keyword) {
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(keyword) ||
          c.email.toLowerCase().includes(keyword) ||
          c.phone.toLowerCase().includes(keyword) ||
          c.subject.toLowerCase().includes(keyword)
      );
    }
    return list;
  }, [contacts, keyword, statusFilter]);

  useEffect(() => setPage(0), [keyword, statusFilter]);

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleView = async (contact: Contact) => {
    setDetailContact(contact);
    if ((contact.status ?? "NEW") === "NEW") {
      try {
        await patchStatus(contact.id, "READ");
        setDetailContact((prev) => prev?.id === contact.id ? { ...prev, status: "READ" } : prev);
      } catch {
        // non-blocking — user still sees the detail
      }
    }
  };

  const handleStatusChange = async (id: number, status: ContactStatus) => {
    try {
      await patchStatus(id, status);
      setDetailContact((prev) => prev?.id === id ? { ...prev, status } : prev);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? "Cập nhật trạng thái thất bại", type: "error" });
    }
  };

  /** Mở delete dialog — đóng detail trước để tránh chồng dialog */
  const openDeleteDialog = (contact: Contact) => {
    setDetailContact(null);       // đóng detail trước
    setDeleteTarget(contact);     // rồi mở confirm
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      setSnack({ open: true, message: "Đã xoá liên hệ thành công", type: "success" });
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? "Xoá thất bại, vui lòng thử lại", type: "error" });
    } finally {
      // luôn đóng dialog dù lỗi hay thành công
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700 }}>
          Quản lý liên hệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi và xử lý toàn bộ yêu cầu liên hệ từ khách hàng
        </Typography>
        {error && (
          <Typography mt={1} variant="body2" color="error">{error.message}</Typography>
        )}
      </Box>

      {/* Stats cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "16px !important" }}>
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: `${s.color}20`, color: s.color,
                  }}
                >
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} lineHeight={1}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Status filter chips */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === "ALL"
              ? contacts.length
              : contacts.filter((c) => (c.status ?? "NEW") === tab.value).length;
          return (
            <Chip
              key={tab.value}
              label={`${tab.label} (${count})`}
              onClick={() => setStatusFilter(tab.value)}
              color={statusFilter === tab.value ? "primary" : "default"}
              variant={statusFilter === tab.value ? "filled" : "outlined"}
              sx={{ mb: 1 }}
            />
          );
        })}
      </Stack>

      {/* Table */}
      <ContactTable
        rows={filtered}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        onView={handleView}
        onDelete={openDeleteDialog}
      />

      {/* Detail dialog */}
      <ContactDetailDialog
        contact={detailContact}
        open={Boolean(detailContact)}
        onClose={() => setDetailContact(null)}
        onStatusChange={handleStatusChange}
        onDelete={(id) => {
          const target = contacts.find((c) => c.id === id);
          if (target) openDeleteDialog(target);
        }}
      />

      {/* Delete confirm dialog */}
      <DeleteContactDialog
        open={Boolean(deleteTarget)}
        contactName={deleteTarget?.fullName ?? ""}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { if (!deleting) setDeleteTarget(null); }}
      />

      {/* Feedback snackbar */}
      <AlertSnackbar
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default ContactsView;
