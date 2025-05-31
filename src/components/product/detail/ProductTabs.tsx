"use client";

import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";

const tabLabels = [
  "Mô tả sản phẩm",
  "Hướng dẫn mua hàng",
  "Chính sách bảo hành và bảo trì",
];

const tabContent = [
  <>
    <Typography variant="h6" gutterBottom>
      Lý do bạn nên chọn mua máy cắt sắt 2300W Dewalt D28730-B1
    </Typography>
    <Typography paragraph>
      Dewalt D28730-B1 là sản phẩm chuyên dùng để cắt các vật liệu cứng sắt,
      thép... trong các cửa hàng bán thiết bị xây dựng, cửa hàng cơ khí...
    </Typography>
    <Box
      component="img"
      src="/images/product/mpd-daewoo-dag-9900dbx-1_20210514115542.jpg"
      alt="Máy cắt sắt"
      sx={{ maxWidth: 400, my: 2, borderRadius: 2, boxShadow: 2 }}
    />
    <Typography paragraph>
      Máy cắt sắt Dewalt D28730-B1 được sản xuất theo công nghệ hiện đại nhất
      của Mỹ với công suất mô tơ mạnh mẽ lên tới 2300W giúp cắt sắt nhanh chóng.
    </Typography>
    <Typography paragraph>
      Máy cắt sắt có kết cấu được gia công bằng chất liệu nhôm kép cứng cáp đảm
      bảo độ bền. Chất liệu nhôm bền đẹp, chống ăn mòn, chống gỉ sét.
    </Typography>
  </>,
  <Box>
    {[1, 2, 3, 4, 5].map((step) => (
      <Typography paragraph key={step}>
        <strong>Bước {step}:</strong> Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Integer nec odio.
      </Typography>
    ))}
    <Typography paragraph>
      Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện
      lại để xác nhận lại đơn hàng và địa chỉ của bạn.
    </Typography>
  </Box>,
  <Box>
    <Typography paragraph>
      <b>1. BẢO HÀNH</b>
    </Typography>
    <Typography paragraph>
      <b>1.1 Quy định về bảo hành</b>
    </Typography>
    <Typography paragraph>
      Sản phẩm được bảo hành miễn phí nếu sản phẩm đó còn thời hạn bảo hành được
      tính kể từ ngày giao hàng...
    </Typography>
    <Typography paragraph>
      <b>1.2 Những trường hợp không được bảo hành</b>
    </Typography>
    <Typography paragraph>
      - Sản phẩm hết thời hạn bảo hành hoặc mất Phiếu bảo hành.
    </Typography>
    <Typography paragraph>
      <b>2. BẢO TRÌ</b>
    </Typography>
    <Typography paragraph>
      Bảo trì, bảo dưỡng: bao gồm lau chùi sản phẩm, sửa chữa những hỏng hóc nhỏ
      có thể sửa được.
    </Typography>
  </Box>,
];

export const ProductTabs = () => {
  const [value, setValue] = useState(0);
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <Box flex={1}>
          <Tabs
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: value === index ? "#000" : "#888",
                  borderBottom: value === index ? "3px solid #ffc107" : "none",
                  transition: "all 0.3s",
                  px: 3,
                }}
              />
            ))}
          </Tabs>
          <Box mt={2}>{tabContent[value]}</Box>
        </Box>

        {/* Suggest right side (fake) */}
        <Box
          sx={{
            width: 300,
            display: { xs: "none", md: "block" },
            borderLeft: "1px solid #eee",
            pl: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="warning.main" mb={2}>
            CÓ THỂ{" "}
            <Box component="span" color="primary.main">
              BẠN THÍCH
            </Box>
          </Typography>
          {[...Array(6)].map((_, i) => (
            <Box key={i} display="flex" alignItems="center" mb={2}>
              <Box
                component="img"
                src="/images/product/mpd-daewoo-dag-9900dbx-1_20210514115542.jpg"
                alt="gợi ý"
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 1,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="body2" noWrap>
                  Máy cắt rãnh tường 5 lưỡi Bengu...
                </Typography>
                <Typography fontWeight={700} color="error.main" variant="body2">
                  4.550.000₫
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ textDecoration: "line-through" }}
                >
                  5.200.000₫
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
