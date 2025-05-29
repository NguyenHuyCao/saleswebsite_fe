"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

const WarrantyPageHero = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 400,
        backgroundColor: "#e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        py: 6,
      }}
    >
      <Image
        src="/images/warranty/technician.jpg"
        alt="Bảo hành kỹ thuật"
        layout="fill"
        objectFit="cover"
        style={{ zIndex: -1, opacity: 0.2 }}
      />
      <Box maxWidth={700} textAlign="center">
        <Typography variant="h4" fontWeight={700} mb={2}>
          Bảo hành nhanh chóng – An tâm sử dụng
        </Typography>
        <Typography mb={3}>
          Theo dõi bảo hành sản phẩm bạn đã mua – minh bạch, chính xác và thuận
          tiện!
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Tra cứu bảo hành
        </Button>
      </Box>
    </Box>
  );
};

export default WarrantyPageHero;
