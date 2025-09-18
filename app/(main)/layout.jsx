"use client";

import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { LoadingProvider } from "@/context/LoadingContext"; // 1. Import the provider

export default function MainAppLayout({ children }) {
  return (
    <AuthGuard>
      {/* 2. Wrap AppLayout with the LoadingProvider */}
      <LoadingProvider>
        <AppLayout>{children}</AppLayout>
      </LoadingProvider>
    </AuthGuard>
  );
}
