"use client";

import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { FavoriteBorder, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { fetcherWithToken } from "@/utils/fetcherWithToken";
import {
  WISHLIST_COUNT_KEY,
  CART_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";

mutate(CART_COUNT_KEY);
mutate(WISHLIST_COUNT_KEY);

const searchPhrases = [
  "Bạn muốn tìm gì?",
  "Máy khoan, máy cắt, máy hàn...",
  "Khuyến mãi hôm nay là gì?",
  "Tìm sản phẩm hot nhất!",
];

const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0300-\u036f/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const refreshAllCounts = () => {
  mutate(WISHLIST_COUNT_KEY);
  mutate(CART_COUNT_KEY);
  mutate(ORDERS_COUNT_KEY);
};

const MainToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [searchText, setSearchText] = useState("");

  const { data: wishlistCount = 0 } = useSWR(
    WISHLIST_COUNT_KEY,
    fetcherWithToken
  );
  const { data: cartCount = 0 } = useSWR(CART_COUNT_KEY, fetcherWithToken);
  const { data: ordersCount = 0 } = useSWR(ORDERS_COUNT_KEY, fetcherWithToken);

  useEffect(() => {
    const currentPhrase = searchPhrases[phraseIndex];
    if (charIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
      }, 1500);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex, phraseIndex]);

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (trimmed) {
      const slug = toSlug(trimmed);
      router.push(`/product?search=${encodeURIComponent(slug)}`);
    } else {
      router.push("/product");
    }
  };

  const navItems = [
    {
      label: "Yêu thích",
      href: "/wishlist",
      icon: FavoriteBorder,
      count: wishlistCount,
    },
    {
      label: "Đơn hàng",
      href: "/order",
      icon: BookmarkBorderOutlinedIcon,
      count: ordersCount,
    },
    {
      label: "Giỏ hàng",
      href: "/cart",
      icon: ShoppingCartOutlinedIcon,
      count: cartCount,
    },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: "black", boxShadow: "none" }}>
      <Container>
        <Toolbar
          sx={{
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            py: 2,
          }}
        >
          <Box
            component="img"
            src="/images/store/logo-removebg-preview.png"
            alt="Logo"
            sx={{
              height: { xs: 60, sm: 80, md: 100 },
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => router.push("/")}
          />

          <Box
            sx={{
              bgcolor: "#e5e7eb",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              maxWidth: { xs: "100%", sm: 400 },
              mx: 2,
            }}
          >
            <InputBase
              placeholder={currentText}
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            />
            <IconButton onClick={handleSearch}>
              <Search sx={{ color: "#ffb700" }} />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            {navItems.map(({ label, href, icon: Icon, count }) => {
              const isActive = pathname === href;
              return (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    color: isActive ? "#f25c05" : "#ffb700",
                    svg: { color: isActive ? "#f25c05" : "#ffb700" },
                    "&:hover": {
                      color: "#f25c05",
                      svg: { color: "#f25c05" },
                      "& .hover-label": { color: "#f25c05" },
                      "& .hover-count": { color: "#f25c05" },
                    },
                  }}
                  onClick={() => router.push(href)}
                >
                  <IconButton
                    sx={{
                      color: isActive ? "#f25c05" : "#ffb700",
                      border: "1px solid #ffb700",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                    }}
                  >
                    <Icon />
                  </IconButton>
                  <Box>
                    <Typography
                      className="hover-label"
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: "bold",
                        color: isActive ? "#f25c05" : "#ffb700",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography fontSize="12px">
                      <Box
                        component="span"
                        className="hover-count"
                        sx={{
                          fontWeight: "bold",
                          color: isActive ? "#f25c05" : "#ffb700",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {count ?? 0}
                      </Box>{" "}
                      {label === "Đơn hàng" ? "Đơn hàng" : "Sản phẩm"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainToolbar;
