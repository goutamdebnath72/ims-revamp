// File: app/layout.jsx
// UPDATED: Added meta tags to control the browser theme-color.
import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import AppLayout from '@/components/AppLayout'; // Import our new layout

export const metadata = {
  title: 'IMS Dashboard',
  description: 'Incident Management System - DSP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* These tags override the theme color for browsers like Safari */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1e1e" />
      </head>
      <body>
        <ThemeRegistry>
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}