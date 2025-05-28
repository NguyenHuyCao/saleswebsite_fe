"use client";

import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

const AboutDolaTool = () => {
  return (
    <Box
      px={4}
      py={6}
      sx={{
        "@keyframes fadeZoomIn": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
        "@keyframes slideInLeft": {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Image Grid */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/2",
                  borderRadius: 2,
                  overflow: "hidden",
                  animation: "fadeZoomIn 1s ease",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Image
                  src="/images/about/1534231926-5.jpg"
                  alt="Image 1"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>

              <Box
                mt={1}
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/2",
                  borderRadius: 2,
                  overflow: "hidden",
                  animation: "fadeZoomIn 1s ease",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Image
                  src="/images/about/cua-betong-gs461.jpg"
                  alt="Image 3"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: 2,
                  overflow: "hidden",
                  animation: "fadeZoomIn 1s ease",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Image
                  src="/images/about/may-cat-co-1-trieu-1 (1).jpg"
                  alt="Image 2"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Text Grid */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Image
            src={"/images/store/logo-removebg-preview.png"}
            alt="logo"
            height={70}
            width={200}
          />
          <Typography
            variant="h5"
            fontWeight={700}
            mb={2}
            sx={{
              animation: "fadeIn 1s ease-in",
              animationDelay: "0.2s",
              animationFillMode: "both",
              opacity: 0,
            }}
          >
            MANG ĐẾN NHỮNG <span style={{ color: "#ffb700" }}>GIẢI PHÁP</span>{" "}
            TOÀN DIỆN
          </Typography>
          <Typography
            fontSize={16}
            mb={3}
            sx={{
              animation: "fadeIn 1.2s ease-in",
              animationDelay: "0.4s",
              animationFillMode: "both",
              opacity: 0,
            }}
          >
            Dola Tool là một cửa hàng dụng cụ cơ khí hàng đầu, mang đến cho
            khách hàng những sản phẩm chất lượng và đáng tin cậy. Với nhiều năm
            kinh nghiệm trong việc cung cấp các dụng cụ cơ khí chuyên nghiệp,
            chúng tôi tự tin khẳng định mình là địa chỉ mua sắm lý tưởng dành
            cho tất cả các nhà thợ, kỹ sư và những người yêu thích công việc cơ
            khí.
          </Typography>
          <List>
            {[
              "Sản phẩm vô cùng chất lượng",
              "Đội ngũ giàu kinh nghiệm",
              "Luôn đồng hành và hỗ trợ",
              "Nhiều ưu đãi và giảm giá",
            ].map((text, index) => (
              <ListItem key={index} disablePadding>
                <ListItemIcon
                  sx={{
                    animation: "slideInLeft 0.6s ease",
                    animationDelay: `${0.3 + index * 0.2}s`,
                    animationFillMode: "both",
                    opacity: 0,
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#ffb700" }} />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: 15,
                    sx: {
                      animation: "fadeIn 0.6s ease",
                      animationDelay: `${0.3 + index * 0.2 + 0.1}s`,
                      animationFillMode: "both",
                      opacity: 0,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutDolaTool;
