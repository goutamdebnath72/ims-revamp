import * as React from "react";
import { Suspense } from "react";
import ThemeRegistry from "./ThemeRegistry";
import { AppProviders } from "./providers";
import { LoadingProvider } from "@/context/LoadingContext";
import './globals.css';

export const metadata = {
  title: "IMS Application",
  description: "Incident Management System - DSP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        style={{
          margin: 0,
          background: "#eef2f3",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <ThemeRegistry>
          <Suspense fallback={<div>Loading...</div>}>
            <AppProviders>
              <LoadingProvider>{children}</LoadingProvider>
            </AppProviders>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
