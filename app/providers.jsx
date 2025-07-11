// app/providers.jsx
'use client';

import AuthSessionProvider from '@/components/SessionProvider';
import NotificationProvider from '@/context/NotificationContext';
import SettingsProvider from '@/context/SettingsContext';
import IncidentProvider from '@/context/IncidentContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function AppProviders({ children }) {
  return (
    <AuthSessionProvider>
      <NotificationProvider>
        <SettingsProvider>
          <IncidentProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {children}
            </LocalizationProvider>
          </IncidentProvider>
        </SettingsProvider>
      </NotificationProvider>
    </AuthSessionProvider>
  );
}