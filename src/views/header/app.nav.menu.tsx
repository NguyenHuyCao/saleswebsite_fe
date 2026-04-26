"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandMegaMenu from "@/features/user/brand/components/BrandMegaMenu";
import { api, toApiError } from "@/lib/api/http";

const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categoriesRawData, setCategoriesRawData] = useState<Category[]>([]);
  const [brandsData, setBrandsData] = useState<BrandWithCategories[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const closeTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounce close 100ms — prevents flickering when crossing the micro-gap
  // between the button bottom edge and the mega menu top edge
  const show = () => { clearTimeout(closeTimerRef.current); setShowMegaMenu(true); };
  const hide = () => { closeTimerRef.current = setTimeout(() => setShowMegaMenu(false), 100); };

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  useEffect(() => {
    const controller = new AbortController();

    const normalize = <T,>(d: any): T[] => {
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

  if (isMobile) return null;

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
          onMouseEnter={show}
          onMouseLeave={hide}
          sx={{ position: "relative" }}
        >
          <Button
            variant="contained"
            startIcon={
              <motion.div
                animate={{ rotate: showMegaMenu ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <AppsIcon />
              </motion.div>
            }
            sx={{
              bgcolor: showMegaMenu ? "#f25c05" : "black",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              minWidth: { xs: 200, md: 250 },
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderRadius: 1,
              boxShadow: showMegaMenu ? "0 4px 16px rgba(242,92,5,0.4)" : 2,
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { bgcolor: "#f25c05" },
            }}
          >
            DANH MỤC SẢN PHẨM
          </Button>

          <AnimatePresence>
            {showMegaMenu && brandsData.length > 0 && categoriesRawData.length > 0 && (
              <motion.div
                key="mega-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1400,
                }}
                onMouseEnter={show}
                onMouseLeave={hide}
              >
                <BrandMegaMenu brands={brandsData} categories={categoriesRawData} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* NAV LINKS */}
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
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Box
                key={label}
                onClick={() => router.push(href)}
                component={motion.div}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1,
                  height: "100%",
                  minHeight: "44px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Typography
                  className="text"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: isActive ? "#f25c05" : "#000",
                    borderBottom: isActive
                      ? "2px solid #f25c05"
                      : "2px solid transparent",
                    transition: "color 0.18s ease, border-color 0.18s ease",
                    "&:hover": { color: "#f25c05" },
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default NavMenu;
