"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // This effect listens for page changes and automatically turns the loader off.
    setIsNavigating(false);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </LoadingContext.Provider>
  );
};
