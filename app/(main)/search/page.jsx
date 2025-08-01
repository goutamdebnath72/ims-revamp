"use client";

import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import { SearchContext } from "@/context/SearchContext";
import {
  Box,
  Typography,
  Paper,
  Stack,
  useScrollTrigger,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IncidentSearchForm from "@/components/IncidentSearchForm";
import IncidentDataGrid from "@/components/IncidentDataGrid";
import useSWR from "swr"; // Keep swr for dropdown data

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SearchPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Get all state and functions from the new context
  const {
    criteria,
    hasSearched,
    page,
    incidentData,
    isLoading,
    handleSearch,
    handlePageChange,
    setCriteria, // Add this
  } = useContext(SearchContext);

  // Fetch dropdown data locally in the page component
  const { data: typesData } = useSWR("/api/incident-types", fetcher);
  const { data: deptsData } = useSWR("/api/departments", fetcher);
  const incidentTypes = typesData?.incidentTypes || [];
  const departments = deptsData?.departments || [];

  const getHeading = () => {
    if (user?.role === "sys_admin" && criteria.category === "System")
      return "Search & Archive (SYS)";
    return "Search & Archive";
  };

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
        sx={{ p: 2, position: "sticky", top: 64, zIndex: 10 }}
      >
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
        sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        {hasSearched ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, flexShrink: 0 }}>
              Search Results
            </Typography>
            <Box sx={{ flexGrow: 1, height: "65vh" }}>
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
