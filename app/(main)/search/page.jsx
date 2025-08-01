"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { DateTime } from "luxon";
import {
  Box,
  Typography,
  Paper,
  Stack,
  useScrollTrigger,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IncidentSearchForm from "@/components/IncidentSearchForm";
import IncidentDataGrid from "@/components/IncidentDataGrid";
import { useSession } from "next-auth/react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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
    dateRange: {
      start: null,
      end: null,
    },
  };
};

export default function SearchPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = session?.user;

  console.log("%cSEARCH PAGE RENDERED", "color: green;");

  const [page, setPage] = React.useState(1);
  const [criteria, setCriteria] = React.useState(createDefaultCriteria());
  const [hasSearched, setHasSearched] = React.useState(false);

  // --- ADDED THESE 4 LINES ---
  const { data: typesData } = useSWR("/api/incident-types", fetcher);
  const { data: deptsData } = useSWR("/api/departments", fetcher);
  const incidentTypes = typesData?.incidentTypes || [];
  const departments = deptsData?.departments || [];
  // -------------------------

  // --- LOG #1: To see the value of 'hasSearched' on every render ---
  console.log("SEARCH PAGE RENDER: 'hasSearched' is currently", hasSearched);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", "20");

    Object.entries(criteria).forEach(([key, value]) => {
      if (key === "dateRange") {
        if (value.start) params.append("startDate", value.start.toISODate());
        if (value.end) params.append("endDate", value.end.toISODate());
      } else if (value && value !== "Any") {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const SWR_URL = hasSearched ? `/api/incidents?${buildQueryString()}` : null;

  // --- LOG #2: To see the final URL being passed to useSWR ---
  console.log("SEARCH PAGE RENDER: The URL for useSWR is:", SWR_URL);

  const { data, error, isLoading } = useSWR(SWR_URL, fetcher);

  const handleSearch = (newCriteria) => {
    setCriteria(newCriteria);
    setPage(1);
    setHasSearched(true);
  };

  React.useEffect(() => {
        console.log("%cuseEffect HOOK RUNNING", "color: orange; font-weight: bold;", "Current searchParams:", searchParams.toString());

        
    const urlParams = Object.fromEntries(searchParams.entries());
    if (Object.keys(urlParams).length > 0) {
      console.log(
        "useEffect found URL params, setting criteria and triggering a search."
      );
      setCriteria((prev) => ({
        ...prev,
        status: urlParams.status || "Any",
        category: urlParams.category || "Any",
        shift: urlParams.shift || "Any",
        dateRange: {
          start: urlParams.startDate
            ? DateTime.fromISO(urlParams.startDate)
            : null,
          end: urlParams.endDate ? DateTime.fromISO(urlParams.endDate) : null,
        },
      }));
      setHasSearched(true);
    } else {
      // This new 'else' block resets the page on direct navigation
      setCriteria(createDefaultCriteria());
      setHasSearched(false);
      setPage(1);
    }
  }, [searchParams]);

  const getHeading = () => {
    if (user?.role === "sys_admin" && criteria.category === "System")
      return "Search & Archive (SYS)";
    return "Search & Archive";
  };

  const getFilterContextText = () => {
    const startDateParam = searchParams.get("startDate");
    const shiftParam = searchParams.get("shift");
    if (!startDateParam && !shiftParam) return null;
    let dateText = "";
    if (startDateParam) {
      dateText = `Date Range: ${DateTime.fromISO(startDateParam).toFormat(
        "d MMM, yyyy"
      )}`;
    }
    const shiftText = shiftParam ? `Shift: ${shiftParam}` : "";
    return [dateText, shiftText].filter(Boolean).join(" | ");
  };
  const filterContextText = getFilterContextText();

  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Stack
      spacing={2}
      sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "grey.100" }}
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
          onSearch={handleSearch}
          isLoading={isLoading}
          incidentTypes={incidentTypes}
          departments={departments}
        />
      </Paper>

      {hasSearched && (
        <Paper
          elevation={2}
          sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}
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
            <IncidentDataGrid
              rows={data?.incidents || []}
              loading={isLoading}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              pt: 2,
              flexShrink: 0,
            }}
          >
            {data?.incidents && (
              <Typography variant="body2" sx={{ mr: "auto" }}>
                Showing{" "}
                <strong>
                  {(data.currentPage - 1) * 20 + 1}–
                  {(data.currentPage - 1) * 20 + data.incidents.length}
                </strong>{" "}
                of <strong>{data.totalIncidents}</strong>
              </Typography>
            )}
            <Typography variant="body2" sx={{ mr: 2 }}>
              Page {data?.currentPage || 0} of {data?.totalPages || 0}
            </Typography>
            <IconButton
              onClick={() => setPage(page - 1)}
              disabled={!data || data.currentPage <= 1}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={() => setPage(page + 1)}
              disabled={!data || data.currentPage >= data.totalPages}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Stack>
  );
}
