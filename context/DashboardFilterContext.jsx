"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import useSound from "@/hooks/useSound";
import { NotificationContext } from "@/context/NotificationContext";
import { isSystemIncident } from "@/lib/incident-helpers";

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
    params.append("limit", "0");

    if (filters.shift && filters.shift !== "All") {
      params.append("shift", filters.shift);
    }
    if (filters.dateRange?.start) {
      params.append("startDate", filters.dateRange.start.toISO());
    }
    if (filters.dateRange?.end) {
      params.append("endDate", filters.dateRange.end.toISO());
    }
    return params.toString();
  }, [filters]);

  const SWR_URL =
    sessionStatus === "authenticated"
      ? `/api/incidents?${buildQueryString()}`
      : null;

  const { data, error, isLoading, mutate } = useSWR(SWR_URL, fetcher, {
    refreshInterval:
      user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
    revalidateOnFocus: !(user?.role === "admin" || user?.role === "sys_admin"),
  });

  const incidents = data?.incidents || [];

  // 1. Set up the sound player and notification handler
  const playNotificationSound = useSound("/notification.mp3");
  const { showNotification } = useContext(NotificationContext);

  // 2. Create a ref to store the list of incidents from the previous fetch
  const previousIncidentsRef = useRef([]);

  // 3. This useEffect runs every time the incident list is updated by the poll
  useEffect(() => {
    // Don't run on the very first load or if the data is still loading
    if (previousIncidentsRef.current.length === 0 || isLoading) {
      previousIncidentsRef.current = incidents;
      return;
    }

    // Find any incidents that are in the new list but not in the old one
    const previousIds = new Set(previousIncidentsRef.current.map((i) => i.id));
    const newIncidents = incidents.filter((i) => !previousIds.has(i.id));

    if (newIncidents.length > 0) {
      // If new incidents are found, loop through them
      newIncidents.forEach((incident) => {
        let shouldNotify = false;

        // Condition for admin: notify for any new incident
        if (user?.role === "admin") {
          shouldNotify = true;
        }
        // Condition for sys_admin: notify only for system incidents
        else if (user?.role === "sys_admin" && isSystemIncident(incident)) {
          shouldNotify = true;
        }

        if (shouldNotify) {
          playNotificationSound();
          showNotification(
            {
              title: `New Incident Raised: ${incident.id}`,
              message: `Type: ${incident.incidentType.name}`,
            },
            "info"
          );
        }
      });
    }

    // 4. Finally, update the ref with the latest incident list for the next check
    previousIncidentsRef.current = incidents;
  }, [incidents, isLoading, user, playNotificationSound, showNotification]);

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
