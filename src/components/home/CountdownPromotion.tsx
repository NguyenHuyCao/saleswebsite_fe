"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Stack } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

const CountdownPromotion = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);

  const calculateTimeLeft = () => {
    const difference = +new Date(deadline) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const renderTimeBox = (value: number, label: string) => (
    <Paper
      elevation={3}
      sx={{
        px: 2,
        py: 1,
        mx: 0.5,
        backgroundColor: "#2563eb",
        color: "white",
        borderRadius: 2,
        textAlign: "center",
        minWidth: 50,
        transition: "all 0.3s ease",
        animation: "pulse 1s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography fontSize={12}>{label}</Typography>
    </Paper>
  );

  if (!hasMounted) return null;

  return (
    <Box textAlign="center" py={4}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        mb={1}
      >
        <BoltIcon sx={{ color: "#f25c05" }} />
        <Typography variant="h6" fontWeight="bold" mt={2} color="black">
          THỜI GIAN CHỈ CÒN
        </Typography>
      </Stack>

      <Grid container justifyContent="center" mt={2}>
        {renderTimeBox(timeLeft.days, "Days")}
        {renderTimeBox(timeLeft.hours, "Hours")}
        {renderTimeBox(timeLeft.minutes, "Minutes")}
        {renderTimeBox(timeLeft.seconds, "Seconds")}
      </Grid>
    </Box>
  );
};

export default CountdownPromotion;
