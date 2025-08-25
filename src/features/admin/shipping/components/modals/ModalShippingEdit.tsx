// src/features/admin/shipping/components/modals/ModalShippingEdit.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import type { ShippingPartner } from "../../../shipping/types";

export default function ModalShippingEdit({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    apiUrl: string | null;
    active: boolean;
  }) => void;
  initialData: ShippingPartner | null;
}) {
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setApiUrl(initialData.apiUrl);
      setActive(initialData.active);
    }
    if (!open) {
      setName("");
      setApiUrl(null);
      setActive(true);
    }
  }, [open, initialData]);

  const submit = () => {
    if (!name.trim()) return;
    onSubmit({ name, apiUrl, active });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock>
      <DialogTitle>Chỉnh sửa đơn vị vận chuyển</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Tên đơn vị"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Mã đơn vị"
          fullWidth
          value={initialData?.code || ""}
          InputProps={{ readOnly: true }}
          sx={{ opacity: 0.6 }}
        />
        <TextField
          label="API URL (nếu có)"
          fullWidth
          value={apiUrl ?? ""}
          onChange={(e) => setApiUrl(e.target.value || null)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          }
          label="Hoạt động"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim()}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
