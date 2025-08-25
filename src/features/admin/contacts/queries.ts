import useSWR from "swr";
import { fetchContactsAll } from "./api";
import type { Contact } from "./types";

export const CONTACTS_KEY = "/admin/contacts/all";

/** Hook SWR lấy danh sách liên hệ */
export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR(
    CONTACTS_KEY,
    fetchContactsAll
  );

  return {
    contacts: (data?.data?.result ?? []) as Contact[],
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
