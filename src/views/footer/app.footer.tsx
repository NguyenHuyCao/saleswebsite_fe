"use client";

import Image from "next/image";
import { Container, Stack, SvgIcon, type SvgIconProps } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";

const PHONE = "0392923392";
const PHONE_DISPLAY = "0392 923 392";
const ZALO_URL = `https://zalo.me/${PHONE}`;
const FACEBOOK_URL = "https://www.facebook.com/messages/e2ee/t/9200105130025225";

function ZaloIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.15" />
      <text x="24" y="31" textAnchor="middle" fontSize="22" fontWeight="bold" fill="currentColor" fontFamily="Arial, sans-serif">Z</text>
    </SvgIcon>
  );
}

function TikTokIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"
      />
    </SvgIcon>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook", href: FACEBOOK_URL, icon: FacebookOutlinedIcon, color: "#1877f2" },
  { label: "Zalo",     href: ZALO_URL,     icon: ZaloIcon,             color: "#0068ff" },
  { label: "YouTube",  href: "#",           icon: YouTubeIcon,          color: "#ff0000" },
  { label: "TikTok",   href: "#",           icon: TikTokIcon,           color: "#fff"    },
];

const POLICY_LINKS = ["Chính sách thành viên", "Thanh toán & vận chuyển", "Bảo hành & đổi trả", "Bảo mật thông tin"];
const GUIDE_LINKS  = ["Cách chọn máy phù hợp", "Hướng dẫn thanh toán", "Điều khoản sử dụng", "Câu hỏi thường gặp"];
const CAT_LINKS    = ["Máy cưa xích", "Máy cắt cỏ", "Máy phát điện", "Bugi, nhớt, phụ tùng"];

const BADGES = [
  { title: "GIAO HÀNG TOÀN QUỐC", desc: "Miễn phí nội thành Bắc Ninh", icon: LocalShippingOutlinedIcon },
  { title: "BẢO HÀNH",            desc: "Lên đến 12 tháng",            icon: GppGoodOutlinedIcon       },
  { title: `Gọi ${PHONE_DISPLAY}`, desc: "Để hỗ trợ ngay",             icon: ContactPhoneOutlinedIcon  },
  { title: "ĐỔI TRẢ",             desc: "Dễ dàng, minh bạch",         icon: ChangeCircleOutlinedIcon  },
];

