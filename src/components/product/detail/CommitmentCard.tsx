import { Card, CardContent, Typography, Stack } from "@mui/material";

export const CommitmentCard = () => (
  <Card>
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="body2">✔ Cam kết 100% chính hãng</Typography>
        <Typography variant="body2">✔ Hoàn tiền 111% nếu hàng giả</Typography>
        <Typography variant="body2">✔ Giao tận tay khách hàng</Typography>
        <Typography variant="body2">✔ Mở hộp kiểm tra nhận hàng</Typography>
        <Typography variant="body2">✔ Hỗ trợ 24/7</Typography>
        <Typography variant="body2">✔ Đổi trả trong 7 ngày</Typography>
      </Stack>
    </CardContent>
  </Card>
);
