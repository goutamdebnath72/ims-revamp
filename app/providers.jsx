// app/providers.jsx
"use client";

import AuthSessionProvider from "@/components/SessionProvider";
import NotificationProvider from "@/context/NotificationContext";
import SettingsProvider from "@/context/SettingsContext";
import { LoadingProvider } from "@/context/LoadingContext"; // <-- 1. IMPORTED
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";
import { SearchProvider } from "@/context/SearchContext";

export function AppProviders({ children }) {
  return (
    <AuthSessionProvider>
      <NotificationProvider>
        <SettingsProvider>
          <LoadingProvider>
            {" "}
            {/* <-- 2. WRAPPED around the other providers */}
            <DashboardFilterProvider>
              <SearchProvider>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  {children}
                </LocalizationProvider>
              </SearchProvider>
            </DashboardFilterProvider>
          </LoadingProvider>
        </SettingsProvider>
      </NotificationProvider>
    </AuthSessionProvider>
  );
}
