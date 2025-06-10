"use client";

import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Box, Typography, Paper, Divider, Stack } from "@mui/material";
import Image from "next/image";

const MomoPaymentPage = () => {
  return (
    <>
      <PageViewTracker />
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 600,
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Thanh toán bằng MoMo
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" textAlign="center" mb={2}>
            Vui lòng quét mã QR bên dưới bằng ứng dụng MoMo để thanh toán.
          </Typography>

          <Box display="flex" justifyContent="center" mb={3}>
            <Image
              src="/images/momo/qr_momo.jpeg"
              alt="QR MoMo"
              width={300}
              height={300}
              style={{ borderRadius: 8, border: "1px solid #ccc" }}
            />
          </Box>

          <Stack spacing={1} mb={3}>
            <Typography variant="body2">
              <strong>Chủ tài khoản:</strong> Nguyễn Văn A
            </Typography>
            <Typography variant="body2">
              <strong>Số điện thoại MoMo:</strong> 0901 234 567
            </Typography>
            <Typography variant="body2">
              <strong>Số tiền:</strong> Theo giá trị đơn hàng
            </Typography>
            <Typography variant="body2">
              <strong>Thời gian hiệu lực:</strong> Trong vòng 15 phút kể từ lúc
              đặt hàng
            </Typography>
          </Stack>

          <Box
            sx={{
              backgroundColor: "#f0f4ff",
              borderLeft: "4px solid #3f51b5",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Lưu ý nội dung chuyển khoản:</strong>
            </Typography>
            <Typography variant="body2" mt={1}>
              Vui lòng ghi đúng cú pháp:{" "}
              <strong>[Họ tên] - [Tên sản phẩm]</strong>
            </Typography>
            <Typography variant="body2" color="error" mt={1}>
              Ví dụ: <strong>Nguyen Van B - Tai nghe Sony WH-1000XM5</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MomoPaymentPage;
