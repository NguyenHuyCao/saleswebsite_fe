import { Box, Typography, Stack } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const PromotionBox = () => (
  <Box
    sx={{
      bgcolor: "#fff8e1",
      p: 2,
      border: "1px solid #ffecb3",
      borderRadius: 2,
      boxShadow: 1,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
      <CardGiftcardIcon color="warning" />
      <Typography variant="body1" fontWeight={700} color="warning.main">
        Khuyến mãi đặc biệt !!!
      </Typography>
    </Stack>
    <Stack spacing={1}>
      <Typography variant="body2">
        <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
        Áp dụng Phiếu quà tặng/ Mã giảm giá theo ngành hàng.
      </Typography>
      <Typography variant="body2">
        <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
        Giảm giá 10% khi mua từ 5 sản phẩm trở lên.
      </Typography>
      <Typography variant="body2">
        <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
        Tặng 100.000₫ khi mua online tại HCM và một số khu vực khác.
      </Typography>
    </Stack>
  </Box>
);
