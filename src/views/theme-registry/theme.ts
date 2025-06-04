"use client";
import { createTheme } from "@mui/material/styles";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"], // hoặc ['vietnamese'] nếu cần Tiếng Việt chuẩn
  weight: ["400", "500", "700"], // chọn các mức độ đậm bạn dùng
  display: "swap", // tối ưu hiển thị
});

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: quicksand.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
});

export default theme;
