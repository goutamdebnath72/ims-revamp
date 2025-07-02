import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import UserProvider from '@/context/UserContext';
import NotificationProvider from '@/context/NotificationContext';
import SettingsProvider from '@/context/SettingsContext';
import IncidentProvider from '@/context/IncidentContext';

export const metadata = {
  title: 'IMS Application',
  description: 'Incident Management System - DSP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeRegistry>
          <UserProvider>
            <NotificationProvider>
              <SettingsProvider>
                <IncidentProvider>
                  {children}
                </IncidentProvider>
              </SettingsProvider>
            </NotificationProvider>
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}