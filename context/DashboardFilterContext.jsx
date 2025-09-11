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
import { USER_ROLES } from "@/lib/constants"; // <-- IMPORT USER_ROLES

export const DashboardFilterContext = createContext();
const fetcher = (url) => fetch(url).then((res) => res.json());

const getCurrentShift = () => {
  const hour = DateTime.local().setZone("Asia/Kolkata").hour;
  if (hour >= 6 && hour < 14) return "A";
  if (hour >= 14 && hour < 22) return "B";
  return "C";
};

const createInitialState = (user) => {
  const now = DateTime.local().setZone("Asia/Kolkata");
  const today = { start: now.startOf("day"), end: now.endOf("day") };

  if (user?.role === "admin") {
    return { dateRange: today, shift: getCurrentShift() };
  }
  if (user?.role === "sys_admin") {
    return { dateRange: today, shift: "All" };
  }
  return { dateRange: { start: null, end: null }, shift: "All" };
};

// --- NEW HELPER FUNCTION TO GET THE CORRECT API ENDPOINT ---
const getApiEndpointForRole = (role) => {
  switch (role) {
    case USER_ROLES.TELECOM_USER:
      return "/api/incidents/telecom-dept";
    case USER_ROLES.ETL:
      return "/api/incidents/etl-dept";
    case USER_ROLES.NETWORK_VENDOR:
      return "/api/incidents/network-vendor";
    default:
      // Admins, Standard Users, etc., will use the general endpoint
      return "/api/incidents";
  }
};

export function DashboardFilterProvider({ children }) {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  const [filters, setFilters] = useState(() => createInitialState(user));

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

  // --- UPDATED SWR URL LOGIC ---
  const baseEndpoint = getApiEndpointForRole(user?.role);
  const SWR_URL =
    sessionStatus === "authenticated"
      ? `${baseEndpoint}?${buildQueryString()}`
      : null;

  const previousIncidentsRef = useRef(null);
  const playNotificationSound = useSound("/notification.mp3");
  const { showNotification } = useContext(NotificationContext);
  const { data, error, isLoading, mutate } = useSWR(SWR_URL, fetcher, {
    refreshInterval:
      user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
    revalidateOnFocus: !(user?.role === "admin" || user?.role === "sys_admin"),
    onSuccess: (data, key, config) => {
      // The data from the new endpoints is an array directly, not an object
      const currentIncidents = Array.isArray(data)
        ? data
        : data?.incidents || [];

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

      previousIncidentsRef.current = {
        key: SWR_URL,
        incidents: currentIncidents,
      };
    },
  });

  // Handle both possible data structures (object for general, array for specific)
  const incidents = Array.isArray(data) ? data : data?.incidents || [];

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
