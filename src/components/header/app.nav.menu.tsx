"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

import AppsIcon from "@mui/icons-material/Apps";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareIcon from "@mui/icons-material/Compare";

const NavMenu = ({ isMobile }: { isMobile: boolean }) => {
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
          display: "flex",
          alignItems: "center",
          gap: 16,
          bgcolor: "#ffb700",
          py: 1,
          px: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "black",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          DANH MỤC SẢN PHẨM
        </Button>

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
