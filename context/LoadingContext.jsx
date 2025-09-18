"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
// 1. Import useSearchParams
import { usePathname, useSearchParams } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  // 2. Get the current search parameters
  const searchParams = useSearchParams();

  useEffect(() => {
    // This effect now listens for changes to the path OR the search parameters.
    setIsLoading(false);
  }, [pathname, searchParams]); // 3. Add searchParams to the dependency array

  const value = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 999,
          color: "#fff",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};
