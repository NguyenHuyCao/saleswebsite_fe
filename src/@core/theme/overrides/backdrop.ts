import { Theme } from "@mui/material/styles";
import { hexToRGBA } from "@/@core/utils/hex-to-rgba";

const rgb = (t: Theme) => (t.palette as any).customColors?.main || "58, 53, 65";

const Backdrop = (theme: Theme) => ({
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor:
          theme.palette.mode === "light"
            ? `rgba(${rgb(theme)}, 0.7)`
            : hexToRGBA(theme.palette.background.default, 0.7),
      },
      invisible: { backgroundColor: "transparent" },
    },
  },
});
export default Backdrop;
