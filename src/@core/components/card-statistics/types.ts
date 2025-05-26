// ** React Imports
import { ReactNode } from "react";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

export type CardStatsVerticalProps = {
  title: string;
  stats: string;
  icon: ReactNode | React.ElementType;
  subtitle: string;
  color?: ThemeColor;
  trendNumber: string;
  trend?: "positive" | "negative";
};
