"use client";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import type { Contact, ContactStatus } from "../types";

type Props = {
  rows: Contact[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onView: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

const STATUS_META: Record<ContactStatus, { label: string; color: "default" | "warning" | "info" | "success" | "error" }> = {
  NEW:     { label: "Mới",        color: "warning" },
  READ:    { label: "Đã xem",     color: "info" },
  REPLIED: { label: "Đã trả lời", color: "success" },
  CLOSED:  { label: "Đã đóng",    color: "default" },
};

const MAX_MSG = 80;

const ContactTable = ({
  rows,
  isLoading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onDelete,
}: Props) => {
  const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }} elevation={2}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 56 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Người gửi</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Email / SĐT</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Chủ đề</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 260 }}>Nội dung</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 130 }}>Ngày gửi</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 96 }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton animation="wave" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : paged.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">Không có dữ liệu</Typography>
                    </TableCell>
                  </TableRow>
                )
              : paged.map((row) => {
                  const meta = STATUS_META[row.status ?? "NEW"];
                  const isNew = (row.status ?? "NEW") === "NEW";
                  const preview = row.messageContent.length > MAX_MSG
                    ? row.messageContent.slice(0, MAX_MSG) + "…"
                    : row.messageContent;

                  return (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{
                        cursor: "pointer",
                        fontWeight: isNew ? 700 : 400,
                        bgcolor: isNew ? "action.hover" : "inherit",
                      }}
                      onClick={() => onView(row)}
                    >
                      <TableCell sx={{ fontWeight: isNew ? 700 : 400 }}>{row.id}</TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={isNew ? 700 : 500}
                          noWrap
                          sx={{ maxWidth: 150 }}
                        >
                          {row.fullName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {row.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.phone}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={isNew ? 700 : 400}
                          noWrap
                          sx={{ maxWidth: 180 }}
                        >
                          {row.subject}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ maxWidth: 260, whiteSpace: "normal", wordBreak: "break-word" }}
                        >
                          {preview}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip label={meta.label} color={meta.color} size="small" />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {new Date(row.createdAt).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box display="flex" justifyContent="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={() => onView(row)}>
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xoá">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(row)}
                            >
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Hiển thị"
        SelectProps={{ MenuProps: { disableScrollLock: true } }}
      />
    </Paper>
  );
};

export default ContactTable;
