"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Fade,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareIcon from "@mui/icons-material/Compare";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import BrandMegaMenu from "@/features/user/brand/components/BrandMegaMenu";
import { api, toApiError } from "@/lib/api/http";
import { fetcherWithToken } from "@/lib/utils/fetcherWithToken";
import {
  CART_COUNT_KEY,
  WISHLIST_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";

// Nếu dự án đã có sẵn types Category/BrandWithCategories thì giữ nguyên.
// Tại đây chỉ dùng lại như code cũ.
const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categoriesRawData, setCategoriesRawData] = useState<Category[]>([]);
  const [brandsData, setBrandsData] = useState<BrandWithCategories[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const { data: cartCount = 0 } = useSWR(CART_COUNT_KEY, fetcherWithToken);
  const { data: wishlistCount = 0 } = useSWR(WISHLIST_COUNT_KEY, fetcherWithToken);
  const { data: ordersCount = 0 } = useSWR(ORDERS_COUNT_KEY, fetcherWithToken);

  useEffect(() => {
    const controller = new AbortController();

    const normalize = <T,>(d: any): T[] => {
      // unwrap của api.get() trả về thẳng "data".
      // Một số API có thể trả { result: [...] } hoặc là array trực tiếp.
      if (Array.isArray(d)) return d as T[];
      if (Array.isArray(d?.result)) return d.result as T[];
      if (Array.isArray(d?.items)) return d.items as T[];
      return [];
    };

    (async () => {
      try {
        const [cats, brands] = await Promise.all([
          api.get<any>("/api/v1/categories", { signal: controller.signal }),
          api.get<any>("/api/v1/brands", { signal: controller.signal }),
        ]);

        setCategoriesRawData(normalize<Category>(cats));
        setBrandsData(normalize<BrandWithCategories>(brands));
      } catch (e) {
        if ((e as any)?.name === "CanceledError") return;
        console.warn("Lỗi khi lấy dữ liệu:", toApiError(e).message);
        setCategoriesRawData([]);
        setBrandsData([]);
      }
    })();

    return () => controller.abort();
  }, []);

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Thương hiệu", href: "/brand" },
    { label: "Sản phẩm", href: "/product" },
    { label: "Khuyến mãi", href: "/promotion" },
    { label: "Tin tức", href: "/new" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Hệ thống cửa hàng", href: "/system" },
  ];

  if (isMobile) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#fff",
          // safe area cho màn hình notch (iPhone X+)
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
            // 5 items căn đều
            "& .MuiBottomNavigationAction-root": {
              flex: 1,
              minWidth: 0,
              maxWidth: "none",
              padding: "6px 2px 4px",
              color: "#9e9e9e",
              // icon 22px
              "& .MuiSvgIcon-root": {
                fontSize: 22,
              },
              // text 10px — ghim cả trạng thái selected (MUI tự tăng lên)
              "& .MuiBottomNavigationAction-label": {
                fontSize: "10px",
                lineHeight: 1.3,
                marginTop: "3px",
                whiteSpace: "nowrap",
                overflow: "visible",
                textOverflow: "clip",
                "&.Mui-selected": {
                  fontSize: "10px",
                },
              },
              // active: cam
              "&.Mui-selected": {
                color: "#f25c05",
              },
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
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 4,
          bgcolor: "#ffb700",
          py: 0.5,
        }}
      >
        {/* DANH MỤC SẢN PHẨM BUTTON + MEGA MENU */}
        <Box
          onMouseEnter={() => setShowMegaMenu(true)}
          onMouseLeave={() => setShowMegaMenu(false)}
          sx={{ position: "relative" }}
        >
          <Button
            variant="contained"
            startIcon={<AppsIcon />}
            sx={{
              bgcolor: "black",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              minWidth: { xs: 200, md: 250 },
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderRadius: 1,
              boxShadow: 2,
              "&:hover": { bgcolor: "#f25c05" },
            }}
          >
            DANH MỤC SẢN PHẨM
          </Button>

          {/* Chỉ hiển thị khi có dữ liệu và showMegaMenu = true */}
          {brandsData.length > 0 && categoriesRawData.length > 0 && (
            <Fade in={showMegaMenu} timeout={300}>
              <Box
                onMouseLeave={() => setShowMegaMenu(false)}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1400,
                  minWidth: 300,
                  maxWidth: 800,
                }}
              >
                <BrandMegaMenu
                  brands={brandsData}
                  categories={categoriesRawData}
                />
              </Box>
            </Fade>
          )}
        </Box>

        {/* LINKS */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            overflowX: "auto",
            whiteSpace: "nowrap",
            justifyContent: "flex-start",
            flexGrow: 1,
            px: { xs: 1, sm: 3, md: 2 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            maxWidth: "100%",
          }}
        >
          {navLinks.map(({ label, href }) => (
            <Box
              key={label}
              onClick={() => router.push(href)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 1,
                height: "100%",
                minHeight: "44px",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.3s ease",
                "&:hover .text": { color: "#f25c05" },
              }}
            >
              <Typography
                className="text"
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: pathname === href ? "#f25c05" : "#000",
                  borderBottom:
                    pathname === href
                      ? "2px solid #f25c05"
                      : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default NavMenu;
