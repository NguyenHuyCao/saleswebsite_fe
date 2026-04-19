"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CountdownPromotionProps {
  deadline: string;
  compact?: boolean; // Thêm prop compact
}

export default function CountdownPromotion({
  deadline,
  compact = false,
}: CountdownPromotionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // Compact mode - chỉ hiển thị giờ:phút:giây
  if (compact) {
    return (
      <Box
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      >
        <Typography
          component="span"
          variant="body2"
          fontWeight={700}
          color="#f25c05"
        >
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </Typography>
      </Box>
    );
  }

  // Full mode - hiển thị đầy đủ
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        my: 3,
      }}
    >
      {[
        { label: "Ngày", value: timeLeft.days },
        { label: "Giờ", value: timeLeft.hours },
        { label: "Phút", value: timeLeft.minutes },
        { label: "Giây", value: timeLeft.seconds },
      ].map((item) => (
        <Box key={item.label} sx={{ textAlign: "center" }}>
          <motion.div
            key={item.value}

            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 0.5,
              repeat: item.label === "Giây" ? Infinity : 0,
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #f25c05, #ffb700)",
                color: "#fff",
                fontWeight: 900,
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                minWidth: { xs: 50, md: 70 },
                py: 1,
                px: 1,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(242, 92, 5, 0.3)",
              }}
            >
              {String(item.value).padStart(2, "0")}
            </Box>
          </motion.div>
          <Typography
            variant="caption"
            sx={{ mt: 0.5, color: "#666", fontWeight: 500 }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
