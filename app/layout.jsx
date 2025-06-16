// File: app/layout.js (The ROOT layout)
import * as React from 'react';
import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'IMS Dashboard',
  description: 'Incident Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}