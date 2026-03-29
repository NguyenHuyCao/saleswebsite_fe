import useSWR from "swr";
import { getAllContacts, updateContactStatus, deleteContact } from "./api";
import type { Contact, ContactsList, ContactStatus } from "./types";

export const CONTACTS_KEY = "/api/v1/contacts?page=1&size=1000";

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<ContactsList>(
    CONTACTS_KEY,
    getAllContacts,
    { revalidateOnFocus: false }
  );

  const contacts = (data?.result ?? []) as Contact[];

  const patchStatus = async (id: number, status: ContactStatus): Promise<void> => {
    const snapshot = data;
    // optimistic
    const optimistic = contacts.map((c) => (c.id === id ? { ...c, status } : c));
    mutate({ result: optimistic, meta: data?.meta }, false);
    try {
      await updateContactStatus(id, status);
    } catch (err) {
      // rollback
      mutate(snapshot, false);
      throw err;
    } finally {
      mutate(); // sync with server
    }
  };

  const remove = async (id: number): Promise<void> => {
    const snapshot = data;
    // optimistic
    const optimistic = contacts.filter((c) => c.id !== id);
    mutate({ result: optimistic, meta: data?.meta }, false);
    try {
      await deleteContact(id);
    } catch (err) {
      // rollback
      mutate(snapshot, false);
      throw err;
    } finally {
      mutate(); // sync with server
    }
  };

  return {
    contacts,
    meta: data?.meta,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
    patchStatus,
    remove,
  };
}
