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

const AboutDolaTool = () => {
  const listItems = [
    "Sản phẩm vô cùng chất lượng",
    "Đội ngũ giàu kinh nghiệm",
    "Luôn đồng hành và hỗ trợ",
    "Nhiều ưu đãi và giảm giá",
  ];

  return (
    <Box px={4} py={8}>
      <Grid container spacing={4} alignItems="center">
        {/* Image grid */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              {[
                "/images/about/1534231926-5.jpg",
                "/images/about/cua-betong-gs461.jpg",
              ].map((src, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3 }}
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
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
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

        {/* Text grid */}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h5" fontWeight={700} mb={2}>
              MANG ĐẾN NHỮNG <span style={{ color: "#ffb700" }}>GIẢI PHÁP</span>{" "}
              TOÀN DIỆN
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography fontSize={16} mb={3} color="text.secondary">
              Dola Tool là một cửa hàng dụng cụ cơ khí hàng đầu, mang đến cho
              khách hàng những sản phẩm chất lượng và đáng tin cậy. Với nhiều
              năm kinh nghiệm trong việc cung cấp các dụng cụ cơ khí chuyên
              nghiệp, chúng tôi tự tin khẳng định mình là địa chỉ mua sắm lý
              tưởng dành cho tất cả các nhà thợ, kỹ sư và những người yêu thích
              công việc cơ khí.
            </Typography>
          </motion.div>

          <List disablePadding>
            {listItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
                viewport={{ once: true }}
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
};

export default AboutDolaTool;
