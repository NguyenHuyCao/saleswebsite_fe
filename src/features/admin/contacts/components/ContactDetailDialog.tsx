"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import type { Contact, ContactStatus } from "../types";

interface Props {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: ContactStatus) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<ContactStatus, { label: string; color: "default" | "warning" | "info" | "success" | "error" }> = {
  NEW:     { label: "Mới",       color: "warning" },
  READ:    { label: "Đã xem",    color: "info" },
  REPLIED: { label: "Đã trả lời", color: "success" },
  CLOSED:  { label: "Đã đóng",   color: "default" },
};

const ALL_STATUSES: ContactStatus[] = ["NEW", "READ", "REPLIED", "CLOSED"];

export default function ContactDetailDialog({ contact, open, onClose, onStatusChange, onDelete }: Props) {
  if (!contact) return null;

  const handleStatusChange = (status: ContactStatus) => {
    onStatusChange(contact.id, status);
  };

  const handleDelete = () => {
    onDelete(contact.id);
    onClose();
  };

  const statusMeta = STATUS_LABELS[contact.status ?? "NEW"];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: 340 }}>
            {contact.subject}
          </Typography>
          <Chip label={statusMeta.label} color={statusMeta.color} size="small" />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Sender info */}
        <Stack spacing={1.5} mb={3}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <PersonOutlined fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" width={100}>Họ tên</Typography>
            <Typography variant="body2" fontWeight={500}>{contact.fullName}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <EmailOutlined fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" width={100}>Email</Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              component="a"
              href={`mailto:${contact.email}`}
              sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              {contact.email}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <PhoneOutlined fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" width={100}>Điện thoại</Typography>
            <Typography variant="body2" fontWeight={500}>{contact.phone}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="body2" color="text.secondary" ml={3.5} width={100}>Ngày gửi</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(contact.createdAt).toLocaleString("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Message */}
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Nội dung
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.75,
          }}
        >
          <Typography variant="body2">{contact.messageContent}</Typography>
        </Box>

        {/* Status changer */}
        <Box mt={3} display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
            Đổi trạng thái:
          </Typography>
          <Select
            size="small"
            value={contact.status ?? "NEW"}
            onChange={(e) => handleStatusChange(e.target.value as ContactStatus)}
            MenuProps={{ disableScrollLock: true }}
            sx={{ minWidth: 150 }}
          >
            {ALL_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                <Chip label={STATUS_LABELS[s].label} color={STATUS_LABELS[s].color} size="small" />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Tooltip title="Mở email client để trả lời">
          <Button
            variant="outlined"
            startIcon={<EmailOutlined />}
            href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
            component="a"
          >
            Trả lời email
          </Button>
        </Tooltip>
        <Box display="flex" gap={1}>
          <Button color="error" variant="outlined" onClick={handleDelete}>
            Xoá
          </Button>
          <Button variant="contained" onClick={onClose}>
            Đóng
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
