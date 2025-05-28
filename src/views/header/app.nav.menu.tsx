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
import CategoryMegaMenu from "@/components/CategoryMegaMenu";

const categoriesData = [
  /* dữ liệu như cũ */
];

const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  if (isMobile) {
    return (
      <Box
        sx={
          {
            /* ... giữ nguyên phần mobile ... */
          }
        }
      >
        <BottomNavigation showLabels>{/* ... các nút ... */}</BottomNavigation>
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
