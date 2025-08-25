// warranty/types.ts
import { ReactNode } from "react";

export type WarrantyCard = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type WarrantyItem = {
  icon: ReactNode;
  title: string;
  content: string;
};
