import { z } from "zod";

export const userInfoSchema = z.object({
  username: z.string().min(2, "Tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "SĐT không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  gender: z.enum(["Nam", "Nữ", "Khác"]).optional().or(z.literal("")),
});

export type UserInfoInput = z.infer<typeof userInfoSchema>;
