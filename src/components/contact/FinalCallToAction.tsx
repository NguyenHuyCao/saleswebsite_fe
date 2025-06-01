"use client";

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FinalCallToAction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? 280 : 400,
        mt: 8,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
      }}
    >
      <Image
        src="/images/banner/pngtree-an-orange-lawn-mower-parked-in-the-grass-image_2919945.jpg"
        alt="CTA Background"
        fill
        style={{ objectFit: "cover", zIndex: 1 }}
        priority
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          maxWidth: 720,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="white" mb={2}>
          CHỌN ĐÚNG THƯƠNG HIỆU – TĂNG HIỆU QUẢ CÔNG VIỆC NGAY HÔM NAY
        </Typography>
        <Typography color="white" fontSize={16} mb={3}>
          Đừng bỏ lỡ cơ hội nhận ưu đãi cực sốc & hỗ trợ tư vấn tận tâm từ đội
          ngũ của chúng tôi
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: "#f25c05", color: "white", textTransform: "none" }}
          >
            Liên hệ tư vấn
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ color: "white", borderColor: "white", textTransform: "none" }}
            onClick={() => router.push("/product")}
          >
            Mua ngay – Ưu đãi cực sốc!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FinalCallToAction;
