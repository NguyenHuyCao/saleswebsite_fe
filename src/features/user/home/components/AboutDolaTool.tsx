"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { motion } from "framer-motion";
import Grid from "@mui/material/Grid";

export default function AboutDolaTool() {
  const listItems = [
    "Sản phẩm vô cùng chất lượng",
    "Đội ngũ giàu kinh nghiệm",
    "Luôn đồng hành và hỗ trợ",
    "Nhiều ưu đãi và giảm giá",
  ];

  return (
    <Box sx={{ py: { xs: 5, md: 7 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              {[
                "/images/about/1534231926-5.jpg",
                "/images/about/cua-betong-gs461.jpg",
              ].map((src, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3/2",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: idx === 0 ? 16 : 0,
                  }}
                >
                  <Image
                    src={src}
                    alt={`about-${idx}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </motion.div>
              ))}
            </Grid>
            <Grid size={{ xs: 6 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/about/may-cat-co-1-trieu-1 (1).jpg"
                  alt="about-right"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box mb={2}>
            <Image
              src="/images/store/logo-removebg-preview.png"
              alt="logo"
              width={200}
              height={70}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <motion.div

            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h5" fontWeight={700} mb={2}>
              MANG ĐẾN NHỮNG <span style={{ color: "#ffb700" }}>GIẢI PHÁP</span>{" "}
              TOÀN DIỆN
            </Typography>
          </motion.div>

          <motion.div

            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography fontSize={16} mb={3} color="text.secondary">
              Cường Hoa là cửa hàng chuyên bán và sửa chữa máy 2 thì chính hãng
              tại Bắc Ninh. Chúng tôi cung cấp máy cắt cỏ, máy cưa xích, máy
              phát điện cùng đầy đủ phụ kiện – cam kết chất lượng, giá hợp lý.
            </Typography>
          </motion.div>

          <List disablePadding>
            {listItems.map((item, i) => (
              <motion.div
                key={i}

                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
              >
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: "#ffb700" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      fontSize: 15,
                      color: "text.primary",
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
