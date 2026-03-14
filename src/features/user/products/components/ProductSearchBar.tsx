// components/product/ProductSearchBar.tsx
"use client";

import { Box, InputBase, Chip, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ProductSearchBar({
  onSearch,
  onSort,
}: {
  onSearch: (value: string) => void;
  onSort: (type: string) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [activeSort, setActiveSort] = useState("");

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const sortOptions = [
    { value: "newest", label: "🆕 Hàng mới" },
    { value: "asc", label: "💰 Giá thấp → cao" },
    { value: "desc", label: "💰 Giá cao → thấp" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 3,
      }}
    >
      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          bgcolor: "#fff",
          borderRadius: 3,
          px: 2,
          border: "1px solid #e0e0e0",
          transition: "all 0.3s",
          "&:focus-within": {
            borderColor: "#ffb700",
            boxShadow: "0 0 0 3px rgba(255,183,0,0.1)",
          },
        }}
      >
        <SearchIcon sx={{ color: "#999", mr: 1 }} />
        <InputBase
          placeholder="Tìm kiếm sản phẩm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ flex: 1, py: 1 }}
        />
      </Box>

      {/* Sort Chips */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {sortOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => {
              setActiveSort(option.value);
              onSort(option.value);
            }}
            color={activeSort === option.value ? "warning" : "default"}
            sx={{
              bgcolor: activeSort === option.value ? "#ffb700" : "#fff",
              color: activeSort === option.value ? "#000" : "#666",
              fontWeight: 500,
              border: "1px solid",
              borderColor: activeSort === option.value ? "#ffb700" : "#e0e0e0",
              "&:hover": {
                bgcolor: activeSort === option.value ? "#ffb700" : "#f5f5f5",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
