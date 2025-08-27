// questions/api.ts
"use client";

import type { ContactPayload } from "./types";
import { http } from "@/lib/api/http"; // dùng instance đã cấu hình header/Authorization
import type { AxiosResponse } from "axios";
import type { ApiEnvelope } from "@/lib/api/http";

/**
 * Client-side helper gửi form liên hệ.
 * Trả về true khi tạo thành công (201).
 */
export async function createContact(payload: ContactPayload): Promise<boolean> {
  try {
    // Dùng URL tương đối để ăn baseURL từ http.ts
    const res: AxiosResponse<ApiEnvelope<any>> = await http.post(
      "/api/v1/contacts",
      {
        ...payload,
        subject: payload.subject ?? "Giải đáp thắc mắc",
      }
    );

    // Một số BE trả status trong body, một số dựa vào HTTP code
    const bodyStatus = res.data?.status;
    const httpStatus = res.status;

    return bodyStatus === 201 || httpStatus === 201 || httpStatus === 200;
  } catch {
    return false;
  }
}
