"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion, useInView } from "framer-motion";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";

type StatItem = {
  Icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
};

function AnimatedCounter({ target, suffix, running }: { target: number; suffix: string; running: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!running) return;
    let start = 0;
    const duration = 1600;
    const stepTime = Math.max(Math.floor(duration / target), 16);
    const step = Math.ceil(target / (duration / stepTime));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [running, target]);

  return (
    <span>
      {count.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
}

type Props = {
  productCount?: number;
  brandCount?: number;
  categoryCount?: number;
  customerCount?: number;
  yearsOfExperience?: number;
};

export default function SiteStatsSection({ productCount = 0, brandCount = 0, categoryCount = 0, customerCount, yearsOfExperience }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats: StatItem[] = [
    {
      Icon: InventoryIcon,
      value: productCount >= 10 ? productCount : 200,
      suffix: "+",
      label: "Sản phẩm chính hãng",
      color: "#f25c05",
    },
    {
      Icon: StorefrontIcon,
      value: brandCount >= 3 ? brandCount : 11,
      suffix: "+",
      label: "Thương hiệu uy tín",
      color: "#ffb700",
    },
    {
      Icon: EmojiEventsIcon,
      value: yearsOfExperience ?? (new Date().getFullYear() - 2019),
      suffix: "+",
      label: "Năm kinh nghiệm",
      color: "#fff",
    },
    {
      Icon: GroupsIcon,
      value: customerCount && customerCount > 100 ? customerCount : 5000,
      suffix: "+",
      label: "Khách hàng hài lòng",
      color: "#a8f0b8",
    },
  ];

  return (
    <Box
      ref={ref}
      sx={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1626 100%)",
        py: { xs: 4, md: 5.5 },
        position: "relative",
        overflow: "hidden",
        borderTop: "3px solid #f25c05",
      }}
    >
      {/* Subtle decorative glow */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(242,92,5,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: { xs: 0, md: 0 },
            divideX: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {stats.map(({ Icon, value, suffix, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: "easeOut" }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  py: { xs: 3, md: 2 },
                  px: { xs: 1.5, md: 3 },
                  borderRight: {
                    xs: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    md: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  },
                  borderBottom: {
                    xs: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    md: "none",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: { xs: 44, md: 52 },
                    height: { xs: 44, md: 52 },
                    borderRadius: 2.5,
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  <Icon sx={{ color, fontSize: { xs: 22, md: 26 } }} />
                </Box>

                {/* Number */}
                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                    color,
                    lineHeight: 1,
                    mb: 0.75,
                    letterSpacing: "-0.5px",
                  }}
                >
                  <AnimatedCounter target={value} suffix={suffix} running={isInView} />
                </Typography>

                {/* Label */}
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
