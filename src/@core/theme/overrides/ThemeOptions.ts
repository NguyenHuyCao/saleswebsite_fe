import { deepmerge } from "@mui/utils";
import { ThemeOptions } from "@mui/material";
import { Settings } from "src/@core/context/settingsContext";

import DefaultPalette from "@/@core/theme/palette";
import spacing from "@/@core/theme/spacing";
import Shadows from "@/@core/theme/shadows";
import breakpoints from "@/@core/theme/breakpoints";

export const FONT_FAMILY = [
  "Quicksand",
  '"Quicksand Fallback"',
  "Inter",
  "sans-serif",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
].join(",");

const themeOptions = (settings: Settings): ThemeOptions => {
  const { mode, themeColor } = settings;

  const base: ThemeOptions = {
    palette: DefaultPalette(mode, themeColor),
    typography: { fontFamily: FONT_FAMILY },
    shadows: Shadows(mode), // ✅ không import từ node_modules/esm
    ...spacing,
    breakpoints: breakpoints(),
    shape: { borderRadius: 8 },
    mixins: { toolbar: { minHeight: 64 } },
  };

  return deepmerge(base, {
    palette: { primary: { ...(base.palette as any)[themeColor] } },
  });
};

export default themeOptions;
