"use client";

import { Box, Typography, Paper, Stack, Button, Divider, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedIcon from "@mui/icons-material/Verified";
import { getWarrantyCenters } from "../api";

export default function WarrantyServiceCenters() {
  const center = getWarrantyCenters()[0];

  return (
    <Box sx={{ my: 6 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
        <LocationOnIcon sx={{ color: "#0d47a1", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={800} color="#333">
          Địa chỉ bảo hành trực tiếp
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, ml: "44px" }}>
        Mang sản phẩm đến cửa hàng để được hỗ trợ kiểm tra và sửa chữa
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid container>
            {/* Left — store info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                    label="Chi nhánh chính thức"
                    size="small"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#0d47a1",
                      fontWeight: 600,
                      border: "1px solid #90caf9",
                    }}
                  />
                </Stack>

                <Typography variant="h6" fontWeight={800} color="#0d47a1" sx={{ mb: 2.5 }}>
                  {center.name}
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 20, color: "#0d47a1" }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: ".5px" }}>
                        Địa chỉ
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.25, color: "#333" }}>
                        {center.address}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 20, color: "#0d47a1" }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: ".5px" }}>
                        Điện thoại
                      </Typography>
                      <Typography
                        variant="body2"
                        component="a"
                        href={`tel:${center.phone.replace(/\s/g, "")}`}
                        sx={{
                          display: "block",
                          mt: 0.25,
                          color: "#0d47a1",
                          fontWeight: 700,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {center.phone}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 20, color: "#0d47a1" }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: ".5px" }}>
                        Giờ làm việc
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.25, color: "#333" }}>
                        {center.hours}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="contained"
                  fullWidth
                  href={center.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: "#0d47a1",
                    color: "#fff",
                    fontWeight: 700,
                    py: 1.2,
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                >
                  Xem đường đi
                </Button>
              </Box>
            </Grid>

            {/* Right — map embed */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  height: { xs: 240, md: "100%" },
                  minHeight: { md: 320 },
                  position: "relative",
                  borderLeft: { md: "1px solid #e0e0e0" },
                  borderTop: { xs: "1px solid #e0e0e0", md: "none" },
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={center.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", minHeight: 240 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ cửa hàng Cường Hoa"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
}
