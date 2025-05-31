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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // ✅ Thêm icon
import { useState } from "react";
import CategoryMegaMenu from "@/components/category/CategoryMegaMenu";

const categoriesData = [
  {
    label: "Sản phẩm",
    icon: "/images/product/1534231926-5.jpg",
    subCategories: [
      {
        title: "Máy khoan",
        items: [
          "Máy khoan pin",
          "Máy khoan bê tông",
          "Máy khoan bàn",
          "Máy khoan mini",
        ],
      },
      {
        title: "Máy rửa xe",
        items: [
          "Máy rửa xe mini",
          "Máy rửa xe chuyên nghiệp",
          "Phụ kiện máy rửa xe",
        ],
      },
      {
        title: "Thiết bị cầm tay",
        items: ["Máy mài", "Máy cắt", "Máy đánh bóng", "Máy bắt vít"],
      },
      {
        title: "Thiết bị cơ khí",
        items: ["Máy hàn", "Máy tiện", "Máy nén khí", "Máy cắt plasma"],
      },
    ],
  },
  {
    label: "Dụng cụ cầm tay",
    icon: "/images/product/1534231926-5.jpg",
    subCategories: [
      {
        title: "Tua vít & kìm",
        items: ["Tua vít điện", "Kìm cắt", "Kìm bấm"],
      },
      {
        title: "Cờ lê & Mỏ lết",
        items: ["Cờ lê đa năng", "Mỏ lết tự động"],
      },
      {
        title: "Bộ dụng cụ sửa chữa",
        items: ["Bộ vặn ốc", "Bộ mở nắp"],
      },
    ],
    banner: {
      image: "/images/product/images.jpeg",
      description: "Ưu đãi 25% cho các bộ dụng cụ cầm tay chuyên nghiệp!",
      ctaText: "Mua ngay",
      ctaLink: "/dung-cu-cam-tay",
    },
  },
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
          zIndex: 1200,
          borderTop: "1px solid #ddd",
          bgcolor: "#fff",
        }}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction label="Trang chủ" icon={<HomeIcon />} />
          <BottomNavigationAction label="Sản phẩm" icon={<AppsIcon />} />
          <BottomNavigationAction label="Yêu thích" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Đơn hàng" icon={<CompareIcon />} />
          <BottomNavigationAction
            label="Giỏ hàng"
            icon={<ShoppingCartIcon />}
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
          gap: 3,
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

        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap", // ❗ Không cho xuống dòng
            overflowX: "auto", // ❗ Cho phép cuộn ngang khi không đủ
            whiteSpace: "nowrap",
            // gap: 0.2,
            justifyContent: "flex-start",
            flexGrow: 1,
            px: { xs: 1, sm: 2, md: 0 },
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome
            maxWidth: "100%", // Giới hạn trong container
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
            <Box
              key={item}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 1,
                height: "100%",
                minHeight: "44px",
                cursor: "pointer",
                flexShrink: 0, // Đảm bảo không bị co lại khi không đủ chỗ
                transition: "color 0.2s, background-color 0.2s",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "#000",
                  "&:hover": {
                    color: "#f25c05",
                    // backgroundColor: "rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                {item}
                {item === "Sản phẩm" && (
                  <ArrowDropDownIcon fontSize="small" sx={{ ml: 0.3 }} />
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default NavMenu;
