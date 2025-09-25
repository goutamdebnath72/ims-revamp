"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useSWR, { mutate } from "swr";
// MODIFICATION 1: Import usePathname
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
  return defaultCriteria;
};

export function SearchProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // MODIFICATION 2: Get the current page's pathname
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
    setHasSearched(false);
    setCriteria(createDefaultCriteria(user));
    setPage(1);
    router.push("/search", { scroll: false });
    if (lastSWRKeyRef.current) {
      mutate(lastSWRKeyRef.current, undefined, { revalidate: false });
    }
  }, [user, router]);

  useEffect(() => {
    // MODIFICATION 3: Wrap the entire useEffect logic in an if-statement.
    // This ensures it only runs on the search page.
    if (pathname === "/search") {
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
    }
  }, [pathname, searchParams, resetSearch]); // Added pathname to dependency array

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
