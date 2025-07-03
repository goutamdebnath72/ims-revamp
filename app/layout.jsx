import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';
import { AppProviders } from './providers'; // <-- Import your new provider wrapper

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
          <AppProviders>
            {children}
          </AppProviders>
        </ThemeRegistry>
      </body>
    </html>
  );
}