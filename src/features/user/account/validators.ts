// features/user/account/validators.ts
import { z } from "zod";

export const userInfoSchema = z.object({
  username: z.string().min(2, "Tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "SĐT không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  gender: z.enum(["Nam", "Nữ", "Khác"]).optional().or(z.literal("")),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    newPassword: z.string().min(6, "Ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Ít nhất 6 ký tự"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });


export type UserInfoInput = z.infer<typeof userInfoSchema>;
