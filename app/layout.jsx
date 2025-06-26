// File: app/layout.jsx
// UPDATED: Wrapped the application in the new UserProvider.
import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import AppLayout from '@/components/AppLayout';
import UserProvider from '@/context/UserContext'; // <-- Import the new provider

export const metadata = {
  title: 'IMS Dashboard',
  description: 'Incident Management System - DSP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1e1e" />
      </head>
      <body>
        <ThemeRegistry>
          {/* The UserProvider now wraps AppLayout, making user data available everywhere */}
          <UserProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}