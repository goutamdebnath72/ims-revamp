"use client";

import React, { createContext, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { getCurrentShift } from "@/lib/date-helpers";

export const DashboardFilterContext = createContext(null);

export default function DashboardFilterProvider({ children }) {
  const { data: session } = useSession();
  const user = session?.user;

  const getDefaultState = useCallback(() => {
    const now = DateTime.now().setZone("Asia/Kolkata");
    const shift = (user?.role === "sys_admin") ? "All" : getCurrentShift();
    return {
      dateRange: { start: now, end: now },
      shift: shift,
    };
  }, [user]);

  const [filters, setFilters] = useState(getDefaultState());

  const resetFilters = useCallback(() => {
    setFilters(getDefaultState());
  }, [getDefaultState]);

  const value = { filters, setFilters, resetFilters };

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}