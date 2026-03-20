// about/components/WhoWeAre.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const values = [
  "Chất lượng hàng đầu",
  "Uy tín làm gốc",
  "Khách hàng là trọng tâm",
  "Đổi mới không ngừng",
];

export default function WhoWeAre() {
  return (
    <Box
      id="who-we-are"
      px={{ xs: 2, md: 4 }}
      py={{ xs: 6, md: 10 }}
      bgcolor="#fff"
    >
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Chip
              label="VỀ CHÚNG TÔI"
              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
            />

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Chúng tôi là{" "}
              <Box component="span" sx={{ color: "#f25c05" }}>
                ai?
              </Box>
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              Với hơn <strong>5 năm kinh nghiệm</strong> trong lĩnh vực phân
              phối máy 2 thì, chúng tôi tự hào là đối tác tin cậy của hàng nghìn
              khách hàng trên toàn quốc.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              Sứ mệnh của chúng tôi là mang đến những sản phẩm chất lượng cao
              với giá cả hợp lý, cùng dịch vụ hậu mãi tận tâm, giúp khách hàng
              tối ưu hiệu quả công việc.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Giá trị cốt lõi
              </Typography>
              <Grid container spacing={2}>
                {values.map((value, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ color: "#f25c05" }} />
                      <Typography variant="body2">{value}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                "&:hover img": { transform: "scale(1.05)" },
              }}
            >
              <Image
                src="/images/about/4D-Leadership-approach.png"
                alt="About our team"
                width={700}
                height={460}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  transition: "transform 0.5s",
                }}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
