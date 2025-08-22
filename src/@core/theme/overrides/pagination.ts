import { Theme } from "@mui/material/styles";
import { hexToRGBA } from "@/@core/utils/hex-to-rgba";

const rgb = (t: Theme) => (t.palette as any).customColors?.main || "58, 53, 65";

const Pagination = (theme: Theme) => ({
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        "&.Mui-selected:not(.Mui-disabled):not(.MuiPaginationItem-textPrimary):not(.MuiPaginationItem-textSecondary):hover":
          { backgroundColor: `rgba(${rgb(theme)}, 0.12)` },
      },
      outlined: { borderColor: `rgba(${rgb(theme)}, 0.22)` },
      outlinedPrimary: {
        "&.Mui-selected": {
          backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
          "&:hover": {
            backgroundColor: `${hexToRGBA(
              theme.palette.primary.main,
              0.2
            )} !important`,
          },
        },
      },
      outlinedSecondary: {
        "&.Mui-selected": {
          backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12),
          "&:hover": {
            backgroundColor: `${hexToRGBA(
              theme.palette.secondary.main,
              0.2
            )} !important`,
          },
        },
      },
    },
  },
});
export default Pagination;
