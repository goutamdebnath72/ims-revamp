"use client";

import * as React from 'react';

// Import all your providers and the date adapter
import UserProvider from '@/context/UserContext';
import NotificationProvider from '@/context/NotificationContext';
import SettingsProvider from '@/context/SettingsContext';
import IncidentProvider from '@/context/IncidentContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function AppProviders({ children }) {
  return (
    // Wrap everything in the LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <UserProvider>
        <NotificationProvider>
          <SettingsProvider>
            <IncidentProvider>
              {children}
            </IncidentProvider>
          </SettingsProvider>
        </NotificationProvider>
      </UserProvider>
    </LocalizationProvider>
  );
}