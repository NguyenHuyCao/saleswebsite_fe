import { Box } from "@mui/material";
import Image from "next/image";

export default function CategoryBanner() {
  return (
    <Box position="relative" height={300}>
      <Image
        src="/images/banner/banner-ab.jpg"
        alt="DeWALT Banner"
        fill
        style={{ objectFit: "cover", borderRadius: 8 }}
      />
    </Box>
  );
}
