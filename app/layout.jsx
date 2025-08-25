import * as React from "react";
import { Suspense } from "react";
import ThemeRegistry from "./ThemeRegistry";
import { AppProviders } from "./providers";
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
          {/*
              2. WRAP YOUR APP PROVIDERS IN SUSPENSE
              This is the fix for the build error.
            */}
          <Suspense fallback={<div>Loading...</div>}>
            <AppProviders>{children}</AppProviders>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
