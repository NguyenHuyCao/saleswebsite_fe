import { Theme } from "@mui/material/styles";
const rgb = (t: Theme) =>
  (t.palette as any).customColors?.mainChannel || "58, 53, 65";

export default (theme: Theme) => ({
  MuiInputLabel: {
    styleOverrides: { root: { color: theme.palette.text.secondary } },
  },
  MuiInput: {
    styleOverrides: {
      root: {
        "&:before": { borderBottom: `1px solid rgba(${rgb(theme)}, 0.22)` },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: `1px solid rgba(${rgb(theme)}, 0.32)`,
        },
        "&.Mui-disabled:before": {
          borderBottom: `1px solid ${theme.palette.text.disabled}`,
        },
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        backgroundColor: `rgba(${rgb(theme)}, 0.04)`,
        "&:hover:not(.Mui-disabled)": {
          backgroundColor: `rgba(${rgb(theme)}, 0.08)`,
        },
        "&:before": { borderBottom: `1px solid rgba(${rgb(theme)}, 0.22)` },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: `1px solid rgba(${rgb(theme)}, 0.32)`,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
          borderColor: `rgba(${rgb(theme)}, 0.32)`,
        },
        "&:hover.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `rgba(${rgb(theme)}, 0.22)`,
        },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.text.disabled,
        },
      },
    },
  },
});
