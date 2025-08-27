import { api } from "@/lib/api/http";
import type {
  ShippingPartner,
  CreateShippingPartner,
  UpdateShippingPartner,
} from "./types";

/** GET /shipping_partners → ShippingPartner[] */
export async function listPartners(): Promise<ShippingPartner[]> {
  return api.get<ShippingPartner[]>("/api/v1/shipping_partners");
}

/** POST /shipping_partners */
export async function createPartner(
  payload: CreateShippingPartner
): Promise<ShippingPartner> {
  return api.post<ShippingPartner, CreateShippingPartner>(
    "/api/v1/shipping_partners",
    payload
  );
}

/** PUT /shipping_partners/:id */
export async function updatePartner(
  id: number,
  payload: UpdateShippingPartner
): Promise<ShippingPartner> {
  return api.put<ShippingPartner, UpdateShippingPartner>(
    `/api/v1/shipping_partners/${id}`,
    payload
  );
}
