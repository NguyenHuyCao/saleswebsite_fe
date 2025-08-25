"use client";

// ** React Imports
import { ElementType } from "react";

// ** Next Imports
import { usePathname, useRouter } from "next/navigation";

// ** MUI Imports
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Types
import { NavLink } from "src/@core/layouts/types";
import { Settings } from "src/@core/context/settingsContext";

// ** Custom Components
import UserIcon from "@/components/layouts/components/UserIcon";
import NextLinkComposed from "../../NextLinkComposed";

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { to?: string; target?: string; rel?: string }
>(({ theme }) => ({
  width: "100%",
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: "opacity .25s ease-in-out",
  "&.active, &.active:hover": {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`,
  },
  "&.active .MuiTypography-root, &.active .MuiSvgIcon-root": {
    color: `${theme.palette.common.white} !important`,
  },
}));

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "opacity .25s ease-in-out",
  ...(themeConfig.menuTextTruncate && { overflow: "hidden" }),
}));

interface Props {
  item: NavLink;
  settings: Settings;
  navVisible?: boolean;
  toggleNavVisibility: () => void;
}

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const IconTag = item.icon as ElementType;
  const isActive = pathname === item.path;

  return (
    <ListItem
      disablePadding
      className="nav-link"
      sx={{ mt: 1.5, px: "0 !important" }}
    >
      <MenuNavLink
        component={NextLinkComposed}
        to={item.path || "/"}
        className={isActive ? "active" : ""}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          if (!item.path) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (navVisible) toggleNavVisibility();
        }}
        sx={{
          pl: 5.5,
          ...(item.disabled
            ? { pointerEvents: "none", opacity: 0.5 }
            : { cursor: "pointer" }),
        }}
      >
        <ListItemIcon
          sx={{
            mr: 2.5,
            color: "text.primary",
            transition: "margin .25s ease-in-out",
          }}
        >
          <UserIcon icon={IconTag} />
        </ListItemIcon>

        <MenuItemTextMetaWrapper>
          <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>
            {item.title}
          </Typography>
          {item.badgeContent ? (
            <Chip
              label={item.badgeContent}
              color={item.badgeColor || "primary"}
              sx={{
                height: 20,
                fontWeight: 500,
                marginLeft: 1.25,
                "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
              }}
            />
          ) : null}
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    </ListItem>
  );
};

export default VerticalNavLink;