const AppFooter = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#000", color: "#fff", fontSize: 14 }}>

      {/* ── Policy badges ── */}
      <Box sx={{ bgcolor: "#ffb700", py: { xs: 2, sm: 2.5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: { xs: 1.5, sm: 2.5 } }}>
            {BADGES.map((b) => (
              <Stack key={b.title} direction="row" spacing={1.5} alignItems="center">
                <b.icon sx={{ fontSize: { xs: 26, sm: 34 }, color: "#000", flexShrink: 0 }} />
                <Box>
                  <Typography fontWeight={700} sx={{ color: "#000", fontSize: { xs: 12, sm: 15 }, lineHeight: 1.2 }}>
                    {b.title}
                  </Typography>
                  <Typography sx={{ color: "#000", fontSize: { xs: 11, sm: 13 } }}>
                    {b.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Main content ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px 1fr" }, gap: { xs: 4, md: 5 } }}>

          {/* Brand */}
          <Box>
            <Image
              src="/images/store/logo-removebg-preview.png"
              alt="Logo Cường Hoa"
              width={220}
              height={86}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <Typography sx={{ mt: 1.5, lineHeight: 1.75, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              Chuyên bán máy cắt cỏ, máy cưa, máy phát điện 2 thì. Cam kết chất lượng cao, giá hợp lý, dịch vụ tận tâm.
            </Typography>
            <Stack spacing={1} mt={2}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <PlaceIcon sx={{ fontSize: 16, color: "#ffb700", mt: "2px", flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                  293 TL293, Nghĩa Phương, Bắc Ninh
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalPhoneIcon sx={{ fontSize: 16, color: "#ffb700", flexShrink: 0 }} />
                <Typography component="a" href={`tel:${PHONE}`}
                  sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", "&:hover": { color: "#ffb700" } }}>
                  {PHONE_DISPLAY}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ fontSize: 16, color: "#ffb700", flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                  support@cuonghoa.vn
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Links grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4,1fr)" }, gap: { xs: 3, sm: 4 } }}>

            <Box>
              <Typography fontWeight={700} mb={1.5} color="#ffb700" sx={{ fontSize: 13, letterSpacing: "0.04em" }}>CHÍNH SÁCH</Typography>
              {POLICY_LINKS.map((t) => (
                <Typography key={t} sx={{ mt: 1, fontSize: 13, color: "rgba(255,255,255,0.65)", cursor: "pointer", "&:hover": { color: "#ffb700" }, transition: "color 0.2s" }}>{t}</Typography>
              ))}
            </Box>

            <Box>
              <Typography fontWeight={700} mb={1.5} color="#ffb700" sx={{ fontSize: 13, letterSpacing: "0.04em" }}>HƯỚNG DẪN</Typography>
              {GUIDE_LINKS.map((t) => (
                <Typography key={t} sx={{ mt: 1, fontSize: 13, color: "rgba(255,255,255,0.65)", cursor: "pointer", "&:hover": { color: "#ffb700" }, transition: "color 0.2s" }}>{t}</Typography>
              ))}
            </Box>

            <Box>
              <Typography fontWeight={700} mb={1.5} color="#ffb700" sx={{ fontSize: 13, letterSpacing: "0.04em" }}>DANH MỤC NỔI BẬT</Typography>
              {CAT_LINKS.map((t) => (
                <Typography key={t} sx={{ mt: 1, fontSize: 13, color: "rgba(255,255,255,0.65)", cursor: "pointer", "&:hover": { color: "#ffb700" }, transition: "color 0.2s" }}>{t}</Typography>
              ))}
            </Box>

            <Box>
              <Typography fontWeight={700} mb={1.5} color="#ffb700" sx={{ fontSize: 13, letterSpacing: "0.04em" }}>LIÊN HỆ</Typography>
              <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase" }}>Mua online (08:00–21:00)</Typography>
              <Typography component="a" href={`tel:${PHONE}`}
                sx={{ display: "block", color: "#ffb700", fontSize: 15, fontWeight: 700, textDecoration: "none", mt: 0.5, "&:hover": { textDecoration: "underline" } }}>
                {PHONE_DISPLAY}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", mt: 2 }}>Góp ý & Khiếu nại</Typography>
              <Typography component="a" href={`tel:${PHONE}`}
                sx={{ display: "block", color: "#ffb700", fontSize: 15, fontWeight: 700, textDecoration: "none", mt: 0.5, "&:hover": { textDecoration: "underline" } }}>
                {PHONE_DISPLAY}
              </Typography>

              <Typography fontWeight={700} mt={2.5} mb={1} color="#ffb700" sx={{ fontSize: 13, letterSpacing: "0.04em" }}>MẠNG XÃ HỘI</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {SOCIAL_LINKS.map(({ label, href, icon: Icon, color }) => (
                  <Box key={label} component="a" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    sx={{
                      width: 36, height: 36, borderRadius: 1.5,
                      bgcolor: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color,
                      transition: "background 0.2s, transform 0.15s",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.18)", transform: "translateY(-2px)" },
                    }}>
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                ))}
              </Stack>
            </Box>

          </Box>
        </Box>
      </Container>

      {/* ── Copyright ── */}
      <Box sx={{ bgcolor: "#ffb700", py: { xs: 1.5, sm: 2 }, textAlign: "center", px: 2 }}>
        <Typography sx={{ fontSize: { xs: 13, sm: 15 }, color: "#000", fontWeight: 500 }}>
          Bản quyền thuộc về <strong>Cường Hoa</strong>. Cung cấp bởi <strong>HusTech</strong>
        </Typography>
      </Box>

    </Box>
  );
};

export default AppFooter;
