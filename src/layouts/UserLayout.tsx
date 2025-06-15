"use client";

import { ReactNode } from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";

// ** Layout Imports
import VerticalLayout from "src/@core/layouts/VerticalLayout";

// ** Navigation Imports
import VerticalNavItems from "src/navigation/vertical";

// ** Component Imports
import VerticalAppBarContent from "./components/vertical/AppBarContent";

// ** Hook Import
import { useSettings } from "src/@core/hooks/useSettings";

interface Props {
  children: ReactNode;
}

const UserLayout = ({ children }: Props) => {
  // ** Settings Hook
  const { settings, saveSettings } = useSettings();

  // ** Responsive: hide nav on smaller screens
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  // ** Optional promotion/image placeholder (currently unused)
  const UpgradeToProImg = () => (
    <Box sx={{ mx: "auto" }}>{/* Optional content like upgrade banner */}</Box>
  );

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={VerticalNavItems()}
      afterVerticalNavMenuContent={UpgradeToProImg}
      verticalAppBarContent={({ toggleNavVisibility }) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={toggleNavVisibility}
        />
      )}
    >
      <Container maxWidth="xl">{children}</Container>
    </VerticalLayout>
  );
};

export default UserLayout;
