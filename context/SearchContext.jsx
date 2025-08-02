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
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";

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
  const [criteria, setCriteria] = useState(createDefaultCriteria());
  const [hasSearched, setHasSearched] = useState(false);

  const { data, error, isLoading } = useSWR(
    hasSearched ? `/api/incidents?${searchParams.toString()}` : null,
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
    Object.entries(newCriteria).forEach(([key, value]) => {
      if (key === "dateRange") {
        if (value.start) params.append("startDate", value.start.toISODate());
        if (value.end) params.append("endDate", value.end.toISODate());
      } else if (value && value !== "Any") {
        params.append(key, value);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  const resetSearch = () => {
    setCriteria(createDefaultCriteria());
    setHasSearched(false);
    setPage(1);
  };

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
      setHasSearched(true);
    } else {
      resetSearch();
    }
  }, [searchParams]);

  const value = useMemo(
    () => ({
      criteria,
      setCriteria,
      hasSearched,
      page,
      incidentData: data,
      isLoading,
      error,
      handleSearch,
      handlePageChange,
      resetSearch,
    }),
    [criteria, hasSearched, page, data, isLoading, error]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
