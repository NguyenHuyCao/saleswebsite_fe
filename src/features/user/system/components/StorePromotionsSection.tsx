"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { StoreInfo } from "../types";

type Props = {
  store: StoreInfo;
};

export default function StorePromotionsSection({ store }: Props) {
  const promotions = store.promotions || [
    {
      title: "Giảm 20% cho đơn hàng đầu tiên",
      description: "Áp dụng cho khách hàng mới tại cửa hàng",
      validUntil: "31/12/2024",
    },
    {
      title: "Mua máy cắt cỏ tặng phụ kiện",
      description: "Tặng dây cắt, kính bảo hộ và găng tay",
      validUntil: "30/06/2024",
    },
    {
      title: "Ưu đãi đặc biệt khi mua combo",
      description: "Giảm thêm 10% khi mua từ 2 sản phẩm trở lên",
      validUntil: "31/05/2024",
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <LocalOfferIcon sx={{ color: "#f25c05", fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="#333">
            Khuyến mãi tại cửa hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ưu đãi đặc biệt dành riêng cho khách hàng đến trực tiếp
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {promotions.map((promo, idx) => (
          <Grid key={idx} size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Chip
                    label="Ưu đãi đặc biệt"
                    size="small"
                    sx={{
                      bgcolor: "#f25c05",
                      color: "#fff",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {promo.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {promo.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon sx={{ color: "#999", fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      HSD: {promo.validUntil}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
