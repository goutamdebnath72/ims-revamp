// app/providers.jsx
"use client";

import AuthSessionProvider from "@/components/SessionProvider";
import NotificationProvider from "@/context/NotificationContext";
import SettingsProvider from "@/context/SettingsContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";

export function AppProviders({ children }) {
  return (
    <AuthSessionProvider>
      <NotificationProvider>
        <SettingsProvider>
            <DashboardFilterProvider>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                {children}
              </LocalizationProvider>
            </DashboardFilterProvider>
        </SettingsProvider>
      </NotificationProvider>
    </AuthSessionProvider>
  );
}
