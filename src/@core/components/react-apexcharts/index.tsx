// src/@core/components/react-apexcharts/index.tsx
"use client";
import dynamic from "next/dynamic";
const ReactApexcharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
export default ReactApexcharts;
