"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";

export const DashboardFilterContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

// --- THIS IS THE CORRECTED LOGIC THAT WAS MISSING ---

// Helper to get the current shift based on Indian Standard Time
const getCurrentShift = () => {
  const hour = DateTime.local().setZone("Asia/Kolkata").hour;
  if (hour >= 6 && hour < 14) return "A";
  if (hour >= 14 && hour < 22) return "B";
  return "C";
};

// Creates a fresh, role-aware default state by accepting the user object
const createInitialState = (user) => {
  const now = DateTime.local().setZone("Asia/Kolkata");
  const today = { start: now.startOf("day"), end: now.endOf("day") };

  if (user?.role === "admin") {
    return { dateRange: today, shift: getCurrentShift() };
  }
  if (user?.role === "sys_admin") {
    return { dateRange: today, shift: "All" };
  }

  // The fallback for any other case (e.g., before login)
  return { dateRange: { start: null, end: null }, shift: "All" };
};
// --- END OF CORRECTED LOGIC ---

export function DashboardFilterProvider({ children }) {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  // Initialize state using the role-aware function
  const [filters, setFilters] = useState(() => createInitialState(user));

  // This effect resets the filters correctly when the user logs in or out
  useEffect(() => {
    if (
      sessionStatus === "authenticated" ||
      sessionStatus === "unauthenticated"
    ) {
      setFilters(createInitialState(user));
    }
  }, [user?.id, sessionStatus]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    params.append("limit", "0"); // Fetch all for dashboard

    if (filters.shift && filters.shift !== "All") {
      params.append("shift", filters.shift);
    }
    if (filters.dateRange?.start) {
      params.append("startDate", filters.dateRange.start.toISODate());
    }
    if (filters.dateRange?.end) {
      params.append("endDate", filters.dateRange.end.toISODate());
    }
    return params.toString();
  }, [filters]);

  const SWR_URL =
    sessionStatus === "authenticated"
      ? `/api/incidents?${buildQueryString()}`
      : null;

  const { data, error, isLoading, mutate } = useSWR(SWR_URL, fetcher, {
    revalidateOnFocus: false,
  });

  const incidents = data?.incidents || [];

  // This function will now work correctly because it uses the role-aware createInitialState
  const resetFilters = () => {
    setFilters(createInitialState(user));
  };

   const refetchIncidents = () => {
    mutate();
  };

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      incidents,
      isLoading,
      error,
      refetchIncidents,
    }),
    [filters, incidents, isLoading, error, resetFilters]
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}
