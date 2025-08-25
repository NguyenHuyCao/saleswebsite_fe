// ==================== React & MUI Imports ====================
import { ElementType } from "react";
import { SvgIconProps } from "@mui/material";

// ==================== Props Interface ====================
interface UserIconProps {
  iconProps?: SvgIconProps;
  icon: ElementType; // Component, e.g., HomeOutlineIcon
}

// ==================== UserIcon Component ====================
const UserIcon = ({ icon: IconTag, iconProps }: UserIconProps) => {
  return <IconTag {...iconProps} />;
};

export default UserIcon;
