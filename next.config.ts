import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: "standalone",
  devIndicators: false,
  // swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    domains: ["res.cloudinary.com", "img.icons8.com"], // Cho phép load ảnh từ Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Cho phép tất cả ảnh trong Cloudinary
      },
    ],
  },
  // images: {
  //   domains: ["localhost"],
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "8000",
  //       pathname: "/images/**",
  //     },
  //   ],
  // },
};

export default nextConfig;
