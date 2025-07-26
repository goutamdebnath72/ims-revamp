"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { filterIncidents } from "@/lib/incident-helpers";
import { DateTime } from "luxon";
import {
  Box,
  Typography,
  Paper,
  Stack,
  useScrollTrigger,
  Alert,
} from "@mui/material";
import IncidentSearchForm from "@/components/IncidentSearchForm";
import IncidentDataGrid from "@/components/IncidentDataGrid";
import { IncidentContext } from "@/context/IncidentContext";
import { useSession } from "next-auth/react";

// Helper function to create a default criteria object with valid Luxon dates
const createDefaultCriteria = () => {
  const now = DateTime.now().setZone("Asia/Kolkata");
  return {
    incidentId: "",
    requestor: "",
    status: "Any",
    priority: "Any",
    incidentType: "Any",
    category: "Any",
    shift: "Any",
    department: "Any",
    dateRange: {
      start: now.startOf("day"),
      end: now.endOf("day"),
    },
  };
};

export default function SearchPage() {
  const { data: session } = useSession();
  const { incidents } = React.useContext(IncidentContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = session?.user;

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  // Initialize state using the new helper function for consistency
  const [criteria, setCriteria] = React.useState(createDefaultCriteria());

  const performSearch = React.useCallback(
    (searchCriteria) => {
      if (!user || !incidents || incidents.length === 0) return;
      setLoading(true);
      setHasSearched(true);
      setTimeout(() => {
        const filteredResults = filterIncidents(
          incidents,
          searchCriteria,
          user
        );
        const sortedResults = [...filteredResults].sort((a, b) => {
          const dateA = DateTime.fromFormat(a.reportedOn, "dd MMM yyyy HH:mm", {
            zone: "Asia/Kolkata",
          });
          const dateB = DateTime.fromFormat(b.reportedOn, "dd MMM yyyy HH:mm", {
            zone: "Asia/Kolkata",
          });
          return dateB - dateA;
        });
        setSearchResults(sortedResults);
        setLoading(false);
      }, 500);
    },
    [incidents, user]
  );

  React.useEffect(() => {
    // This entire effect is simplified and made more robust
    if (!user || incidents.length === 0) return;

    // Handle reset clicks
    if (searchParams.get("reset") === "true") {
      setCriteria(createDefaultCriteria()); // Resets to a valid default state
      setSearchResults([]);
      setHasSearched(false);
      router.replace("/search", { scroll: false });
      return;
    }

    const urlCategory = searchParams.get("category");
    const urlStatus = searchParams.get("status");
    const urlPriority = searchParams.get("priority");
    const urlShift = searchParams.get("shift");
    const urlStartDate = searchParams.get("startDate");
    const urlEndDate = searchParams.get("endDate");
    const urlIncidentType = searchParams.get("incidentType");

    // Only perform a search if at least one search parameter is in the URL
    if (
      urlCategory ||
      urlStatus ||
      urlPriority ||
      urlShift ||
      urlIncidentType
    ) {
      // Use the default date range as a fallback if none is provided in the URL
      const defaultDateRange = createDefaultCriteria().dateRange;

      const criteriaFromLink = {
        incidentId: "",
        requestor: "",
        incidentType: urlIncidentType || "Any",
        status: urlStatus || "Any",
        priority: urlPriority || "Any",
        shift: urlShift || "Any",
        department: "Any",
        category:
          urlCategory || (user.role === "sys_admin" ? "Any" : "general"),
        dateRange:
          urlStartDate && urlEndDate
            ? {
                start: DateTime.fromISO(urlStartDate),
                end: DateTime.fromISO(urlEndDate),
              }
            : defaultDateRange,
      };

      setCriteria(criteriaFromLink);
      performSearch(criteriaFromLink);
    }
  }, [user, incidents, searchParams, performSearch, router]);

  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const getHeading = () => {
    const category = searchParams.get("category");
    if (user?.role === "sys_admin" && category === "system")
      return "Search & Archive (SYS)";
    return "Search & Archive";
  };

  const getFilterContextText = () => {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const shiftParam = searchParams.get("shift");
    if (!startDateParam && !shiftParam) return null;
    let dateText = "";
    if (startDateParam && endDateParam) {
      const start = DateTime.fromISO(startDateParam);
      const end = DateTime.fromISO(endDateParam);
      if (start.toISODate() === end.toISODate()) {
        dateText = `Date: ${start.toFormat("d MMM, yyyy")}`;
      } else {
        dateText = `Date Range: ${start.toFormat("d MMM")} - ${end.toFormat(
          "d MMM, yyyy"
        )}`;
      }
    }
    const shiftText = shiftParam ? `Shift: ${shiftParam}` : "";
    return [dateText, shiftText].filter(Boolean).join("  |  ");
  };

  const filterContextText = getFilterContextText();

  return (
    <Stack
      spacing={2}
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={isScrolled ? 4 : 2}
        sx={{
          p: 2,
          position: "sticky",
          top: 64,
          zIndex: 10,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: "left" }}>
          {getHeading()}
        </Typography>
        <IncidentSearchForm
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onSearch={performSearch}
          isLoading={loading}
        />
      </Paper>

      {hasSearched && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "75vh",
          }}
        >
          {filterContextText && (
            <Alert severity="info" sx={{ mb: 2, flexShrink: 0 }}>
              Showing results based on dashboard selection — {filterContextText}
            </Alert>
          )}
          <Typography variant="h5" sx={{ mb: 2, flexShrink: 0 }}>
            Search Results
          </Typography>

          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <IncidentDataGrid rows={searchResults} loading={loading} />
          </Box>
        </Paper>
      )}
    </Stack>
  );
}
