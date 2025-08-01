import * as React from "react";
import ThemeRegistry from "./ThemeRegistry";
import { AppProviders } from "./providers";
import AuthSessionProvider from "@/components/SessionProvider";

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
          background: "linear-gradient(to top, #eef2f3, #ffffff)",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <ThemeRegistry>
          <AuthSessionProvider>
            <AppProviders>{children}</AppProviders>
          </AuthSessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
