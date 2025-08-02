"use client";

import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";

export default function MainAppLayout({ children }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}