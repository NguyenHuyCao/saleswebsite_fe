"use client";

import { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography, Alert, Button, Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@/lib/api/token";
import { QK } from "@/lib/api/cacheKeys";

/**
 * Page này nhận token từ BE sau khi OAuth2 thành công:
 *   /oauth2/callback?token=xxx&next=/
 *
 * BE redirect: FE_URL + "/oauth2/callback?token={jwt}&next={originalPath}"
 * Nếu profile chưa đầy đủ (thiếu phone): BE redirect tới /profile-complete
 */
export default function OAuth2CallbackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const called = useRef(false);

  const token = searchParams.get("token");
  const next = searchParams.get("next") || "/";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (errorParam) return; // let render show error UI

    if (!token) return;

    // Lưu token, invalidate cache user để re-fetch
    setAccessToken(token);
    window.dispatchEvent(new Event("login"));
    qc.invalidateQueries({ queryKey: QK.me }).then(() => {
      // Lấy user từ cache sau khi refetch để lưu localStorage
      const user = qc.getQueryData(QK.me);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      // Đảm bảo next là relative path (tránh open redirect)
      const safePath = next.startsWith("/") ? next : "/";
      router.replace(safePath);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (errorParam) {
    const messages: Record<string, string> = {
      oauth_failed: "Đăng nhập mạng xã hội thất bại. Vui lòng thử lại.",
      email_exists: "Email này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng email và mật khẩu.",
      access_denied: "Bạn đã từ chối cấp quyền. Vui lòng thử lại nếu muốn đăng nhập.",
    };

    return (
      <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
          {messages[errorParam] ?? "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại."}
        </Alert>
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/login")}
            sx={{
              bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
              textTransform: "none", py: 1.5, borderRadius: 2,
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            Quay lại đăng nhập
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 8 }}>
        <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }}>
          Không tìm thấy thông tin xác thực. Vui lòng thử đăng nhập lại.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push("/login")}
          sx={{
            bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
            textTransform: "none", py: 1.5, borderRadius: 2,
            "&:hover": { bgcolor: "#e64a19" },
          }}
        >
          Đăng nhập
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "40vh", gap: 2,
      }}
    >
      <CircularProgress sx={{ color: "#f25c05" }} />
      <Typography variant="body2" color="text.secondary">
        Đang xử lý đăng nhập...
      </Typography>
    </Box>
  );
}
