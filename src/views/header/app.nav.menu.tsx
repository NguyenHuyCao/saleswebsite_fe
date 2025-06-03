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
          fetch("http://localhost:8080/api/v1/categories"),
          fetch("http://localhost:8080/api/v1/brands"),
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
          />
          <BottomNavigationAction
            label="Sản phẩm"
            icon={<AppsIcon />}
            onClick={() => router.push("/product")}
          />
          <BottomNavigationAction
            label="Yêu thích"
            icon={<FavoriteIcon />}
            onClick={() => router.push("/wishlist")}
          />
          <BottomNavigationAction
            label="Đơn hàng"
            icon={<CompareIcon />}
            onClick={() => router.push("/order")}
          />
          <BottomNavigationAction
            label="Giỏ hàng"
            icon={<ShoppingCartIcon />}
            onClick={() => router.push("/cart")}
          />
        </BottomNavigation>
      </Box>
    );
  }

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
              minWidth: "250px",
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            DANH MỤC SẢN PHẨM
          </Button>

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
        </Box>

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
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 1,
                height: "100%",
                minHeight: "44px",
                cursor: "pointer",
                flexShrink: 0,
                transition: "color 0.2s, background-color 0.2s",
              }}
              onClick={() => router.push(href)}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: pathname === href ? "#f25c05" : "#000",
                  borderBottom:
                    pathname === href ? "2px solid #f25c05" : "none",
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
