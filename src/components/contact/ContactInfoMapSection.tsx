"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";

const contactItems = [
  {
    icon: <RoomIcon sx={{ color: "#ffb700" }} />,
    label: "7FGV+PM Lục Nam District, Bac Giang, Vietnam",
  },
  {
    icon: <PhoneIcon sx={{ color: "#ffb700" }} />,
    label: (
      <Link href="tel:0909123456" underline="hover" color="inherit">
        0909 123 456
      </Link>
    ),
  },
  {
    icon: <EmailIcon sx={{ color: "#ffb700" }} />,
    label: (
      <Link href="mailto:info@dolatool.vn" underline="hover" color="inherit">
        info@dolatool.vn
      </Link>
    ),
  },
  {
    icon: <AccessTimeIcon sx={{ color: "#ffb700" }} />,
    label: "Thứ 2 – Thứ 7: 8:00 – 17:30",
  },
];

const ContactInfoMapSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box px={{ xs: 2, sm: 4 }} py={8} bgcolor="#f9f9f9">
      <Grid container spacing={4}>
        {/* Thông tin liên hệ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper elevation={4} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                THÔNG TIN LIÊN HỆ
              </Typography>

              <Stack spacing={2} mt={2}>
                {contactItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box mr={2}>{item.icon}</Box>
                      <Typography variant="body1">{item.label}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Paper>
          </motion.div>
        </Grid>

        {/* Google Map */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: isMobile ? 280 : 400,
              }}
            >
              <iframe
                title="DolaTool Google Map"
                aria-label="Google map của Dola Tool"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44565.070290525546!2d106.44437623455282!3d21.273365680042907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1sen!2sus!4v1748509785866!5m2!1sen!2sus"
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactInfoMapSection;
