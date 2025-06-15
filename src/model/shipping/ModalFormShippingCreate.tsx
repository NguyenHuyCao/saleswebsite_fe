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

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    code: string;
    apiUrl: string | null;
    active: boolean;
  }) => void;
}

const ModalFormShippingCreate = ({ open, onClose, onSubmit }: Props) => {
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

  const handleSubmit = () => {
    if (!name.trim() || !code.trim()) return;
    onSubmit({ name, code, apiUrl, active });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock={true}>
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
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || !code.trim()}
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

export default ModalFormShippingCreate;
