"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const FooterContent = () => {
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Cửa hàng `}
        <Box component="span" sx={{ fontWeight: 700 }}>
          Cường Hoa
        </Box>
        {` - Chuyên máy cưa, máy phát, máy tỉa cỏ 2 thì`}
      </Typography>

      {hidden ? null : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            "& :not(:last-child)": { mr: 4 },
          }}
        >
          <Link target="_blank" href="/about">
            Giới thiệu
          </Link>
          <Link target="_blank" href="/warranty">
            Chính sách bảo hành
          </Link>
          <Link target="_blank" href="/question">
            Hướng dẫn mua hàng
          </Link>
          <Link target="_blank" href="/contact">
            Liên hệ
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default FooterContent;
