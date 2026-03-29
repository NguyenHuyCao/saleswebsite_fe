"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import UserTablePage from "./UserTablePage";
import UserEditDialog from "./UserEditDialog";
import type { User } from "../types";

export default function ClientOnlyUsersPage() {
  const [editUser, setEditUser] = useState<User | null>(null);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700 }}>
          Quản lý người dùng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xem, chỉnh sửa, khoá tài khoản và xuất dữ liệu người dùng
        </Typography>
      </Box>

      <UserTablePage onEdit={(u) => setEditUser(u)} />

      <UserEditDialog
        user={editUser}
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
      />
    </Box>
  );
}
