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
import { useLoading } from "@/context/LoadingContext"; // 1. Import the global loading hook
import { isSystemIncident } from "@/lib/incident-helpers";
import { USER_ROLES } from "@/lib/constants";

export const DashboardFilterContext = createContext();
const fetcher = (url) => fetch(url).then((res) => res.json());

// ... (getCurrentShift, createInitialState, getApiEndpointForRole functions are unchanged) ...
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
    return { dateRange: today, shift: "All", category: "general" };
  }
  return {
    dateRange: { start: null, end: null },
    shift: "All",
    category: "general",
  };
};

const getApiEndpointForRole = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
    case USER_ROLES.SYS_ADMIN:
      return "/api/incidents/admin-dashboard";
    case USER_ROLES.TELECOM_USER:
      return "/api/incidents/telecom-dept";
    case USER_ROLES.ETL:
      return "/api/incidents/etl-dept";
    case USER_ROLES.NETWORK_VENDOR:
      return "/api/incidents/network-vendor";
    default:
      return "/api/incidents";
  }
};

export function DashboardFilterProvider({ children }) {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;
  const [filters, setFilters] = useState(() => createInitialState(user));
  const { setIsLoading } = useLoading(); // 2. Get the global setIsLoading function

  const lastUserId = useRef(user?.id);

  const resetFilters = useCallback(() => {
    setFilters(createInitialState(user));
  }, [user]);

  useEffect(() => {
    if (user?.id !== lastUserId.current) {
      setFilters(createInitialState(user));
      lastUserId.current = user?.id;
    }
  }, [user, sessionStatus]);

  const buildQueryString = useCallback(() => {
    // ... (this function is unchanged)
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
    if (filters.category) {
      params.append("category", filters.category);
    }
    return params.toString();
  }, [filters]);

  const baseEndpoint = getApiEndpointForRole(user?.role);
  const SWR_URL =
    sessionStatus === "authenticated"
      ? `${baseEndpoint}?${buildQueryString()}`
      : null;

  const previousIncidentsRef = useRef(null);
  const playNotificationSound = useSound("/notification.mp3");
  const { showNotification } = useContext(NotificationContext);

  const { data, error, isLoading, mutate } = useSWR(SWR_URL, fetcher, {
    // ... (SWR options including onSuccess are unchanged) ...
    refreshInterval:
      user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
    revalidateOnFocus: !(user?.role === "admin" || user?.role === "sys_admin"),
    onSuccess: (data, key, config) => {
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
          if (user?.role === "admin" && !isSysIncident) shouldNotify = true;
          else if (user?.role === "sys_admin" && isSysIncident)
            shouldNotify = true;
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

  // 3. This effect syncs the local SWR loading state with our global overlay
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const incidents = Array.isArray(data) ? data : data?.incidents || [];

  const refetchIncidents = useCallback(() => {
    mutate();
  }, [mutate]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      incidents,
      // We no longer need to pass SWR's isLoading state to consumers
      isLoading: false,
      error,
      refetchIncidents,
    }),
    [filters, setFilters, resetFilters, incidents, error, refetchIncidents]
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}
