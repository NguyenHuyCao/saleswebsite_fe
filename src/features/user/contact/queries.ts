"use client";

import { useMutation } from "@tanstack/react-query";
import { sendContact } from "./api";
import type { ContactPayload, ContactResult } from "./types";

export function useSendContact() {
  return useMutation<ContactResult, Error, ContactPayload>({
    mutationFn: sendContact,
  });
}
