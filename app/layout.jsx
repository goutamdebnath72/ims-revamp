import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import AppLayout from '@/components/AppLayout';
import UserProvider from '@/context/UserContext';
// --- THIS LINE IS CORRECTED ---
import NotificationProvider from '@/context/NotificationContext'; // The file is NotificationContext.jsx
// --- END OF CORRECTION ---
import SettingsProvider from '@/context/SettingsContext';

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
          <UserProvider>
            <NotificationProvider>
              <SettingsProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </SettingsProvider>
            </NotificationProvider>
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}