"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

export default function FireworksOverlay({
  duration = 2200,
  zIndex = 1500,
  onDone,
}: {
  duration?: number;
  zIndex?: number;
  onDone?: () => void;
}) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number>(null);
  const start = useRef<number | null>(null);
  const parts = useRef<any[]>([]);
  const last = useRef(0);

  // Ưu tiên màu brand
  const colors = [
    "#FFB700",
    "#F25C05",
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
  ];

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      onDone?.();
      return;
    }
    const c = canvasRef.current!;
    const ctx = c.getContext("2d", { alpha: true })!;
    let w = 0,
      h = 0,
      dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
    };
    resize();
    const onResize = () => {
      cancelAnimationFrame(raf.current!);
      resize();
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const rand = (a: number, b: number) => Math.random() * (b - a) + a;
    const hex = (col: string, a: number) => {
      if (col.startsWith("rgb"))
        return col.replace(")", `,${a})`).replace("rgb", "rgba");
      let x = col.replace("#", "");
      if (x.length === 3)
        x = x
          .split("")
          .map((s) => s + s)
          .join("");
      const n = parseInt(x, 16);
      const r = (n >> 16) & 255,
        g = (n >> 8) & 255,
        b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    };
    const spawn = () => {
      const cx = rand(w * 0.2, w * 0.8),
        cy = rand(h * 0.25, h * 0.6);
      const count = Math.floor(rand(40, 70));
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const ang = rand(0, Math.PI * 2);
        const spd = rand(80, 220) * dpr;
        parts.current.push({
          x: cx * dpr,
          y: cy * dpr,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
          fade: rand(0.01, 0.018),
          sz: rand(1.2, 2.6) * dpr,
          color,
        });
      }
    };

    const gravity = 240 * dpr,
      friction = 0.985;
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      const el = t - start.current!;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "lighter";

      if (el - last.current > 420) {
        spawn();
        last.current = el;
      }

      for (let i = parts.current.length - 1; i >= 0; i--) {
        const p = parts.current[i];
        p.vx *= friction;
        p.vy = p.vy * friction + gravity * (16 / 1000);
        p.x += p.vx * (16 / 1000);
        p.y += p.vy * (16 / 1000);
        p.life -= p.fade;
        if (p.life <= 0 || p.y > c.height + 40 * dpr) {
          parts.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = hex(p.color, Math.max(p.life, 0));
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      if (el < duration || parts.current.length > 0)
        raf.current = requestAnimationFrame(tick);
      else onDone?.();
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current!);
      window.removeEventListener("resize", onResize);
      parts.current = [];
      start.current = null;
    };
  }, [colors.join("|"), duration, onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        mixBlendMode: "screen",
      }}
    />
  );
}
