"use client";

import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setKeyword, setScrollTrigger } from "@/redux/slices/searchSlice";
import Menu from "mdi-material-ui/Menu";

// Icons — trang
import HomeOutlineIcon from "@mui/icons-material/HomeOutlined";
import ContactsIcon from "@mui/icons-material/ContactsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LabelIcon from "@mui/icons-material/LabelOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import BuildIcon from "@mui/icons-material/BuildOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircleOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBoxOutlined";

// Icons — content
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import MessageIcon from "@mui/icons-material/MessageOutlined";
import SellIcon from "@mui/icons-material/SellOutlined";
import AppsIcon from "@mui/icons-material/Apps";

import {
  useGlobalAdminSearch,
  type ResultKind,
  type SearchResult,
} from "@/lib/hooks/useGlobalAdminSearch";

/* ─────────────────────────── Types ─────────────────────────── */

type OptionGroup =
  | "Trang & chức năng"
  | "Sản phẩm"
  | "Đơn hàng"
  | "Người dùng"
  | "Liên hệ"
  | "Thương hiệu"
  | "Danh mục"
  | "Khuyến mãi"
  | "Tìm trong trang này";

interface FeatureOption {
  kind: "feature" | "search_current";
  id: string;
  label: string;
  description?: string;
  group: OptionGroup;
  path?: string;
  keywords?: string[];
  icon: React.ReactNode;
}

type CombinedOption = FeatureOption | (SearchResult & { group: OptionGroup });

/* ─────────────────────────── Feature catalog ─────────────────────────── */

const FEATURE_OPTIONS: FeatureOption[] = [
  { kind: "feature", id: "dashboard",        label: "Thống kê",              description: "Tổng quan doanh thu, đơn hàng",           group: "Trang & chức năng", path: "/admin",                keywords: ["dashboard","tổng quan","doanh thu"], icon: <HomeOutlineIcon fontSize="small" /> },
  { kind: "feature", id: "contacts",         label: "Liên hệ",               description: "Quản lý tin nhắn khách hàng",             group: "Trang & chức năng", path: "/admin/contacts",        keywords: ["contact","khách hàng","tin nhắn"], icon: <ContactsIcon fontSize="small" /> },
  { kind: "feature", id: "users",            label: "Người dùng",            description: "Quản lý tài khoản người dùng",            group: "Trang & chức năng", path: "/admin/users",           keywords: ["user","tài khoản","nhân viên"], icon: <PersonIcon fontSize="small" /> },
  { kind: "feature", id: "products",         label: "Sản phẩm",              description: "Danh sách toàn bộ sản phẩm",              group: "Trang & chức năng", path: "/admin/products",        keywords: ["product","hàng hoá","máy"], icon: <Inventory2Icon fontSize="small" /> },
  { kind: "feature", id: "products-create",  label: "Thêm sản phẩm mới",     description: "Tạo sản phẩm mới (bước 1)",               group: "Trang & chức năng", path: "/admin/products/create", keywords: ["create product","thêm","tạo mới"], icon: <AddCircleIcon fontSize="small" /> },
  { kind: "feature", id: "orders",           label: "Đơn hàng",              description: "Quản lý và xử lý đơn hàng",               group: "Trang & chức năng", path: "/admin/orders",          keywords: ["order","đặt hàng","giao hàng"], icon: <ReceiptIcon fontSize="small" /> },
  { kind: "feature", id: "categories",       label: "Danh mục",              description: "Quản lý phân loại sản phẩm",              group: "Trang & chức năng", path: "/admin/categories",      keywords: ["category","phân loại"], icon: <CategoryIcon fontSize="small" /> },
  { kind: "feature", id: "brands",           label: "Thương hiệu",           description: "Quản lý nhãn hàng, hãng sản xuất",        group: "Trang & chức năng", path: "/admin/brands",          keywords: ["brand","nhãn hiệu","hãng"], icon: <LabelIcon fontSize="small" /> },
  { kind: "feature", id: "shippings",        label: "Đơn vị vận chuyển",     description: "Quản lý đơn vị giao hàng",                group: "Trang & chức năng", path: "/admin/shippings",       keywords: ["shipping","giao hàng","vận chuyển"], icon: <LocalShippingIcon fontSize="small" /> },
  { kind: "feature", id: "events",           label: "Khuyến mãi",            description: "Quản lý giảm giá, flash sale, voucher",   group: "Trang & chức năng", path: "/admin/events",          keywords: ["promotion","discount","sale","voucher","mã giảm giá"], icon: <LocalOfferIcon fontSize="small" /> },
  { kind: "feature", id: "warranties",       label: "Bảo hành",              description: "Quản lý yêu cầu bảo hành",               group: "Trang & chức năng", path: "/admin/warranties",      keywords: ["warranty","bảo dưỡng","sửa chữa"], icon: <BuildIcon fontSize="small" /> },
  { kind: "feature", id: "profile",          label: "Hồ sơ cá nhân",         description: "Xem và chỉnh sửa thông tin tài khoản",   group: "Trang & chức năng", path: "/admin/profile",         keywords: ["profile","tài khoản","avatar"], icon: <AccountBoxIcon fontSize="small" /> },
];

