"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
import { Box, Button, Typography, Stack } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { INCIDENT_STATUS } from "@/lib/constants";

// Import the reusable GenericDashboard component
import GenericDashboard from "./GenericDashboard";

export default function StandardUserDashboard() {
  const { data: session } = useSession();
  const { incidents } = React.useContext(DashboardFilterContext);
  const user = session?.user;

  const myIncidents = React.useMemo(() => {
    if (!user || !incidents) return [];
    return incidents.filter((i) => i.requestor?.ticketNo === user.ticketNo);
  }, [user, incidents]);

  // --- START: PREPARE PROPS FOR GENERIC DASHBOARD ---
  const statCards = [
    {
      title: "Your Open Incidents",
      value: myIncidents.filter(
        (i) =>
          i.status === INCIDENT_STATUS.NEW ||
          i.status === INCIDENT_STATUS.PROCESSED ||
          i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION ||
          i.status === INCIDENT_STATUS.PENDING_ETL
      ).length,
      color: "secondary",
      filterStatus: "open",
    },
    {
      title: "Your Resolved",
      value: myIncidents.filter((i) => i.status === INCIDENT_STATUS.RESOLVED)
        .length,
      color: "success",
      filterStatus: "Resolved",
    },
    {
      title: "Your Closed",
      value: myIncidents.filter((i) => i.status === INCIDENT_STATUS.CLOSED)
        .length,
      color: "default",
      filterStatus: "Closed",
    },
  ];

  const chartLayoutConfig = {
    layout: "1_full", // As per description: "only one row --RA card--"
    recentIncidents: myIncidents,
  };
  // --- END: PREPARE PROPS ---

  if (!user) return null;

  return (
    <Stack spacing={2}>
      {/* --- HEADER --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Dashboard</Typography>
        <Button
          component={Link}
          href="/raise"
          variant="contained"
          startIcon={<PostAddIcon />}
        >
          Raise New Incident
        </Button>
      </Stack>

      {/* --- STATS & RECENT ACTIVITY --- */}
      {/* The old layout is replaced with a single call to the new component */}
      <GenericDashboard
        statCards={statCards}
        chartLayoutConfig={chartLayoutConfig}
      />
    </Stack>
  );
}
