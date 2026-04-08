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
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import {
  FavoriteBorder,
  Search,
  ShoppingBag,
  QuestionAnswer,
  Article,
} from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { fetcherWithToken } from "@/lib/utils/fetcherWithToken";
import {
  WISHLIST_COUNT_KEY,
  CART_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";
import { http } from "@/lib/api/http";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { faqData } from "@/features/user/questions/constants/faqData";

mutate(CART_COUNT_KEY);
mutate(WISHLIST_COUNT_KEY);

const searchPhrases = [
  "Bạn muốn tìm gì?",
  "Máy khoan, máy cắt, máy hàn...",
  "Khuyến mãi hôm nay là gì?",
  "Tìm sản phẩm hot nhất!",
];

const PAGE_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/product" },
  { label: "Thương hiệu", href: "/brand" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Câu hỏi thường gặp", href: "/question" },
  { label: "Liên hệ", href: "/contact" },
  { label: "Tin tức", href: "/new" },
  { label: "Khuyến mãi", href: "/promotion" },
];

const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const refreshAllCounts = () => {
  mutate(WISHLIST_COUNT_KEY);
  mutate(CART_COUNT_KEY);
  mutate(ORDERS_COUNT_KEY);
};

interface ProductSuggestion {
  name: string;
  slug: string;
  imageAvt?: string;
  price?: number;
}

const MainToolbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchText, 350);
  const abortRef = useRef<AbortController | null>(null);

  const { data: wishlistCount = 0 } = useSWR(WISHLIST_COUNT_KEY, fetcherWithToken);
  const { data: cartCount = 0 } = useSWR(CART_COUNT_KEY, fetcherWithToken);
  const { data: ordersCount = 0 } = useSWR(ORDERS_COUNT_KEY, fetcherWithToken);

  // Typewriter placeholder animation
  useEffect(() => {
    if (searchText) return;
    const currentPhrase = searchPhrases[phraseIndex];
    if (charIndex < currentPhrase.length) {
      const t = setTimeout(() => {
        setCurrentText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [charIndex, phraseIndex, searchText]);

  // Fetch product suggestions from API
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setProductSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingSuggestions(true);
    http
      .get(`/api/v1/products?search=${encodeURIComponent(debouncedSearch)}`, {
        signal: controller.signal,
      })
      .then((res) => {
        const data = (res as any)?.data?.data ?? (res as any)?.data;
        let raw: any[] = [];
        if (Array.isArray(data)) raw = data;
        else if (Array.isArray(data?.result)) raw = data.result;
        else if (Array.isArray(data?.items)) raw = data.items;
        else if (Array.isArray(data?.rows)) raw = data.rows;

        setProductSuggestions(
          raw.slice(0, 5).map((p: any) => ({
            name: p.name,
            slug: p.slug,
            imageAvt: p.imageAvt,
            price: p.pricePerUnit ?? p.price,
          }))
        );
      })
      .catch(() => {
        // silently ignore cancelled/failed requests
      })
      .finally(() => setLoadingSuggestions(false));

    return () => controller.abort();
  }, [debouncedSearch]);

  // FAQ suggestions from local data
  const faqSuggestions =
    debouncedSearch.trim().length > 0
      ? faqData
          .flatMap((c) => c.questions)
          .filter((q) =>
            q.q.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .slice(0, 3)
          .map((q) => q.q)
      : [];

  // Page link suggestions
  const pageSuggestions =
    debouncedSearch.trim().length > 0
      ? PAGE_LINKS.filter((p) =>
          p.label.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : [];

  const handleSearch = () => {
    const trimmed = searchText.trim();
    setShowDropdown(false);
    if (trimmed) {
      router.push(`/product?search=${encodeURIComponent(toSlug(trimmed))}`);
    } else {
      router.push("/product");
    }
  };

  const handleProductClick = (slug: string) => {
    setShowDropdown(false);
    router.push(`/product/detail?name=${slug}`);
  };

  const handleFaqClick = (question: string) => {
    setShowDropdown(false);
    router.push(`/question?search=${encodeURIComponent(question)}`);
  };

  const hasResults =
    loadingSuggestions ||
    productSuggestions.length > 0 ||
    faqSuggestions.length > 0 ||
    pageSuggestions.length > 0;

  const navItems = [
    { label: "Yêu thích", href: "/wishlist", icon: FavoriteBorder, count: wishlistCount },
    { label: "Đơn hàng", href: "/order", icon: BookmarkBorderOutlinedIcon, count: ordersCount },
    { label: "Giỏ hàng", href: "/cart", icon: ShoppingCartOutlinedIcon, count: cartCount },
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
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => router.push("/")}
          />

          {/* Search with Suggestion Dropdown */}
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                maxWidth: { xs: "100%", sm: 400 },
                mx: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#e5e7eb",
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  placeholder={searchText ? "" : currentText}
                  fullWidth
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchText) setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") setShowDropdown(false);
                  }}
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                />
                <IconButton onClick={handleSearch}>
                  {loadingSuggestions ? (
                    <CircularProgress size={18} sx={{ color: "#ffb700" }} />
                  ) : (
                    <Search sx={{ color: "#ffb700" }} />
                  )}
                </IconButton>
              </Box>

              {/* Suggestion Dropdown */}
              {showDropdown && searchText.trim() && (
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    zIndex: 1400,
                    borderRadius: 2,
                    overflow: "hidden",
                    maxHeight: 400,
                    overflowY: "auto",
                  }}
                >
                  {/* Product Suggestions */}
                  {productSuggestions.length > 0 && (
                    <>
                      <Box sx={{ px: 2, py: 0.75, bgcolor: "#f9f9f9" }}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
                        >
                          Sản phẩm
                        </Typography>
                      </Box>
                      <List dense disablePadding>
                        {productSuggestions.map((p) => (
                          <ListItemButton
                            key={p.slug}
                            onClick={() => handleProductClick(p.slug)}
                            sx={{ px: 2, "&:hover": { bgcolor: "#fff8f0" } }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {p.imageAvt ? (
                                <Box
                                  component="img"
                                  src={p.imageAvt}
                                  alt={p.name}
                                  sx={{ width: 28, height: 28, objectFit: "contain", borderRadius: 1 }}
                                />
                              ) : (
                                <ShoppingBag sx={{ fontSize: 20, color: "#f25c05" }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={p.name}
                              secondary={
                                p.price
                                  ? `${p.price.toLocaleString("vi-VN")} ₫`
                                  : undefined
                              }
                              slotProps={{
                                primary: { fontSize: "0.88rem", fontWeight: 500 },
                                secondary: { fontSize: "0.78rem", color: "#f25c05" },
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}

                  {/* FAQ Suggestions */}
                  {faqSuggestions.length > 0 && (
                    <>
                      {productSuggestions.length > 0 && <Divider />}
                      <Box sx={{ px: 2, py: 0.75, bgcolor: "#f9f9f9" }}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
                        >
                          Câu hỏi thường gặp
                        </Typography>
                      </Box>
                      <List dense disablePadding>
                        {faqSuggestions.map((q, i) => (
                          <ListItemButton
                            key={i}
                            onClick={() => handleFaqClick(q)}
                            sx={{ px: 2, "&:hover": { bgcolor: "#fff8f0" } }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <QuestionAnswer sx={{ fontSize: 18, color: "#ffb700" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={q}
                              slotProps={{ primary: { fontSize: "0.88rem" } }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}

                  {/* Page Links */}
                  {pageSuggestions.length > 0 && (
                    <>
                      {(productSuggestions.length > 0 || faqSuggestions.length > 0) && <Divider />}
                      <Box sx={{ px: 2, py: 0.75, bgcolor: "#f9f9f9" }}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
                        >
                          Trang
                        </Typography>
                      </Box>
                      <List dense disablePadding>
                        {pageSuggestions.map((p) => (
                          <ListItemButton
                            key={p.href}
                            onClick={() => {
                              setShowDropdown(false);
                              router.push(p.href);
                            }}
                            sx={{ px: 2, "&:hover": { bgcolor: "#fff8f0" } }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Article sx={{ fontSize: 18, color: "#999" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={p.label}
                              slotProps={{ primary: { fontSize: "0.88rem" } }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </>
                  )}

                  {/* No results */}
                  {!loadingSuggestions && !hasResults && (
                    <Box sx={{ px: 2, py: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontSize="0.88rem">
                        Không tìm thấy kết quả cho &quot;{searchText}&quot;
                      </Typography>
                    </Box>
                  )}

                  {/* Search all products link */}
                  {!loadingSuggestions && (
                    <>
                      <Divider />
                      <ListItemButton
                        onClick={handleSearch}
                        sx={{ px: 2, py: 1, "&:hover": { bgcolor: "#fff3e0" } }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Search sx={{ fontSize: 18, color: "#f25c05" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontSize="0.88rem">
                              Xem tất cả kết quả cho{" "}
                              <Box component="span" fontWeight={700} color="#f25c05">
                                &quot;{searchText}&quot;
                              </Box>
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </>
                  )}
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

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
