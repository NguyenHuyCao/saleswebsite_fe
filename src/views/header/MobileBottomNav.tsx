"use client";

import {
  Badge,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareIcon from "@mui/icons-material/Compare";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcherWithToken } from "@/lib/utils/fetcherWithToken";
import {
  CART_COUNT_KEY,
  WISHLIST_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";

const MobileBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: cartCount = 0 } = useSWR(CART_COUNT_KEY, fetcherWithToken);
  const { data: wishlistCount = 0 } = useSWR(WISHLIST_COUNT_KEY, fetcherWithToken);
  const { data: ordersCount = 0 } = useSWR(ORDERS_COUNT_KEY, fetcherWithToken);

  return (
    <Box
      sx={{
        // CSS responsive — không dùng useMediaQuery để tránh SSR hydration mismatch
        display: { xs: "block", sm: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: "1px solid #e0e0e0",
        bgcolor: "#fff",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -1px 6px rgba(0,0,0,0.08)",
      }}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        sx={{
          height: 56,
          width: "100%",
          "& .MuiBottomNavigationAction-root": {
            flex: 1,
            minWidth: 0,
            maxWidth: "none",
            padding: "6px 2px 4px",
            color: "#9e9e9e",
            "& .MuiSvgIcon-root": { fontSize: 22 },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "10px",
              lineHeight: 1.3,
              marginTop: "3px",
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "clip",
              "&.Mui-selected": { fontSize: "10px" },
            },
            "&.Mui-selected": { color: "#f25c05" },
          },
        }}
      >
        <BottomNavigationAction
          label="Trang chủ"
          value="/"
          icon={<HomeIcon />}
          onClick={() => router.push("/")}
          aria-label="Trang chủ"
        />
        <BottomNavigationAction
          label="Sản phẩm"
          value="/product"
          icon={<AppsIcon />}
          onClick={() => router.push("/product")}
          aria-label="Sản phẩm"
        />
        <BottomNavigationAction
          label="Yêu thích"
          value="/wishlist"
          icon={
            <Badge badgeContent={wishlistCount || 0} color="error" max={99} invisible={!wishlistCount}>
              <FavoriteIcon />
            </Badge>
          }
          onClick={() => router.push("/wishlist")}
          aria-label="Yêu thích"
        />
        <BottomNavigationAction
          label="Đơn hàng"
          value="/order"
          icon={
            <Badge badgeContent={ordersCount || 0} color="error" max={99} invisible={!ordersCount}>
              <CompareIcon />
            </Badge>
          }
          onClick={() => router.push("/order")}
          aria-label="Đơn hàng"
        />
        <BottomNavigationAction
          label="Giỏ hàng"
          value="/cart"
          icon={
            <Badge badgeContent={cartCount || 0} color="error" max={99} invisible={!cartCount}>
              <ShoppingCartIcon />
            </Badge>
          }
          onClick={() => router.push("/cart")}
          aria-label="Giỏ hàng"
        />
      </BottomNavigation>
    </Box>
  );
};

export default MobileBottomNav;
