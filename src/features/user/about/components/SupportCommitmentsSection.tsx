"use client";

import { Box, Grid, Typography, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const commitments = ["Hàng chính hãng", "Bảo hành 12 tháng", "Hỗ trợ kỹ thuật trọn đời", "Giao hàng toàn quốc"];

export default function SupportCommitmentsSection() {
  return (
    <Box px={{ xs: 2, sm: 4 }} py={6} bgcolor="#fffaf0" sx={{ textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold" mb={4} color="primary" sx={{ "& span": { color: "#ffb700" } }}>
        CAM KẾT <span>& HỖ TRỢ</span>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {commitments.map((text, i) => (
          <Grid size={{xs:12, sm:6, md:3,}}  key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3, height: "100%", transition: "transform 0.3s ease", "&:hover": { transform: "translateY(-6px)", boxShadow: 6 } }}>
                <CheckCircleIcon sx={{ fontSize: 42, color: "#ffb700", mb: 1 }} />
                <Typography fontSize={16} fontWeight={600} color="text.primary">{text}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
