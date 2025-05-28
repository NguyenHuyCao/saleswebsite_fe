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
import { useState } from "react";
import CategoryMegaMenu from "@/components/CategoryMegaMenu";

const categoriesData = [
  {
    label: "Máy khoan",
    icon: "/images/icons/drill.png",
    subCategories: [
      {
        title: "Phụ kiện máy khoan",
        items: ["Pin máy khoan", "Sạc pin máy khoan", "Mũi khoan"],
      },
      { title: "Máy khoan mini", items: [] },
      { title: "Máy khoan pin", items: [] },
      { title: "Máy khoan động lực", items: [] },
      { title: "Máy khoan bê tông, khoan búa", items: ["Máy đục bê tông"] },
      { title: "Máy khoan rút lõi bê tông", items: [] },
      { title: "Máy khoan góc", items: [] },
      { title: "Tìm sản phẩm Máy khoan cầm tay gia đình", items: [] },
    ],
  },
  {
    label: "Máy khoan",
    icon: "/images/icons/drill.png",
    subCategories: [
      {
        title: "Phụ kiện máy khoan",
        items: ["Pin máy khoan", "Sạc pin máy khoan", "Mũi khoan"],
      },
      { title: "Máy khoan mini", items: [] },
      { title: "Máy khoan pin", items: [] },
      { title: "Máy khoan động lực", items: [] },
      { title: "Máy khoan bê tông, khoan búa", items: ["Máy đục bê tông"] },
      { title: "Máy khoan rút lõi bê tông", items: [] },
      { title: "Máy khoan góc", items: [] },
      { title: "Tìm sản phẩm Máy khoan cầm tay gia đình", items: [] },
    ],
  },
  // Add more categories if needed
];

const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  if (isMobile) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: "1px solid #ddd",
          bgcolor: "#fff",
        }}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Danh mục"
            icon={<AppsIcon sx={{ color: "#fbbf24" }} />}
          />
          <BottomNavigationAction
            label="Trang chủ"
            icon={<HomeIcon sx={{ color: "#fbbf24" }} />}
          />
          <BottomNavigationAction
            label="Giỏ hàng"
            icon={<ShoppingCartIcon sx={{ color: "#fbbf24" }} />}
          />
          <BottomNavigationAction
            label="Yêu thích"
            icon={<FavoriteIcon sx={{ color: "#fbbf24" }} />}
          />
          <BottomNavigationAction
            label="So sánh"
            icon={<CompareIcon sx={{ color: "#fbbf24" }} />}
          />
        </BottomNavigation>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 16,
          bgcolor: "#ffb700",
          py: 1,
          px: 2,
        }}
      >
        {/* DANH MỤC SẢN PHẨM BUTTON */}
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

          {/* Mega Menu tích hợp */}
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
              <CategoryMegaMenu data={categoriesData} />
            </Box>
          </Fade>
        </Box>

        {/* MENU NGANG BÊN PHẢI */}
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "nowrap", sm: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", sm: "auto", md: "visible" },
            whiteSpace: "nowrap",
            gap: 2,
            justifyContent: "flex-start",
            flexGrow: 1,
            px: { xs: 1, sm: 2, md: 0 },
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome
          }}
        >
          {[
            "Trang chủ",
            "Giới thiệu",
            "Thương hiệu",
            "Sản phẩm",
            "Khuyến mãi",
            "Tin tức",
            "Liên hệ",
            "Hệ thống cửa hàng",
            "Câu hỏi thường gặp",
            "Chế độ bảo hành",
          ].map((item) => (
            <Typography
              key={item}
              sx={{ fontSize: "14px", fontWeight: "bold" }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default NavMenu;
