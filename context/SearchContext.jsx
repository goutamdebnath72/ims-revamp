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
import { DEFAULT_PAGE_SIZE } from "@/lib/constants"; // <-- 1. Import the new constant

export const SearchContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

const createDefaultCriteria = () => {
  return {
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
};

export function SearchProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // <-- 2. Create state for page size
  const [criteria, setCriteria] = useState(createDefaultCriteria());
  const [hasSearched, setHasSearched] = useState(false);

  // This new block ensures the API URL is always correct
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
    params.append("limit", pageSize.toString()); // <-- 3. Use the pageSize state here
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
    setCriteria(createDefaultCriteria());
    setHasSearched(false);
    setPage(1);
  }, []);

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
      ); // <-- 4. Sync pageSize with URL
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
      setPageSize, // <-- 5. Expose pageSize to the UI
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
