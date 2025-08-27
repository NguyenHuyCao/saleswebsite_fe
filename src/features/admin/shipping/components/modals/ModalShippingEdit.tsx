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
import { useEffect, useState } from "react";
import type { ShippingPartner, UpdateShippingPartner } from "../../types";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: ShippingPartner;
  onSubmit: (data: UpdateShippingPartner) => Promise<void> | void;
};

export default function ModalShippingEdit({
  open,
  onClose,
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<UpdateShippingPartner>({
    name: "",
    apiUrl: "",
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      name: initialData.name,
      apiUrl: initialData.apiUrl,
      active: initialData.active,
    });
  }, [initialData]);

  const handleChange =
    (k: keyof UpdateShippingPartner) =>
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
      <DialogTitle>Chỉnh sửa đơn vị vận chuyển</DialogTitle>
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
            label="API URL"
            value={form.apiUrl ?? ""}
            onChange={handleChange("apiUrl")}
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
