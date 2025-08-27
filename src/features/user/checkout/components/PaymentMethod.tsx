"use client";

import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { PaymentMethod } from "../types";

export default function PaymentMethod({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight="bold">
            Thanh toán
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RadioGroup
            value={value}
            onChange={(e) => onChange(e.target.value as PaymentMethod)}
          >
            <Tooltip title="Bạn sẽ chuyển khoản qua ngân hàng">
              <FormControlLabel
                value="bank"
                control={<Radio />}
                label={
                  <>
                    <CreditCardIcon fontSize="small" /> Chuyển khoản
                  </>
                }
              />
            </Tooltip>
            <Tooltip title="Thanh toán khi nhận hàng">
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label={
                  <>
                    <AttachMoneyIcon fontSize="small" /> Thu hộ (COD)
                  </>
                }
              />
            </Tooltip>
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}
