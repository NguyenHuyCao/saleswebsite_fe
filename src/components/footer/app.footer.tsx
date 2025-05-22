"use client";

import { Container, Stack } from "@mui/material";
import Image from "next/image";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

const AppFooter = () => {
  return (
    <Box sx={{ bgcolor: "#000", color: "#fff", fontSize: 14 }}>
      {/* Chính sách nổi bật */}
      <Box sx={{ bgcolor: "#ffb700", py: 2 }}>
        <Container
          maxWidth="xl"
          sx={
            {
              // display: "flex",
              // justifyContent: "center",
              // alignContent: "center",
            }
          }
        >
          {/* <Typography
            textAlign="center"
            fontWeight={700}
            fontSize={20}
            mb={2}
            color="black"
          >
            CHÍNH SÁCH:
          </Typography> */}
          <Grid container spacing={2} justifyContent="space-between">
            {[
              {
                title: "GIAO HÀNG MIỄN PHÍ",
                desc: "Nội thành Hồ Chí Minh",
                icon: LocalShippingOutlinedIcon,
              },
              {
                title: "BẢO HÀNH",
                desc: "Lên đến 12 tháng",
                icon: GppGoodOutlinedIcon,
              },
              {
                title: "Gọi 19006750",
                desc: "Để hỗ trợ ngay",
                icon: ContactPhoneOutlinedIcon,
              },
              {
                title: "ĐỔI TRẢ",
                desc: "Dễ dàng, minh bạch",
                icon: ChangeCircleOutlinedIcon,
              },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <item.icon sx={{ fontSize: 36, color: "black" }} />
                  <Box>
                    <Typography
                      fontWeight={700}
                      sx={{ color: "#000", fontSize: 16 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      fontWeight={500}
                      sx={{ color: "#000", fontSize: 14 }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Nội dung chính */}
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          py={6}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Cột logo và mô tả */}
          <Grid item xs={12} md={3}>
            <Image
              src="/images/store/logo-removebg-preview.png"
              alt="Logo"
              width={267}
              height={104}
            />
            <Typography
              // mt={2}
              sx={{
                maxWidth: { xs: "100%", md: 320 }, // hoặc 300–360 tuỳ layout
                lineHeight: 1.7,
                wordBreak: "break-word",
              }}
            >
              Cường Hoa là cửa hàng chuyên bán máy cắt cỏ, máy cưa, máy phát
              điện 2 thì. Chúng tôi cam kết cung cấp thiết bị chất lượng cao,
              giá cả hợp lý và dịch vụ tận tâm.
            </Typography>

            <Box mt={1}>
              <Stack direction="row" spacing={1} mb={1}>
                <PlaceIcon fontSize="small" sx={{ color: "#ffb700" }} />
                <Typography>70 Lữ Gia, P.15, Q.11, TP.HCM</Typography>
              </Stack>
              <Stack direction="row" spacing={1} mb={1}>
                <LocalPhoneIcon fontSize="small" sx={{ color: "#ffb700" }} />
                <Typography>19006750</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <EmailIcon fontSize="small" sx={{ color: "#ffb700" }} />
                <Typography>support@cuonghoa.vn</Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Các nhóm thông tin khác */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={4}>
              {/* Chính sách */}
              <Grid item xs={6} sm={3}>
                <Typography fontWeight={700} mb={1} color="#ffb700">
                  CHÍNH SÁCH
                </Typography>
                {[
                  "Chính sách thành viên",
                  "Thanh toán & vận chuyển",
                  "Bảo hành & đổi trả",
                  "Bảo mật thông tin",
                ].map((item) => (
                  <Typography key={item} mt={1}>
                    {item}
                  </Typography>
                ))}
              </Grid>

              {/* Hướng dẫn */}
              <Grid item xs={6} sm={3}>
                <Typography fontWeight={700} mb={1} color="#ffb700">
                  HƯỚNG DẪN
                </Typography>
                {[
                  "Cách chọn máy phù hợp",
                  "Hướng dẫn thanh toán",
                  "Điều khoản sử dụng",
                  "Câu hỏi thường gặp",
                ].map((item) => (
                  <Typography key={item} mt={1}>
                    {item}
                  </Typography>
                ))}
              </Grid>

              {/* Danh mục nổi bật */}
              <Grid item xs={6} sm={3}>
                <Typography fontWeight={700} mb={1} color="#ffb700">
                  DANH MỤC NỔI BẬT
                </Typography>
                {[
                  "Máy cưa xích",
                  "Máy cắt cỏ",
                  "Máy phát điện",
                  "Bugi, nhớt, phụ tùng",
                ].map((item) => (
                  <Typography key={item} mt={1}>
                    {item}
                  </Typography>
                ))}
              </Grid>

              {/* Liên hệ */}
              <Grid item xs={6} sm={3}>
                <Typography fontWeight={700} mb={1} color="#ffb700">
                  LIÊN HỆ
                </Typography>
                <Typography fontWeight={600} mt={1}>
                  MUA ONLINE (08:00 - 21:00)
                </Typography>
                <Typography color="#ffb700">19006750</Typography>
                <Typography fontWeight={600} mt={2}>
                  GÓP Ý & KHIẾU NẠI
                </Typography>
                <Typography color="#ffb700">19006750</Typography>
                <Typography mt={2} fontWeight={600} color="#ffb700">
                  LIÊN KẾT SÀN
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <FacebookOutlinedIcon />

                  <FacebookOutlinedIcon />
                  <FacebookOutlinedIcon />
                  <FacebookOutlinedIcon />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Bản quyền */}
      <Box sx={{ bgcolor: "#ffb700", py: 1.5, textAlign: "center" }}>
        <Typography fontSize={16} color="#000" fontWeight={500}>
          Bản quyền thuộc về <strong>Cường Hoa</strong>. Cung cấp bởi{" "}
          <strong>HusTech</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default AppFooter;
