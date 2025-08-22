// ** Type Imports
import { PaletteMode } from "@mui/material";
import { ThemeColor } from "src/@core/layouts/types";

const BRAND_PRIMARY = "#ffb700";
const BRAND_SECONDARY = "#f25c05";

const DefaultPalette = (mode: PaletteMode, themeColor: ThemeColor) => {
  const lightChannel = "58, 53, 65";
  const darkChannel = "231, 227, 252";
  const channel = mode === "light" ? lightChannel : darkChannel;

  const primaryGradient = () => {
    if (themeColor === "primary") return "#FFC866";
    if (themeColor === "secondary") return "#FF9966";
    if (themeColor === "success") return "#93DD5C";
    if (themeColor === "error") return "#FF8C90";
    if (themeColor === "warning") return "#FFCF5C";
    return "#6ACDFF";
  };

  return {
    // 👇 thêm mainChannel; main là màu hợp lệ
    customColors: {
      main: `rgb(${channel})`,
      mainChannel: channel,
      primaryGradient: primaryGradient(),
      tableHeaderBg: mode === "light" ? "#F9FAFC" : "#3D3759",
    },
    common: { black: "#000", white: "#FFF" },
    mode,

    primary: {
      light: "#ffc53b",
      main: BRAND_PRIMARY,
      dark: "#cc9200",
      contrastText: "#000",
    },
    secondary: {
      light: "#ff8542",
      main: BRAND_SECONDARY,
      dark: "#c24804",
      contrastText: "#fff",
    },
    success: {
      light: "#6AD01F",
      main: "#56CA00",
      dark: "#4CB200",
      contrastText: "#FFF",
    },
    error: {
      light: "#FF6166",
      main: "#FF4C51",
      dark: "#E04347",
      contrastText: "#FFF",
    },
    warning: {
      light: "#FFCA64",
      main: "#FFB400",
      dark: "#E09E00",
      contrastText: "#FFF",
    },
    info: {
      light: "#32BAFF",
      main: "#16B1FF",
      dark: "#139CE0",
      contrastText: "#FFF",
    },

    grey: {
      /* giữ nguyên như của bạn */
    },

    // các màu sử dụng channel cho rgba()
    text: {
      primary: `rgba(${channel}, 0.87)`,
      secondary: `rgba(${channel}, 0.68)`,
      disabled: `rgba(${channel}, 0.38)`,
    },
    divider: `rgba(${channel}, 0.12)`,
    background: {
      paper: mode === "light" ? "#FFF" : "#312D4B",
      default: mode === "light" ? "#F7F7F7" : "#28243D",
    },
    action: {
      active: `rgba(${channel}, 0.54)`,
      hover: `rgba(${channel}, 0.04)`,
      selected: `rgba(${channel}, 0.08)`,
      disabled: `rgba(${channel}, 0.3)`,
      disabledBackground: `rgba(${channel}, 0.18)`,
      focus: `rgba(${channel}, 0.12)`,
    },
  };
};

export default DefaultPalette;
