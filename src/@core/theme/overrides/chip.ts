import { Theme } from "@mui/material/styles";
const rgb = (t: Theme) =>
  (t.palette as any).customColors?.mainChannel || "58, 53, 65";

const Chip = (theme: Theme) => ({
  MuiChip: {
    styleOverrides: {
      outlined: {
        "&.MuiChip-colorDefault": {
          borderColor: `rgba(${rgb(theme)}, 0.22)`,
        },
      },
      deleteIcon: { width: 18, height: 18 },
    },
  },
});
export default Chip;
