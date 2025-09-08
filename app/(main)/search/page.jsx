"use client";

import React, { useContext } from "react";
import { SearchContext } from "@/context/SearchContext";
// --- Imports updated for the new spinner ---
import { Box, Typography, Paper, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IncidentSearchForm from "@/components/IncidentSearchForm";
import IncidentDataGrid from "@/components/IncidentDataGrid";
import { DateTime } from "luxon";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SearchPage() {
  const {
    criteria,
    hasSearched,
    page,
    incidentData,
    isLoading,
    handleSearch,
    handlePageChange,
    setCriteria,
    user,
    pageSize,
    setPageSize,
  } = useContext(SearchContext);
  const router = useRouter();
  const { data: incidentTypesData } = useSWR("/api/incident-types", fetcher);
  const { data: departmentsData } = useSWR("/api/departments", fetcher);
  const incidentTypes = incidentTypesData || [];
  const departments = departmentsData || [];

  // --- This is the new block with the full, correct logic ---

  // This function now handles the state update AND triggers the new search
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);

    // Build new search params from the current URL, keeping existing filters
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1"); // Always reset to page 1
    params.set("limit", newPageSize.toString());

    // Trigger the search instantly by pushing the new URL
    router.push(`/search?${params.toString()}`);
  };

  const handleIncrementPageSize = () => {
    if (pageSize < 50) {
      handlePageSizeChange(pageSize + 5);
    }
  };

  const handleDecrementPageSize = () => {
    if (pageSize > 10) {
      handlePageSizeChange(pageSize - 5);
    }
  };

  // --- Existing helper functions (PRESERVED) ---
  const getHeading = () => {
    if (
      user?.role === "sys_admin" &&
      criteria.category?.toLowerCase() === "system"
    )
      return "Search & Archive (SYS)";
    return "Search & Archive";
  };

  const formatFilterText = () => {
    const parts = [];
    const { dateRange, shift } = criteria;

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

    if (shift && shift !== "Any") {
      parts.push(`Shift: ${shift}`);
    }

    return parts.join("  |  ");
  };

  return (
    <Stack
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 112px)",
      }}
    >
      <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
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

      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          ...(!hasSearched && { flexGrow: 1 }),
        }}
      >
        {hasSearched ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Typography variant="h5" component="h2">
                Search Results
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontWeight: 500, position: "relative", top: "1px" }}
              >
                ({formatFilterText()})
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <IncidentDataGrid
                rows={incidentData?.incidents || []}
                loading={isLoading}
                hideFooter={true}
                autoHeight
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
                    {(incidentData.currentPage - 1) * pageSize + 1}–
                    {(incidentData.currentPage - 1) * pageSize +
                      incidentData.incidents.length}
                  </strong>{" "}
                  of <strong>{incidentData.totalIncidents}</strong>
                </Typography>
              )}
              {/* --- This is the NEW Page Size Spinner --- */}
              <Stack direction="row" alignItems="center" sx={{ mx: 2 }}>
                <IconButton
                  onClick={handleDecrementPageSize}
                  disabled={pageSize <= 10}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <Box sx={{ px: 2, minWidth: "80px", textAlign: "center" }}>
                  <Typography variant="body2">{pageSize} per page</Typography>
                </Box>
                <IconButton
                  onClick={handleIncrementPageSize}
                  disabled={pageSize >= 50}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Stack>

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
