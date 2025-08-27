"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { CreateShippingPartner } from "../../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateShippingPartner) => Promise<void> | void;
};

export default function ModalShippingCreate({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateShippingPartner>({
    name: "",
    code: "",
    apiUrl: "",
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (k: keyof CreateShippingPartner) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({
        ...s,
        [k]: k === "active" ? e.target.checked : e.target.value,
      }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm đơn vị vận chuyển</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Tên đơn vị"
            value={form.name}
            onChange={handleChange("name")}
            required
            fullWidth
          />
          <TextField
            label="Mã đơn vị"
            value={form.code}
            onChange={handleChange("code")}
            required
            fullWidth
          />
          <TextField
            label="API URL"
            value={form.apiUrl ?? ""}
            onChange={handleChange("apiUrl")}
            placeholder="https://api.example.com/webhook …"
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch checked={form.active} onChange={handleChange("active")} />
            }
            label="Hoạt động"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
