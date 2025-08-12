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
    //params.append("limit", "0");

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

  // --- START: NEW NOTIFICATION LOGIC ---
  const previousIncidentsRef = useRef(null);
  const playNotificationSound = useSound("/notification.mp3");
  const { showNotification } = useContext(NotificationContext);

  const { data, error, isLoading, mutate } = useSWR(SWR_URL, fetcher, {
    refreshInterval:
      user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
    revalidateOnFocus: !(user?.role === "admin" || user?.role === "sys_admin"),
    onSuccess: (data, key, config) => {
      // key and config are available here
      const currentIncidents = data?.incidents || [];

      // The key is the URL. If the URL changes (due to a filter change),
      // we must reset our baseline and not send notifications.
      // We also check if the ref has been initialized yet.
      if (previousIncidentsRef.current === null || config.key !== SWR_URL) {
        previousIncidentsRef.current = {
          key: SWR_URL,
          incidents: currentIncidents,
        };
        return;
      }

      const previousIncidents = previousIncidentsRef.current.incidents;
      const previousIds = new Set(previousIncidents.map((i) => i.id));
      const newIncidents = currentIncidents.filter(
        (i) => !previousIds.has(i.id)
      );

      if (newIncidents.length > 0) {
        newIncidents.forEach((incident) => {
          if (incident.status !== "New") return;

          let shouldNotify = false;
          const isSysIncident = isSystemIncident(incident);

          if (user?.role === "admin" && !isSysIncident) {
            shouldNotify = true;
          } else if (user?.role === "sys_admin" && isSysIncident) {
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

      // Finally, update the baseline with the latest data and key for the next check.
      previousIncidentsRef.current = {
        key: SWR_URL,
        incidents: currentIncidents,
      };
    },
  });
  // --- END: NEW NOTIFICATION LOGIC ---

  const incidents = data?.incidents || [];

  // This function will now work correctly because it uses the role-aware createInitialState
  const resetFilters = useCallback(() => {
    setFilters(createInitialState(user));
  }, [user]);

  const refetchIncidents = useCallback(() => {
    mutate();
  }, [mutate]);

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
    [filters, incidents, isLoading, error, resetFilters, refetchIncidents]
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}
