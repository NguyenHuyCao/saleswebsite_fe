"use client";

import { Box, Typography, Stack } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { motion } from "framer-motion";

export const SupportBox = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Box
      sx={{
        bgcolor: "#fff",
        p: 2,
        border: "1px solid #eee",
        borderRadius: 2,
        boxShadow: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 3,
          borderColor: "#ffb700",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <SupportAgentIcon color="error" fontSize="large" />
        <Box>
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Để được hỗ trợ, vui lòng gọi
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            color="error.main"
            sx={{ lineHeight: 1.3 }}
          >
            1900 6750
          </Typography>
        </Box>
      </Stack>
    </Box>
  </motion.div>
);
