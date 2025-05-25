// app/admin/layout.tsx
"use client";
import "@/styles/app.css";

import UserLayout from "@/layouts/UserLayout";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // <Container maxWidth="xl" sx={{ padding: 0, height: "100vh" }}>
    <UserLayout>{children}</UserLayout>
    // </Container>
  );
}
