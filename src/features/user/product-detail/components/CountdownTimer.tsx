"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
  deadline: string;
}

export default function CountdownTimer({ deadline }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <Typography
        component="span"
        sx={{
          bgcolor: "#dc2626",
          color: "#fff",
          px: 0.5,
          borderRadius: 0.5,
          fontWeight: 700,
        }}
      >
        {String(timeLeft.hours).padStart(2, "0")}
      </Typography>
      <Typography component="span" sx={{ color: "#dc2626", fontWeight: 700 }}>
        :
      </Typography>
      <Typography
        component="span"
        sx={{
          bgcolor: "#dc2626",
          color: "#fff",
          px: 0.5,
          borderRadius: 0.5,
          fontWeight: 700,
        }}
      >
        {String(timeLeft.minutes).padStart(2, "0")}
      </Typography>
      <Typography component="span" sx={{ color: "#dc2626", fontWeight: 700 }}>
        :
      </Typography>
      <Typography
        component="span"
        sx={{
          bgcolor: "#dc2626",
          color: "#fff",
          px: 0.5,
          borderRadius: 0.5,
          fontWeight: 700,
        }}
      >
        {String(timeLeft.seconds).padStart(2, "0")}
      </Typography>
    </Box>
  );
}
