import { Box, Typography, Stack } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export const SupportBox = () => (
  <Box
    sx={{
      bgcolor: "#fff",
      p: 2,
      border: "1px solid #eee",
      borderRadius: 2,
      boxShadow: 1,
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <SupportAgentIcon color="error" fontSize="large" />
      <Box>
        <Typography variant="body1" fontWeight={600}>
          Để được hỗ trợ. Hãy gọi:
        </Typography>
        <Typography variant="h6" color="error.main" fontWeight={700}>
          1900 6750
        </Typography>
      </Box>
    </Stack>
  </Box>
);
