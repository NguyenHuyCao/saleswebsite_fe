"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Box, IconButton, Typography, Slide } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CloseIcon from "@mui/icons-material/Close";

export type ToastSeverity = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  severity: ToastSeverity;
  title?: string;
  visible: boolean;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, severity?: ToastSeverity, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

const CONFIG: Record<
  ToastSeverity,
  {
    icon: ReactNode;
    color: string;
    iconBg: string;
    titleDefault: string;
  }
> = {
  success: {
    icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
    color: "#4caf50",
    iconBg: "rgba(76,175,80,0.18)",
    titleDefault: "Thành công",
  },
  error: {
    icon: <ErrorIcon sx={{ fontSize: 20 }} />,
    color: "#f25c05",
    iconBg: "rgba(242,92,5,0.18)",
    titleDefault: "Lỗi",
  },
  info: {
    icon: <InfoIcon sx={{ fontSize: 20 }} />,
    color: "#ffb700",
    iconBg: "rgba(255,183,0,0.18)",
    titleDefault: "Thông báo",
  },
  warning: {
    icon: <WarningRoundedIcon sx={{ fontSize: 20 }} />,
    color: "#ff9800",
    iconBg: "rgba(255,152,0,0.18)",
    titleDefault: "Cảnh báo",
  },
};

const DURATION: Record<ToastSeverity, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
};

let _idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 320);
  }, []);

  const showToast = useCallback(
    (message: string, severity: ToastSeverity = "success", title?: string) => {
      const id = ++_idCounter;
      const duration = DURATION[severity];
      setToasts((prev) => {
        const next = [
          ...prev,
          { id, message, severity, title, visible: true, duration },
        ];
        return next.slice(-3);
      });
      timersRef.current[id] = setTimeout(() => {
        dismiss(id);
        delete timersRef.current[id];
      }, duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — bottom-right */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const cfg = CONFIG[toast.severity];
          return (
            <Slide
              key={toast.id}
              direction="left"
              in={toast.visible}
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 280, exit: 240 }}
            >
              <Box
                role="alert"
                sx={{
                  pointerEvents: "auto",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 320,
                  maxWidth: 420,
                  bgcolor: "#111",
                  borderRadius: "10px",
                  borderLeft: `4px solid ${cfg.color}`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05), 0 2px 8px ${cfg.color}22`,
                  px: 2,
                  pt: 1.6,
                  pb: 2.2,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Icon circle */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: cfg.iconBg,
                    color: cfg.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  {cfg.icon}
                </Box>

                {/* Text */}
                <Box sx={{ flex: 1, overflow: "hidden", pr: 1 }}>
                  <Typography
                    sx={{
                      color: cfg.color,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      mb: 0.4,
                      lineHeight: 1,
                    }}
                  >
                    {toast.title ?? cfg.titleDefault}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#d8d8d8",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {toast.message}
                  </Typography>
                </Box>

                {/* Close button */}
                <IconButton
                  size="small"
                  onClick={() => dismiss(toast.id)}
                  sx={{
                    color: "#555",
                    mt: -0.4,
                    mr: -0.5,
                    flexShrink: 0,
                    p: 0.5,
                    "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                    borderRadius: "6px",
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>

                {/* Progress bar */}
                <Box
                  sx={{
                    "@keyframes drainProgress": {
                      from: { width: "100%" },
                      to: { width: "0%" },
                    },
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: "100%",
                    bgcolor: `${cfg.color}33`,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                      bgcolor: cfg.color,
                      animation: `drainProgress ${toast.duration}ms linear forwards`,
                    },
                  }}
                />
              </Box>
            </Slide>
          );
        })}
      </Box>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
