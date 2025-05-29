import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { FavoriteBorder, Search } from "@mui/icons-material";

const MainToolbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "black", boxShadow: "none" }}>
      <Container>
        <Toolbar
          sx={{
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            py: 2,
          }}
        >
          <Box
            component="img"
            src="/images/store/logo-removebg-preview.png"
            sx={{ height: { xs: 60, sm: 80, md: 100 } }}
          />

          <Box
            sx={{
              bgcolor: "#e5e7eb",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              maxWidth: { xs: "100%", sm: 400 },
              mx: 2,
            }}
          >
            <InputBase
              placeholder="Bạn muốn tìm gì?"
              fullWidth
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            />
            <IconButton>
              <Search sx={{ color: "#ffb700" }} />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            {["Yêu thích", "Đơn hàng", "Giỏ hàng"].map((label) => {
              const Icon =
                label === "Yêu thích"
                  ? FavoriteBorder
                  : label === "Đơn hàng"
                  ? BookmarkBorderOutlinedIcon
                  : ShoppingCartOutlinedIcon;

              return (
                <Box
                  key={label}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <IconButton
                    sx={{
                      color: "#ffb700",
                      border: "1px solid #ffb700",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                    }}
                  >
                    <Icon />
                  </IconButton>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: "bold",
                        color: "#ffb700",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography fontSize="12px">
                      <span style={{ color: "#ffb700", fontWeight: "bold" }}>
                        0
                      </span>{" "}
                      {label === "Đơn hàng" ? "Đơn hàng" : "Sản phẩm"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainToolbar;
