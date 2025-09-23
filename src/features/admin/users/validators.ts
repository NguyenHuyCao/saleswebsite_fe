import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    newPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Ít nhất 6 ký tự"), // <-- dùng confirmPassword
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

// Xuất type trực tiếp từ schema để tránh lệch key
export type ChangePasswordInput = z.infer<typeof passwordSchema>;
