"use client";
import Box from "@mui/material/Box";
import { Settings } from "src/@core/context/settingsContext";

import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";
import NotificationDropdown from "src/@core/layouts/components/shared-components/NotificationDropdown";
import { Container } from "@mui/material";
import AdminSearchInput from "../searchAdmin/AdminSearchInput";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;


  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AdminSearchInput
          hidden={hidden}
          toggleNavVisibility={toggleNavVisibility}
        />
        <Box
          className="actions-right"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <NotificationDropdown />
          <UserDropdown />
        </Box>
      </Box>
    </Container>
  );
};

export default AppBarContent;