const PAGE_LABELS: Record<string, string> = {
  "/admin":           "Thống kê",
  "/admin/contacts":  "Liên hệ",
  "/admin/users":     "Người dùng",
  "/admin/products":  "Sản phẩm",
  "/admin/orders":    "Đơn hàng",
  "/admin/categories":"Danh mục",
  "/admin/brands":    "Thương hiệu",
  "/admin/shippings": "Đơn vị vận chuyển",
  "/admin/events":    "Khuyến mãi",
  "/admin/warranties":"Bảo hành",
};

const KIND_GROUP: Record<ResultKind, OptionGroup> = {
  product:   "Sản phẩm",
  order:     "Đơn hàng",
  user:      "Người dùng",
  contact:   "Liên hệ",
  brand:     "Thương hiệu",
  category:  "Danh mục",
  promotion: "Khuyến mãi",
};

/** Trang hiện tại → kind ưu tiên hiển thị lên đầu */
const PAGE_TO_KIND: Record<string, ResultKind> = {
  "/admin/products":   "product",
  "/admin/orders":     "order",
  "/admin/users":      "user",
  "/admin/contacts":   "contact",
  "/admin/brands":     "brand",
  "/admin/categories": "category",
  "/admin/events":     "promotion",
};

const ALL_CONTENT_GROUPS: OptionGroup[] = [
  "Sản phẩm", "Đơn hàng", "Người dùng",
  "Liên hệ", "Thương hiệu", "Danh mục", "Khuyến mãi",
];

const KIND_ICON: Record<ResultKind, React.ReactNode> = {
  product:   <ShoppingBagIcon fontSize="small" />,
  order:     <AssignmentIcon  fontSize="small" />,
  user:      <GroupIcon       fontSize="small" />,
  contact:   <MessageIcon     fontSize="small" />,
  brand:     <LabelIcon       fontSize="small" />,
  category:  <AppsIcon        fontSize="small" />,
  promotion: <SellIcon        fontSize="small" />,
};

/* ─────────────────────────── Helper ─────────────────────────── */

