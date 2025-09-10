"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import useSWR from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import {
  DEFAULT_PAGE_SIZE,
  USER_ROLES,
  INCIDENT_TYPES,
  INCIDENT_STATUS,
} from "@/lib/constants";

export const SearchContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

const createDefaultCriteria = (user) => {
  const defaultCriteria = {
    incidentId: "",
    requestor: "",
    status: "Any",
    priority: "Any",
    incidentType: "Any",
    category: "Any",
    shift: "Any",
    department: "Any",
    dateRange: { start: null, end: null },
  };

  if (user) {
    switch (user.role) {
      case USER_ROLES.TELECOM_USER:
        defaultCriteria.incidentType = INCIDENT_TYPES.NETWORK;
        defaultCriteria.status = [
          INCIDENT_STATUS.PENDING_TELECOM_ACTION,
          INCIDENT_STATUS.RESOLVED,
          INCIDENT_STATUS.CLOSED,
        ].join(",");
        break;
      case USER_ROLES.ETL:
        defaultCriteria.incidentType = INCIDENT_TYPES.PC_PERIPHERALS;
        defaultCriteria.status = [
          INCIDENT_STATUS.PENDING_ETL,
          INCIDENT_STATUS.RESOLVED,
          INCIDENT_STATUS.CLOSED,
        ].join(",");
        break;
      case USER_ROLES.NETWORK_VENDOR:
        defaultCriteria.incidentType = INCIDENT_TYPES.NETWORK;
        defaultCriteria.status = [
          INCIDENT_STATUS.PROCESSED,
          INCIDENT_STATUS.PENDING_TELECOM_ACTION,
          INCIDENT_STATUS.RESOLVED,
          INCIDENT_STATUS.CLOSED,
        ].join(",");
        break;
      case USER_ROLES.BIOMETRIC_VENDOR:
        defaultCriteria.incidentType = "Biometric";
        defaultCriteria.status = [
          INCIDENT_STATUS.PROCESSED,
          INCIDENT_STATUS.RESOLVED,
          INCIDENT_STATUS.CLOSED,
        ].join(",");
        break;
      default:
        break;
    }
  }

  return defaultCriteria;
};

export function SearchProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [criteria, setCriteria] = useState(createDefaultCriteria(user));
  const [hasSearched, setHasSearched] = useState(false);

  const apiParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", params.get("limit") || pageSize.toString());
    return params.toString();
  }, [searchParams, pageSize]);

  const { data, error, isLoading } = useSWR(
    hasSearched ? `/api/incidents?${apiParams}` : null,
    fetcher,
    {
      refreshInterval:
        user?.role === "admin" || user?.role === "sys_admin" ? 15000 : 0,
      revalidateOnFocus: !(
        user?.role === "admin" || user?.role === "sys_admin"
      ),
    }
  );

  const handleSearch = (newCriteria) => {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", pageSize.toString());
    Object.entries(newCriteria).forEach(([key, value]) => {
      if (key === "dateRange") {
        if (value.start) params.append("startDate", value.start.toISO());
        if (value.end) params.append("endDate", value.end.toISO());
      } else if (value && value !== "Any") {
        params.append(key, value);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = useCallback(
    (newPage) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/search?${params.toString()}`);
    },
    [searchParams, router]
  );

  const resetSearch = useCallback(() => {
    setCriteria(createDefaultCriteria(user));
    setHasSearched(false);
    setPage(1);
  }, [user]);

  useEffect(() => {
    const urlParams = Object.fromEntries(searchParams.entries());
    if (Object.keys(urlParams).length > 0) {
      setCriteria({
        incidentId: urlParams.incidentId || "",
        requestor: urlParams.requestor || "",
        status: urlParams.status || "Any",
        priority: urlParams.priority || "Any",
        incidentType: urlParams.incidentType || "Any",
        category: urlParams.category || "Any",
        shift: urlParams.shift || "Any",
        department: urlParams.department || "Any",
        dateRange: {
          start: urlParams.startDate
            ? DateTime.fromISO(urlParams.startDate)
            : null,
          end: urlParams.endDate ? DateTime.fromISO(urlParams.endDate) : null,
        },
      });
      setPage(urlParams.page ? parseInt(urlParams.page, 10) : 1);
      setPageSize(
        urlParams.limit ? parseInt(urlParams.limit, 10) : DEFAULT_PAGE_SIZE
      );
      setHasSearched(true);
    } else {
      resetSearch();
    }
  }, [searchParams, resetSearch]);

  const value = useMemo(
    () => ({
      criteria,
      setCriteria,
      hasSearched,
      page,
      incidentData: data,
      isLoading,
      error,
      user,
      handleSearch,
      handlePageChange,
      resetSearch,
      pageSize,
      setPageSize,
    }),
    [
      criteria,
      hasSearched,
      page,
      data,
      isLoading,
      error,
      user,
      handleSearch,
      handlePageChange,
      resetSearch,
      pageSize,
    ]
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
