"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ContactInfoMapSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box px={4} py={8} bgcolor="#f9f9f9">
      <Grid container spacing={4}>
        {/* Thông tin liên hệ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              THÔNG TIN LIÊN HỆ
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <RoomIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Typography>
                7FGV+PM Lục Nam District, Bac Giang, Vietnam
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Link href="tel:0909123456" underline="hover" color="inherit">
                0909 123 456
              </Link>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Link
                href="mailto:info@dolatool.vn"
                underline="hover"
                color="inherit"
              >
                info@dolatool.vn
              </Link>
            </Box>
            <Box display="flex" alignItems="center">
              <AccessTimeIcon sx={{ color: "#ffb700", mr: 2 }} />
              <Typography>Thứ 2 – Thứ 7: 8:00 – 17:30</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Bản đồ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <iframe
              title="DolaTool Map"
              width="100%"
              height={isMobile ? 300 : 400}
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44565.070290525546!2d106.44437623455282!3d21.273365680042907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1sen!2sus!4v1748509785866!5m2!1sen!2sus"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactInfoMapSection;
