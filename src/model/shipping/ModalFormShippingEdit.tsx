// File: model/shipping/ModalFormShippingEdit.tsx
"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";

interface ShippingPartnerEdit {
  id: number;
  name: string;
  code: string;
  apiUrl: string | null;
  active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    apiUrl: string | null;
    active: boolean;
  }) => void;
  initialData: ShippingPartnerEdit | null;
}

const ModalFormShippingEdit = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) => {
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

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name, apiUrl, active });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock={true}>
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim()}
          sx={{
            backgroundColor: "#ff700",
            "&:hover": { backgroundColor: "#e65f00" },
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormShippingEdit;