function norm(s: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function matchFeature(opt: FeatureOption, q: string) {
  const n = norm(q);
  return (
    norm(opt.label).includes(n) ||
    norm(opt.description ?? "").includes(n) ||
    (opt.keywords ?? []).some((k) => norm(k).includes(n))
  );
}

/* ─────────────────────────── Component ─────────────────────────── */

interface Props {
  hidden: boolean;
  toggleNavVisibility: () => void;
}

const AdminSearchInput = ({ hidden, toggleNavVisibility }: Props) => {
  const dispatch  = useDispatch();
  const router    = useRouter();
  const pathname  = usePathname();
  const hiddenSm  = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results: contentResults, loading: contentLoading } =
    useGlobalAdminSearch(inputValue);

  // Reset khi đổi route
  useEffect(() => {
    setInputValue("");
    dispatch(setKeyword(""));
    setOpen(false);
  }, [pathname, dispatch]);


  // Ctrl+K focus nhanh
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Priority kind cho trang hiện tại ── */
  const priorityKind  = PAGE_TO_KIND[pathname];
  const priorityGroup = priorityKind ? KIND_GROUP[priorityKind] : undefined;

  /* ── GROUP ORDER — nhóm trang hiện tại luôn đứng đầu content ── */
  const GROUP_ORDER: OptionGroup[] = [
    "Trang & chức năng",
    ...(priorityGroup
      ? [priorityGroup, ...ALL_CONTENT_GROUPS.filter((g) => g !== priorityGroup)]
      : ALL_CONTENT_GROUPS),
    "Tìm trong trang này",
  ];

  /* ── Build options ── */
  const options: CombinedOption[] = (() => {
    const q = inputValue.trim();

    // Feature options (filter khi có query, hiển thị tất cả khi trống)
    const features: FeatureOption[] = q
      ? FEATURE_OPTIONS.filter((o) => matchFeature(o, q))
      : FEATURE_OPTIONS;

    const out: CombinedOption[] = [...features];

    // Content results (chỉ khi query >= 2 ký tự)
    // Ưu tiên kind của trang hiện tại lên đầu
    if (q.length >= 2) {
      const priority = priorityKind
        ? contentResults.filter((r) => r.kind === priorityKind)
        : [];
      const rest = priorityKind
        ? contentResults.filter((r) => r.kind !== priorityKind)
        : contentResults;
      [...priority, ...rest].forEach((r) => {
        out.push({ ...r, group: KIND_GROUP[r.kind] } as CombinedOption);
      });
    }

    // "Tìm trong trang này" — luôn cuối cùng nếu có query và trang hỗ trợ
    const pageLabel = PAGE_LABELS[pathname];
    if (q && pageLabel) {
      out.push({
        kind: "search_current",
        id: "__search_current__",
        label: `Tìm "${q}" trong ${pageLabel}`,
        description: "Nhấn Enter để lọc danh sách",
        group: "Tìm trong trang này",
        icon: <SearchIcon fontSize="small" />,
      });
    }

    return out;
  })();

  /* ── Handlers ── */
  const handleSelect = useCallback(
    (_: any, option: CombinedOption | null) => {
      if (!option) return;

      if (option.kind === "search_current") {
        dispatch(setKeyword(inputValue.trim()));
        dispatch(setScrollTrigger(true));
        setOpen(false);
        return;
      }

      if (option.kind === "feature") {
        if (option.path) router.push(option.path);
        setOpen(false);
        setInputValue("");
        return;
      }

      // content result
      const r = option as SearchResult & { group: OptionGroup };
      if (r.searchKeyword) {
        dispatch(setKeyword(r.searchKeyword));
        dispatch(setScrollTrigger(true));
      }
      router.push(r.navigatePath);
      setOpen(false);
      setInputValue("");
    },
    [dispatch, inputValue, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !open) {
      const q = inputValue.trim();
      if (q) {
        dispatch(setKeyword(q));
        dispatch(setScrollTrigger(true));
      }
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <Box className="actions-left" sx={{ mr: 2, display: "flex", alignItems: "center" }}>
      {hidden && (
        <IconButton
          color="inherit"
          onClick={toggleNavVisibility}
          sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
        >
          <Menu />
        </IconButton>
      )}

      <Autocomplete<CombinedOption, false, false, false>
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        groupBy={(o) => o.group}
        getOptionLabel={(o) => ("label" in o ? o.label : (o as any).primary ?? "")}
        inputValue={inputValue}
        onInputChange={(_, val, reason) => {
          setInputValue(val);
          // Chỉ reset keyword khi người dùng tự xoá, không phải sau khi chọn option
          if ((reason === "input" || reason === "clear") && !val.trim()) {
            dispatch(setKeyword(""));
          }
        }}
        onChange={handleSelect}
        filterOptions={(opts) => opts}
        noOptionsText={
          contentLoading
            ? "Đang tìm kiếm..."
            : inputValue.trim().length >= 2
            ? "Không tìm thấy kết quả"
            : "Bắt đầu gõ để tìm kiếm"
        }
        clearOnBlur={false}
        blurOnSelect
        loading={contentLoading}
        sx={{ width: { xs: 200, sm: 280, md: 360 } }}
        // Sắp xếp group
        isOptionEqualToValue={(a, b) => a.id === b.id}
        PaperComponent={({ children, ...props }) => (
          <Paper
            {...props}
            elevation={10}
            sx={{
              borderRadius: 3,
              mt: 0.5,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {children}
            {/* Footer hint */}
            <Box
              sx={{
                px: 2,
                py: 0.75,
                bgcolor: "action.hover",
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                gap: 2,
              }}
            >
              {[
                ["↵", "Chọn"],
                ["↑↓", "Di chuyển"],
                ["Esc", "Đóng"],
                ["Ctrl+K", "Mở nhanh"],
              ].map(([key, label]) => (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Chip
                    label={key}
                    size="small"
                    sx={{ height: 18, fontSize: "0.6rem", px: 0.25 }}
                  />
                  <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
        renderGroup={(params) => {
          const grpIndex = GROUP_ORDER.indexOf(params.group as OptionGroup);
          const prevGroup = grpIndex > 0 ? GROUP_ORDER[grpIndex - 1] : null;
          const isContentGroup =
            params.group !== "Trang & chức năng" &&
            params.group !== "Tìm trong trang này";
          const isFirstContent =
            params.group === "Sản phẩm" ||
            (isContentGroup &&
              !["Sản phẩm", "Trang & chức năng", "Tìm trong trang này"].includes(
                prevGroup ?? ""
              ));

          return (
            <Box key={params.key}>
              {/* Divider giữa feature và content */}
              {isFirstContent && (
                <Divider sx={{ my: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                    KẾT QUẢ NỘI DUNG
                  </Typography>
                </Divider>
              )}
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.6,
                  display: "block",
                  fontWeight: 700,
                  color:
                    params.group === "Tìm trong trang này"
                      ? "primary.main"
                      : "text.secondary",
                  bgcolor: "action.hover",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.65rem",
                }}
              >
                {params.group}
              </Typography>
              <Box>{params.children}</Box>
            </Box>
          );
        }}
        renderOption={(props, option) => {
          const { key: _key, ...rest } = props as any;

          // Lấy icon và text phù hợp theo loại option
          let icon: React.ReactNode;
          let primary: string;
          let secondary: string | undefined;
          let badge: string | undefined;
          let badgeColor: SearchResult["badgeColor"];
          let isNavigation = false;
          let isSearchAction = false;

          if (option.kind === "feature") {
            icon = option.icon;
            primary = option.label;
            secondary = option.description;
            isNavigation = true;
          } else if (option.kind === "search_current") {
            icon = option.icon;
            primary = option.label;
            secondary = option.description;
            isSearchAction = true;
          } else {
            const r = option as SearchResult;
            icon = KIND_ICON[r.kind];
            primary = r.primary;
            secondary = r.secondary;
            badge = r.badge;
            badgeColor = r.badgeColor;
          }

          return (
            <MenuItem
              key={option.id}
              {...rest}
              sx={{
                py: 1,
                px: 2,
                minHeight: 44,
                gap: 1.5,
                "&:hover, &.Mui-focused": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: "text.secondary" }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  noWrap: true,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.72rem",
                  noWrap: true,
                }}
                sx={{ flex: 1, minWidth: 0 }}
              />
              {/* Badge trạng thái */}
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  color={badgeColor ?? "default"}
                  sx={{ height: 20, fontSize: "0.65rem", flexShrink: 0 }}
                />
              )}
              {/* Indicator */}
              {isNavigation && (
                <NavigateNextIcon
                  fontSize="small"
                  sx={{ color: "text.disabled", flexShrink: 0 }}
                />
              )}
              {isSearchAction && (
                <Chip
                  label="Enter"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.65rem", flexShrink: 0 }}
                />
              )}
            </MenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            size="small"
            placeholder="Tìm kiếm... (Ctrl+K)"
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                transition: "box-shadow 0.2s",
                "&.Mui-focused": {
                  boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}33`,
                },
              },
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    {contentLoading ? (
                      <CircularProgress size={16} sx={{ color: "text.secondary" }} />
                    ) : (
                      <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default AdminSearchInput;
