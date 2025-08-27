import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAboutContent, sendCtaClick } from "./api";
import type { AboutContent, CtaClickPayload } from "./types";

export const QK = {
  about: ["user", "about", "content"] as const,
};

export function useAboutContent() {
  return useQuery<AboutContent>({
    queryKey: QK.about,
    queryFn: fetchAboutContent,
    // Nội dung tĩnh -> cache dài
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useTrackCta() {
  return useMutation({
    mutationFn: (p: CtaClickPayload) => sendCtaClick(p),
  });
}
