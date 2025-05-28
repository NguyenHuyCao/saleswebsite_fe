"use client";

import Image from "next/image";
import { Box, Zoom, useScrollTrigger, Tooltip } from "@mui/material";

const FloatingContactButtons = () => {
  const trigger = useScrollTrigger({ threshold: 0 });

  return (
    <Zoom in={trigger}>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 9999,
        }}
      >
        {/* Nút Messenger */}
        <Tooltip title="Chat Facebook" placement="right">
          <a
            href="https://www.facebook.com/trai.xomdum/" // Thay link Messenger thật tại đây
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/icons/messenger.png"
              alt="Messenger"
              width={50}
              height={50}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </a>
        </Tooltip>

        {/* Nút Zalo */}
        <Tooltip title="Chat Zalo" placement="right">
          <a
            href="https://zalo.me/0367164126" // Thay số Zalo thật tại đây
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/icons/zalo.png"
              alt="Zalo"
              width={50}
              height={50}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </a>
        </Tooltip>

        {/* Nút Cuộc Gọi */}
        <Tooltip title="Gọi điện thoại" placement="right">
          <a href="tel:0123456789">
            <Image
              src="/images/icons/phone-call.png"
              alt="Gọi ngay"
              width={50}
              height={50}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </a>
        </Tooltip>

        {/* Nút ALO (ảnh tùy chỉnh khác) */}
        {/* <Tooltip title="Alo hỗ trợ" placement="right">
          <a href="tel:0987654321">
            <Image
              src="/images/icons/alo.png"
              alt="Alo Hỗ trợ"
              width={50}
              height={50}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </a>
        </Tooltip> */}
      </Box>
    </Zoom>
  );
};

export default FloatingContactButtons;
