"use client";

// ** React Imports
import { ReactNode, useRef, useState } from "react";

// ** MUI Imports
import List from "@mui/material/List";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";

import dynamic from "next/dynamic";
// ** Third Party Components
const PerfectScrollbar = dynamic(() => import("react-perfect-scrollbar"), {
  ssr: false,
});

// ** Type Imports
import { Settings } from "src/@core/context/settingsContext";
import { VerticalNavItemsType } from "src/@core/layouts/types";

// ** Component Imports
import Drawer from "./Drawer";
import VerticalNavItems from "./VerticalNavItems";
import VerticalNavHeader from "./VerticalNavHeader";

// ** Util Import
import { hexToRGBA } from "@/@core/utils/hex-to-rgba";

interface Props {
  hidden: boolean;
  navWidth: number;
  settings: Settings;
  children: ReactNode;
  navVisible: boolean;
  toggleNavVisibility: () => void;
  setNavVisible: (value: boolean) => void;
  verticalNavItems?: VerticalNavItemsType;
  saveSettings: (values: Settings) => void;
  verticalNavMenuContent?: (props?: any) => ReactNode;
  afterVerticalNavMenuContent?: (props?: any) => ReactNode;
  beforeVerticalNavMenuContent?: (props?: any) => ReactNode;
}

const StyledBoxForShadow = styled(Box)<BoxProps>({
  top: 50,
  left: -8,
  zIndex: 2,
  height: 75,
  display: "none",
  position: "absolute",
  pointerEvents: "none",
  width: "calc(100% + 15px)",
  "&.d-block": {
    display: "block",
  },
});

const Navigation = (props: Props) => {
  const {
    hidden,
    afterVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent,
  } = props;

  const [groupActive, setGroupActive] = useState<string[]>([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([]);

  const shadowRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      // Lưu hàm gốc trước khi ghi đè
      const originalGetBoundingClientRect = ref.getBoundingClientRect.bind(ref);

      ref.getBoundingClientRect = () => {
        const original = originalGetBoundingClientRect(); // GỌI HÀM GỐC
        return { ...original, height: Math.floor(original.height) };
      };
    }
  };

  const scrollMenu = (container: any) => {
    const target = hidden ? container.target : container;
    if (shadowRef.current) {
      if (target.scrollTop > 0) {
        shadowRef.current.classList.add("d-block");
      } else {
        shadowRef.current.classList.remove("d-block");
      }
    }
  };

  const renderNavContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {userVerticalNavMenuContent ? (
        userVerticalNavMenuContent(props)
      ) : (
        <List
          className="nav-items"
          sx={{ transition: "padding .25s ease", pr: 4.5 }}
        >
          <VerticalNavItems
            groupActive={groupActive}
            setGroupActive={setGroupActive}
            currentActiveGroup={currentActiveGroup}
            setCurrentActiveGroup={setCurrentActiveGroup}
            {...props}
          />
        </List>
      )}
    </Box>
  );

  return (
    <Drawer {...props}>
      <VerticalNavHeader {...props} />
      <StyledBoxForShadow
        ref={shadowRef}
        sx={{
          background: `linear-gradient(${
            theme.palette.background.default
          } 40%,${hexToRGBA(
            theme.palette.background.default,
            0.1
          )} 95%,${hexToRGBA(theme.palette.background.default, 0.05)})`,
        }}
      />

      <Box sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
        {hidden ? (
          <Box
            onScroll={scrollMenu}
            sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
          >
            {renderNavContent()}
          </Box>
        ) : (
          <PerfectScrollbar
            options={{ wheelPropagation: false }}
            containerRef={(ref: any) => handleInfiniteScroll(ref)}
            onScrollY={scrollMenu}
          >
            {renderNavContent()}
          </PerfectScrollbar>
        )}
      </Box>

      {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}
    </Drawer>
  );
};

export default Navigation;
