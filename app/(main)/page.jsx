"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "@/components/AdminDashboard";
import StandardUserDashboard from "@/components/StandardUserDashboard";
import NetworkAMCDashboard from "@/components/NetworkAMCDashboard";
import BiometricAMCDashboard from "@/components/BiometricAMCDashboard";
import TelecomDashboard from "@/components/TelecomDashboard"; // <-- 1. IMPORT TELECOM DASHBOARD
import ETLDashboard from "@/components/ETLDashboard"; // <-- 2. IMPORT ETL DASHBOARD
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

  // --- 3. UPDATED LOGIC TO RENDER SEPARATE DASHBOARDS ---
  const renderDashboardByRole = () => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.SYS_ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.NETWORK_AMC:
        return <NetworkAMCDashboard />; // Now separate
      case USER_ROLES.TELECOM_USER:
        return <TelecomDashboard />; // Now separate
      case USER_ROLES.ETL:
        return <ETLDashboard />; // Now separate
      case USER_ROLES.BIOMETRIC_AMC:
        return <BiometricAMCDashboard />;
      case USER_ROLES.STANDARD:
      default:
        return <StandardUserDashboard />;
    }
  };

  return renderDashboardByRole();
}
