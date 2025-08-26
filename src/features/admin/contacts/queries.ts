import useSWR from "swr";
import { getAllContacts } from "./api";
import type { Contact, ContactsList } from "./types";

export const CONTACTS_KEY = "/api/v1/contacts?page=1&size=1000";

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<ContactsList>(
    CONTACTS_KEY,
    getAllContacts
  );

  return {
    contacts: (data?.result ?? []) as Contact[],
    meta: data?.meta,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
