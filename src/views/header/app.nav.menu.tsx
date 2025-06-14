"use client";

import {
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
import BrandMegaMenu from "@/components/brand/BrandMegaMenu";

interface Product {
  name: string;
  active: boolean;
  brand?: { id: number };
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categoriesRawData, setCategoriesRawData] = useState<Category[]>([]);
  const [brandsData, setBrandsData] = useState<Brand[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();

        if (catRes.ok) setCategoriesRawData(catData.data.result || []);
        if (brandRes.ok) setBrandsData(brandData.data.result || []);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();
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
          borderTop: "1px solid #ddd",
          bgcolor: "#fff",
        }}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Trang chủ"
            icon={<HomeIcon />}
            onClick={() => router.push("/")}
            aria-label="Trang chủ"
          />
          <BottomNavigationAction
            label="Sản phẩm"
            icon={<AppsIcon />}
            onClick={() => router.push("/product")}
            aria-label="Sản phẩm"
          />
          <BottomNavigationAction
            label="Yêu thích"
            icon={<FavoriteIcon />}
            onClick={() => router.push("/wishlist")}
            aria-label="Yêu thích"
          />
          <BottomNavigationAction
            label="Đơn hàng"
            icon={<CompareIcon />}
            onClick={() => router.push("/order")}
            aria-label="Đơn hàng"
          />
          <BottomNavigationAction
            label="Giỏ hàng"
            icon={<ShoppingCartIcon />}
            onClick={() => router.push("/cart")}
            aria-label="Giỏ hàng"
          />
        </BottomNavigation>
      </Box>
    );
  }

  return (
    <Container>
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
            sx={{
              bgcolor: "black",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              minWidth: 250,
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderRadius: 1,
              boxShadow: 2,
              "&:hover": {
                bgcolor: "#f25c05",
              },
            }}
          >
            DANH MỤC SẢN PHẨM
          </Button>

          {brandsData.length > 0 && categoriesRawData.length > 0 && (
            <Fade in={showMegaMenu} timeout={300}>
              <Box
                onMouseLeave={() => setShowMegaMenu(false)}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
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
                "&:hover .text": {
                  color: "#f25c05",
                },
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
