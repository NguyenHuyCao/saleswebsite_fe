// src/features/admin/shipping/components/modals/ModalShippingCreate.tsx
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

export default function ModalShippingCreate({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    code: string;
    apiUrl: string | null;
    active: boolean;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) {
      setName("");
      setCode("");
      setApiUrl(null);
      setActive(true);
    }
  }, [open]);

  const submit = () => {
    if (!name.trim() || !code.trim()) return;
    onSubmit({ name, code, apiUrl, active });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock>
      <DialogTitle>Thêm đơn vị vận chuyển</DialogTitle>
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
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        <Button
          variant="contained"
          onClick={submit}
          disabled={!name.trim() || !code.trim()}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
