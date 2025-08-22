import { Theme } from "@mui/material/styles";
const rgb = (t: Theme) => (t.palette as any).customColors?.main || "58, 53, 65";

const Switch = (theme: Theme) => ({
  MuiSwitch: {
    styleOverrides: {
      root: {
        "& .MuiSwitch-track": { backgroundColor: `rgb(${rgb(theme)})` },
      },
    },
  },
});
export default Switch;
