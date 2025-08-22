import { Theme } from "@mui/material/styles";

import MuiCard from "./card";
import MuiChip from "./chip";
import MuiInput from "./input";
import MuiButton from "./button";
import MuiTable from "./table";
import MuiDialog from "./dialog";
import Typography from "../typography";
import MuiMenu from "./menu";
import MuiList from "./list";
import MuiSelect from "./select";
import MuiTabs from "./tabs";
import MuiAvatar from "./avatars";
import MuiBackdrop from "./backdrop";
import MuiDivider from "./divider";
import MuiPagination from "./pagination";
import MuiPopover from "./popover";
import MuiRating from "./rating";
import MuiSnackbar from "./snackbar";
import MuiSwitches from "./switches";
import MuiTimeline from "./timeline";
import MuiToggleButton from "./toggleButton";
import MuiDateTimePicker from "./dateTimePicker";

// File trả về object components
const overrides = (theme: Theme) =>
  Object.assign(
    MuiCard(theme),
    MuiChip(theme),
    MuiInput(theme),
    MuiButton(theme),
    MuiTable(theme),
    MuiDialog(theme),
    Typography(theme),
    MuiMenu(theme),
    MuiList(theme),
    MuiSelect(theme),
    MuiTabs(theme),
    MuiAvatar(theme),
    MuiBackdrop(theme),
    MuiDivider(theme),
    MuiPagination(theme),
    MuiPopover(theme),
    MuiRating(theme),
    MuiSnackbar(theme),
    MuiSwitches(theme),
    MuiTimeline(theme),
    MuiToggleButton,
    MuiDateTimePicker(theme)
  );

export default overrides;
