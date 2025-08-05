"use client";

import React, { useContext } from "react";
import { SearchContext } from "@/context/SearchContext";
import {
  Box,
  Typography,
  Paper,
  Stack,  
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IncidentSearchForm from "@/components/IncidentSearchForm";
import IncidentDataGrid from "@/components/IncidentDataGrid";
import { DateTime } from "luxon";
import useSWR from "swr"; // Keep swr for dropdown data

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SearchPage() {
  // Get all state and functions from the new context
  const {
    criteria,
    hasSearched,
    page,
    incidentData,
    isLoading,
    handleSearch,
    handlePageChange,
    setCriteria,
    user, // ADDING THIS
  } = useContext(SearchContext);

  // Fetch dropdown data locally in the page component
  const { data: incidentTypesData } = useSWR("/api/incident-types", fetcher);
  const { data: departmentsData } = useSWR("/api/departments", fetcher);
  const incidentTypes = incidentTypesData || [];
  const departments = departmentsData || [];

  const getHeading = () => {
    if (user?.role === "sys_admin" && criteria.category?.toLowerCase() === "system")
      return "Search & Archive (SYS)";
    return "Search & Archive";
  };

  // --- ADDING THIS FUNCTION FOR FORMATTING THE DASHBOARD FILTER ---
  const formatFilterText = () => {
    const parts = [];
    const { dateRange, shift } = criteria;

    // Format the date part
    if (dateRange?.start && dateRange?.end) {
      const start = DateTime.fromISO(dateRange.start);
      const end = DateTime.fromISO(dateRange.end);
      const now = DateTime.local().setZone("Asia/Kolkata");

      if (start.hasSame(now, "day")) {
        parts.push("Today");
      } else if (start.toISODate() === end.toISODate()) {
        parts.push(start.toFormat("d MMM, yyyy"));
      } else {
        parts.push(
          `${start.toFormat("d MMM")} - ${end.toFormat("d MMM, yyyy")}`
        );
      }
    } else {
      parts.push("All Time");
    }

    // Format the shift part
    if (shift && shift !== "Any") {
      parts.push(`Shift: ${shift}`);
    }

    return parts.join("  |  ");
  };
  // ------------------------------------

  return (
    <Stack
      spacing={2}
      sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "grey.100" }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: "background.default", // Match the results paper
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          {getHeading()}
        </Typography>
        <IncidentSearchForm
          criteria={criteria}
          onCriteriaChange={setCriteria} // Pass this down
          onSearch={handleSearch}
          isLoading={isLoading}
          incidentTypes={incidentTypes}
          departments={departments}
        />
      </Paper>

      <Paper
        elevation={2}
        sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        {hasSearched ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 2,
              }}
            >
              <Typography variant="h5" component="h2">
                Search Results
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  position: "relative", // Adding this
                  top: "1px", // Adding this to nudge the text down
                }}
              >
                ({formatFilterText()})
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: "65vh" }}>
              <IncidentDataGrid
                rows={incidentData?.incidents || []}
                loading={isLoading}
                hideFooterPagination={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pt: 2,
              }}
            >
              {incidentData?.incidents && (
                <Typography variant="body2" sx={{ mr: "auto" }}>
                  Showing{" "}
                  <strong>
                    {(incidentData.currentPage - 1) * 20 + 1}–
                    {(incidentData.currentPage - 1) * 20 +
                      incidentData.incidents.length}
                  </strong>{" "}
                  of <strong>{incidentData.totalIncidents}</strong>
                </Typography>
              )}
              <Typography variant="body2" sx={{ mr: 2 }}>
                Page {incidentData?.currentPage || 0} of{" "}
                {incidentData?.totalPages || 0}
              </Typography>
              <IconButton
                onClick={() => handlePageChange(page - 1)}
                disabled={!incidentData || incidentData.currentPage <= 1}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={() => handlePageChange(page + 1)}
                disabled={
                  !incidentData ||
                  incidentData.currentPage >= incidentData.totalPages
                }
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "65vh",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              Please enter search criteria and click "Search"
            </Typography>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
