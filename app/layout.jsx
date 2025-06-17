// File: app/layout.jsx
// This file now uses our new AppLayout to wrap every page.
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