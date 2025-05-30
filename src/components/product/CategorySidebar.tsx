import { Box, Typography, Paper } from "@mui/material";

const categories = [
  "Máy khoan",
  "Máy nông nghiệp",
  "Máy hàn điện tử",
  "Máy rửa xe",
  "Máy bơm nước",
  "Thang nhôm",
  "Thiết bị nâng hạ",
  "Xe đẩy hàng",
  "Máy cưa, Máy cắt gỗ",
];

export default function CategorySidebar() {
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          bgcolor: "#ffb700",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        Danh mục sản phẩm
      </Typography>
      <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
        {categories.map((cat, idx) => (
          <Box
            key={idx}
            py={1.2}
            px={2}
            sx={{
              cursor: "pointer",
              borderRadius: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#ffb700",
                bgcolor: "#fff7e6",
              },
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <Typography>{cat}</Typography>
            <Typography>+</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
