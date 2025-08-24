"use client";

import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <Box px={4} py={{ xs: 6, md: 10 }} bgcolor="#f9f9f9">
      <Grid container spacing={6} alignItems="center">
        <Grid  size={{xs:12, md:6}} >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              sx={{ color: "#1e293b" }}
            >
              Chúng tôi là ai?
            </Typography>
            <Typography fontSize={16} color="text.secondary" lineHeight={1.7}>
              Với hơn <strong>5 năm kinh nghiệm</strong> phân phối dòng máy 2
              thì chất lượng, chúng tôi tự hào mang đến{" "}
              <strong>giải pháp hiệu quả</strong> và <strong>tiết kiệm</strong>
              ...
            </Typography>
          </motion.div>
        </Grid>
        <Grid  size={{xs:12, md:6}} >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Image
                src="/images/about/4D-Leadership-approach.png"
                alt="About our team"
                width={700}
                height={460}
                loading="lazy"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
