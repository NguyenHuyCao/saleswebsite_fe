"use client";

import { Box, useTheme, useMediaQuery } from "@mui/material";

import TopBar from "./app.topbar";
import MainToolbar from "./app.main.toolbar";
import NavMenu from "./app.nav.menu";

const AppHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#ffb700",
        pb: isMobile ? 7 : 0, // để chừa chỗ cho nav dưới
        // overflowX: "hidden", // tránh tràn ngang
        // overflowY: "hidden",
      }}
    >
      {/* Thanh trên cùng */}
      <TopBar />

      {/* Thanh chính AppBar */}
      <MainToolbar />

      {/* Menu điều hướng */}
      <NavMenu isMobile={isMobile} />
    </Box>
  );
};

export default AppHeader;
