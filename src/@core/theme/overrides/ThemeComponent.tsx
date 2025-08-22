"use client";

import { ReactNode, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";

import { Settings } from "@/@core/context/settingsContext";
import themeConfig from "@/configs/themeConfig";

import overrides from "./overrides";
import Typography from "@/@core/theme/typography";
import themeOptions from "@/@core/theme/overrides/ThemeOptions"; 
import GlobalStyling from "../globalStyles";


interface Props { settings: Settings; children: ReactNode }

const ThemeComponent = ({ settings, children }: Props) => {
  const theme = useMemo(() => {
    let base = createTheme(themeOptions(settings));
    let themed = createTheme(base, {
      components: { ...overrides(base) },
      typography: { ...Typography(base) },
    });
    if (themeConfig.responsiveFontSizes) themed = responsiveFontSizes(themed);
    return themed;
  }, [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme) as any} />
      {children}
    </ThemeProvider>
  );
};

export default ThemeComponent;
