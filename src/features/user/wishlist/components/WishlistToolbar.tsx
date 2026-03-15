// wishlist/components/WishlistToolbar.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Badge,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Tooltip,
  Checkbox,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import { useWishlist } from "../queries";
import { useWishlistBulk } from "../hooks/useWishlistBulk";

export default function WishlistToolbar() {
  const { data: items = [] } = useWishlist();
  const {
    selectedItems,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
    addSelectedToCart,
    removeSelected,
  } = useWishlistBulk();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    price: "all",
    inStock: false,
    onSale: false,
  });

  const selectedCount = selectedItems.size;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            bgcolor: "#f25c05",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Badge badgeContent={selectedCount} color="warning">
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleSelectAll}
                  sx={{ p: 0 }}
                />
              </Box>
            </Badge>
            <Typography variant="body2" fontWeight={600}>
              Đã chọn {selectedCount} sản phẩm
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              startIcon={<ShoppingCartIcon />}
              onClick={addSelectedToCart}
              sx={{
                bgcolor: "#fff",
                color: "#f25c05",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={removeSelected}
              sx={{
                borderColor: "#fff",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Xóa
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Search & Filter Bar */}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Tìm kiếm trong danh sách..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Bộ lọc">
          <IconButton
            onClick={() => setFilterOpen(!filterOpen)}
            sx={{
              bgcolor: filterOpen ? "#f25c05" : "transparent",
              color: filterOpen ? "#fff" : "#666",
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
            startAdornment={<SortIcon sx={{ mr: 1, color: "#999" }} />}
          >
            <MenuItem value="newest">Mới thêm nhất</MenuItem>
            <MenuItem value="oldest">Cũ nhất</MenuItem>
            <MenuItem value="price_asc">Giá thấp → cao</MenuItem>
            <MenuItem value="price_desc">Giá cao → thấp</MenuItem>
            <MenuItem value="name_asc">Tên A-Z</MenuItem>
            <MenuItem value="name_desc">Tên Z-A</MenuItem>
            <MenuItem value="discount">Giảm giá nhiều</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Filter Chips */}
      {filterOpen && (
        <Paper
          sx={{
            p: 2,
            mt: 1,
            borderRadius: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label="Tất cả"
            onClick={() => setFilters({ ...filters, price: "all" })}
            color={filters.price === "all" ? "warning" : "default"}
            variant={filters.price === "all" ? "filled" : "outlined"}
          />
          <Chip
            label="Dưới 1 triệu"
            onClick={() => setFilters({ ...filters, price: "under1m" })}
            color={filters.price === "under1m" ? "warning" : "default"}
            variant={filters.price === "under1m" ? "filled" : "outlined"}
          />
          <Chip
            label="1 - 5 triệu"
            onClick={() => setFilters({ ...filters, price: "1m-5m" })}
            color={filters.price === "1m-5m" ? "warning" : "default"}
            variant={filters.price === "1m-5m" ? "filled" : "outlined"}
          />
          <Chip
            label="5 - 10 triệu"
            onClick={() => setFilters({ ...filters, price: "5m-10m" })}
            color={filters.price === "5m-10m" ? "warning" : "default"}
            variant={filters.price === "5m-10m" ? "filled" : "outlined"}
          />
          <Chip
            label="Trên 10 triệu"
            onClick={() => setFilters({ ...filters, price: "over10m" })}
            color={filters.price === "over10m" ? "warning" : "default"}
            variant={filters.price === "over10m" ? "filled" : "outlined"}
          />
          <Chip
            label="Đang giảm giá"
            onClick={() => setFilters({ ...filters, onSale: !filters.onSale })}
            color={filters.onSale ? "warning" : "default"}
            variant={filters.onSale ? "filled" : "outlined"}
          />
          <Chip
            label="Còn hàng"
            onClick={() =>
              setFilters({ ...filters, inStock: !filters.inStock })
            }
            color={filters.inStock ? "warning" : "default"}
            variant={filters.inStock ? "filled" : "outlined"}
          />
        </Paper>
      )}
    </Box>
  );
}
