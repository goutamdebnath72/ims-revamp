"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useSWR, { mutate } from "swr"; // ✅ Ensure 'mutate' is imported
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

// ✅ Standardized to lowercase for the canonical state
const createDefaultCriteria = (user) => {
  const defaultCriteria = {
    incidentId: "",
    requestor: "",
    status: "any",
    priority: "any",
    incidentType: "any",
    category: "any",
    shift: "any",
    department: "any",
    dateRange: { start: null, end: null },
  };
  return defaultCriteria;
};

export function SearchProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [criteria, setCriteria] = useState(createDefaultCriteria(user));
  const [hasSearched, setHasSearched] = useState(false);
  const lastSWRKeyRef = useRef(null);

  const apiParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", params.get("limit") || pageSize.toString());
    return params.toString();
  }, [searchParams, pageSize]);

  const swrKey = hasSearched ? `/api/incidents?${apiParams}` : null;
  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    refreshInterval:
      hasSearched && (user?.role === "admin" || user?.role === "sys_admin")
        ? 15000
        : 0,
    revalidateOnFocus:
      hasSearched && !(user?.role === "admin" || user?.role === "sys_admin"),
  });

  useEffect(() => {
    if (swrKey) {
      lastSWRKeyRef.current = swrKey;
    }
  }, [swrKey]);

  const handleSearch = (newCriteria) => {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", pageSize.toString());

    Object.entries(newCriteria).forEach(([key, value]) => {
      if (key === "dateRange") {
        if (value.start) params.append("startDate", value.start.toISO());
        if (value.end) params.append("endDate", value.end.toISO());
      } else if (value && value.toLowerCase() !== "any") {
        // Use toLowerCase() for comparison
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
    setHasSearched(false);
    setCriteria(createDefaultCriteria(user));
    setPage(1);
    router.push("/search", { scroll: false });
    if (lastSWRKeyRef.current) {
      mutate(lastSWRKeyRef.current, undefined, { revalidate: false });
    }
  }, [user, router]);

  // ✅ ADDED THIS REFRESH FUNCTION
  const refreshSearch = useCallback(() => {
    if (lastSWRKeyRef.current) {
      // Manually trigger a revalidation (fetch) of the current data
      mutate(lastSWRKeyRef.current);
    }
  }, []); // No dependencies needed, it uses the ref's current value

  useEffect(() => {
    if (pathname === "/search") {
      const urlParams = Object.fromEntries(searchParams.entries());

      if (Object.keys(urlParams).length > 0) {
        // ✅ All incoming values are normalized to lowercase for state consistency
        const newCriteria = {
          ...createDefaultCriteria(user),
          incidentId: urlParams.incidentId || "",
          requestor: urlParams.requestor || "",
          status: urlParams.status?.toLowerCase() || "any",
          priority: urlParams.priority?.toLowerCase() || "any",
          incidentType: urlParams.incidentType?.toLowerCase() || "any",
          category: urlParams.category?.toLowerCase() || "any",
          shift: urlParams.shift?.toLowerCase() || "any",
          department: urlParams.department || "any", // Department names have their own casing
          dateRange: {
            start: urlParams.startDate
              ? DateTime.fromISO(urlParams.startDate)
              : null,
            end: urlParams.endDate ? DateTime.fromISO(urlParams.endDate) : null,
          },
        };
        setCriteria(newCriteria);
        setPage(urlParams.page ? parseInt(urlParams.page, 10) : 1);
        setPageSize(
          urlParams.limit ? parseInt(urlParams.limit, 10) : DEFAULT_PAGE_SIZE
        );
        setHasSearched(true);
      } else {
        resetSearch();
      }
    }
  }, [pathname, searchParams, resetSearch, user]);

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
      refreshSearch, // ✅ EXPORT THE NEW FUNCTION
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
      refreshSearch, // ✅ ADDED TO DEPENDENCY ARRAY
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
