"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.5,
          fontSize: "14px",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            color: "black",
            fontSize: "14px",
            fontWeight: 700,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Chào mừng bạn đã đến với cửa hàng Cường Hoa
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {["Đăng ký", "Đăng nhập"].map((label, index) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
              {index > 0 && <Typography sx={{ mx: 0.2 }}>|</Typography>}
              <Button
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 1,
                  minWidth: 0,
                  "&:hover": { color: "#f25c05", background: "#ffb700" },
                }}
                onClick={() =>
                  router.push(
                    `/login?page=${
                      label === "Đăng nhập" ? "login" : "register"
                    }`
                  )
                }
              >
                {label}
              </Button>
            </Box>
          ))}

          <Typography sx={{ fontSize: "14px", fontWeight: 700, mx: 0.5 }}>
            Hotline:
          </Typography>

          <Box
            sx={{
              bgcolor: "#f25c05",
              px: 1,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              color: "black",
              fontSize: "14px",
              py: 0.5,
            }}
          >
            <LocalPhoneOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />
            <Typography fontWeight="bold" ml={0.5}>
              0392923392
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TopBar;
