"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "@/components/AdminDashboard";
import StandardUserDashboard from "@/components/StandardUserDashboard";
import NetworkVendorDashboard from "@/components/NetworkVendorDashboard"; // <-- 1. IMPORT THE NEW DASHBOARD
import BiometricVendorDashboard from "@/components/BiometricVendorDashboard"; // <-- 1. IMPORT THE NEW DASHBOARD
import { Box, CircularProgress } from "@mui/material";
import { USER_ROLES } from "@/lib/constants";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Show a loading spinner while the session is being verified
  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if the user is not authenticated
  if (status === "unauthenticated") {
    // This check prevents errors during server-side rendering
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const role = session?.user?.role;

  // --- 2. ADD LOGIC TO RENDER THE CORRECT DASHBOARD BASED ON ROLE ---
  const renderDashboardByRole = () => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.SYS_ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.NETWORK_VENDOR:
      case USER_ROLES.TELECOM:
      case USER_ROLES.ETL:
        return <NetworkVendorDashboard />;
      case "biometric_vendor":
        return <BiometricVendorDashboard />;
      case "standard":
      default:
        return <StandardUserDashboard />;
    }
  };

  return renderDashboardByRole();
}
