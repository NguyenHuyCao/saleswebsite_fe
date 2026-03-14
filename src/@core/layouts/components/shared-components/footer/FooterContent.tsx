"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const FooterWrapper = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const FooterContent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      {/* Phần thông tin danh mục sản phẩm */}
      <Box sx={{ p: 3, pb: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              <StoreIcon
                sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
              />
              DANH MỤC SẢN PHẨM CHÍNH
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              <Chip
                icon={<MilitaryTechIcon />}
                label="Máy cưa 2 thì"
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<MilitaryTechIcon />}
                label="Máy phát điện"
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<MilitaryTechIcon />}
                label="Máy tỉa cỏ"
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<MilitaryTechIcon />}
                label="Quần áo quân đội"
                size="small"
                color="secondary"
                variant="outlined"
              />
              <Chip
                icon={<MilitaryTechIcon />}
                label="Phụ tùng 2 thì"
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<MilitaryTechIcon />}
                label="Đồ bảo hộ"
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              <CategoryIcon
                sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
              />
              THỐNG KÊ NHANH
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InventoryIcon
                    sx={{ fontSize: 16, color: "success.main", mr: 1 }}
                  />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Sản phẩm
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      247
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalShippingIcon
                    sx={{ fontSize: 16, color: "info.main", mr: 1 }}
                  />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Đơn hàng tháng
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      43
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Phần thông tin cửa hàng và copyright */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          © {currentYear}{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
            Cường Hoa
          </Box>{" "}
          - Chuyên máy cưa, máy phát, máy tỉa cỏ 2 thì
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Admin: Cao Văn A
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Phiên bản 2.0.1
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
};

export default FooterContent;