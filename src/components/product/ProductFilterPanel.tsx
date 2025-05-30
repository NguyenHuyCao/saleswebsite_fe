import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default function ProductFilterPanel() {
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
        Bộ lọc sản phẩm
      </Typography>
      <Paper variant="outlined" sx={{ mt: 1, p: 2 }}>
        <Typography fontWeight="bold" mb={1} fontSize={14}>
          Chọn mức giá
        </Typography>
        <FormGroup sx={{ mb: 2 }}>
          {[
            "Dưới 1 triệu",
            "Từ 1 triệu - 2 triệu",
            "Từ 2 triệu - 3 triệu",
            "Từ 3 triệu - 5 triệu",
            "Từ 5 triệu - 10 triệu",
            "Từ 10 triệu - 20 triệu",
            "Từ 20 triệu - 50 triệu",
          ].map((price, idx) => (
            <FormControlLabel
              key={idx}
              control={<Checkbox size="small" />}
              label={<Typography fontSize={14}>{price}</Typography>}
            />
          ))}
        </FormGroup>

        <Typography fontWeight="bold" mb={1} fontSize={14}>
          Thương hiệu
        </Typography>
        <FormGroup>
          {["Wontech", "Sasuke", "Hồng Ký", "Kenmax"].map((brand, idx) => (
            <FormControlLabel
              key={idx}
              control={<Checkbox size="small" />}
              label={<Typography fontSize={14}>{brand}</Typography>}
            />
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
}
