import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    newPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    confirmNewPassword: z.string().min(6, "Ít nhất 6 ký tự"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type PasswordInput = z.infer<typeof passwordSchema>;
