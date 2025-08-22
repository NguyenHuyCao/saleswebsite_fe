"use client";
import { ReactNode } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import MuiToolbar, { ToolbarProps } from "@mui/material/Toolbar";
import type { Settings } from "src/@core/context/settingsContext";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (v: Settings) => void;
  verticalAppBarContent?: (p?: any) => ReactNode;
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: "none",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 6),
  backgroundColor: "rgba(255,255,255,0.6)",
  backdropFilter: "saturate(180%) blur(8px)",
  color: theme.palette.text.primary,
  minHeight: theme.mixins.toolbar.minHeight,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));
const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: "100%",
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  padding: `${theme.spacing(0)} !important`,
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
}));

export default function LayoutAppBar(props: Props) {
  const { settings, verticalAppBarContent: Slot } = props;
  const theme = useTheme();
  const { contentWidth } = settings;

  return (
    <AppBar
      elevation={0}
      color="default"
      className="layout-navbar"
      position="sticky"
    >
      <Toolbar
        className="navbar-content-container"
        sx={{
          ...(contentWidth === "boxed" && {
            "@media (min-width:1440px)": {
              maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)`,
            },
          }),
        }}
      >
        {Slot ? Slot(props) : null}
      </Toolbar>
    </AppBar>
  );
}
