"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import AuthGuard from "@/components/AuthGuard";

// 1. We create a new internal component to hold the dynamic logic.
function MainContent({ children }) {
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  return <main key={key}>{children}</main>;
}

export default function MainAppLayout({ children }) {
  return (
    <AuthGuard>
      <AppLayout>
        {/* 2. We wrap our new dynamic component in a Suspense boundary. */}
        <Suspense fallback={<div>Loading...</div>}>
          <MainContent>{children}</MainContent>
        </Suspense>
      </AppLayout>
    </AuthGuard>
  );
}