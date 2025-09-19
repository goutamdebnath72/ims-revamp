"use client";

import * as React from "react";
import { DashboardFilterContext } from "../context/DashboardFilterContext";
import { DateTime } from "luxon";
import {
  Stack,
  Button,
  Menu,
  MenuItem,
  Divider,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";
import { INCIDENT_STATUS, INCIDENT_PRIORITY } from "../lib/constants";

// --- START: MODIFICATION ---
// Import the new GenericDashboard component
import GenericDashboard from "./GenericDashboard";
// --- END: MODIFICATION ---

export default function TelecomDashboard() {
  const dashboardTitle = "Telecom Department Dashboard";
  const { filters, setFilters, resetFilters, incidents } = React.useContext(
    DashboardFilterContext
  );
  const { dateRange, shift } = filters;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // All the data handlers and formatters below are preserved as they are correct.
  const handleShiftChange = (event, newShift) => {
    if (newShift !== null) {
      setFilters((prev) => ({ ...prev, shift: newShift }));
    }
  };

  const setPresetRange = (rangeName) => {
    const now = DateTime.local().setZone("Asia/Kolkata");
    let newDateRange;
    if (rangeName === "today") {
      newDateRange = { start: now.startOf("day"), end: now.endOf("day") };
    } else if (rangeName === "week") {
      newDateRange = { start: now.startOf("week"), end: now.endOf("day") };
    } else if (rangeName === "month") {
      newDateRange = { start: now.startOf("month"), end: now.endOf("day") };
    } else if (rangeName === "all") {
      newDateRange = { start: null, end: null };
    }
    setFilters((prev) => ({ ...prev, dateRange: newDateRange }));
    handleClose();
  };

  const formatDateRange = (currentDateRange) => {
    const { start, end } = currentDateRange;
    if (!start || !end) return "All Time";
    const now = DateTime.local().setZone("Asia/Kolkata");
    if (start.hasSame(now, "day") && end.hasSame(now, "day")) return "Today";
    if (
      start.hasSame(now.startOf("week"), "day") &&
      end.hasSame(now.endOf("day"), "day")
    )
      return "This Week";
    if (
      start.hasSame(now.startOf("month"), "day") &&
      end.hasSame(now.endOf("day"), "day")
    )
      return "This Month";
    if (start.toISODate() === end.toISODate())
      return start.toFormat("d MMM, yy");
    return `${start.toFormat("d MMM")} - ${end.toFormat("d MMM, yy")}`;
  };

  const incidentsToDisplay = incidents || [];

  // --- START: PREPARE PROPS FOR GENERIC DASHBOARD ---

  // 1. Prepare the stat cards array
  const statCards = [
    {
      title: "Pending Action",
      value: incidentsToDisplay.filter(
        (i) => i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
      ).length,
      color: "warning",
      filterStatus: INCIDENT_STATUS.PENDING_TELECOM_ACTION,
    },
    {
      title: "Resolved Incidents",
      value: incidentsToDisplay.filter(
        (i) => i.status === INCIDENT_STATUS.RESOLVED
      ).length,
      color: "success",
      filterStatus: INCIDENT_STATUS.RESOLVED,
    },
    {
      title: "Closed",
      value: incidentsToDisplay.filter(
        (i) => i.status === INCIDENT_STATUS.CLOSED
      ).length,
      color: "default",
      filterStatus: INCIDENT_STATUS.CLOSED,
    },
  ];

  // 2. Prepare the chart layout configuration object
  const chartLayoutConfig = {
    layout: "2_over_1", // As per your diagram: 2 charts on top, 1 full-width below
    barChartData: [
      {
        name: "Pending",
        count:
          statCards.find((card) => card.title === "Pending Action")?.value || 0,
      },
      {
        name: "Resolved",
        count:
          statCards.find((card) => card.title === "Resolved Incidents")
            ?.value || 0,
      },
      {
        name: "Closed",
        count: statCards.find((card) => card.title === "Closed")?.value || 0,
      },
    ],
    pieChartData: [
      {
        name: "High",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === INCIDENT_PRIORITY.HIGH &&
            i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
        ).length,
      },
      {
        name: "Medium",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === INCIDENT_PRIORITY.MEDIUM &&
            i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
        ).length,
      },
      {
        name: "Low",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === INCIDENT_PRIORITY.LOW &&
            i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
        ).length,
      },
    ].filter((item) => item.value > 0),
    recentIncidents: incidentsToDisplay,
  };

  // --- END: PREPARE PROPS ---

  return (
    <Stack spacing={3}>
      {/* The top filter bar section is preserved exactly as it was. */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
            {dashboardTitle}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Reset Filters">
            <IconButton onClick={resetFilters} size="small">
              <ReplayIcon />
            </IconButton>
          </Tooltip>
          {shift !== "All" && (
            <Chip
              label={`Shift: ${shift}`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          )}
          <Button
            id="date-range-button"
            variant="outlined"
            onClick={handleClick}
            startIcon={<EventIcon />}
          >
            {formatDateRange(dateRange)}
          </Button>
        </Box>
      </Stack>

      <Menu
        id="date-range-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setPresetRange("today")}>Today</MenuItem>
        <MenuItem onClick={() => setPresetRange("week")}>This Week</MenuItem>
        <MenuItem onClick={() => setPresetRange("month")}>This Month</MenuItem>
        <MenuItem onClick={() => setPresetRange("all")}>All Time</MenuItem>
        <Divider />
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography variant="overline" display="block" sx={{ mb: 2 }}>
            Custom Range
          </Typography>
          <Stack spacing={2}>
            <DatePicker
              label="Start Date"
              value={dateRange.start || null}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: newValue },
                }))
              }
            />
            <DatePicker
              label="End Date"
              value={dateRange.end || null}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: newValue },
                }))
              }
            />
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography variant="overline" display="block">
            Filter by Shift
          </Typography>
          <ToggleButtonGroup
            value={shift}
            exclusive
            onChange={handleShiftChange}
            size="small"
            sx={{ mt: 1 }}
          >
            <ToggleButton value="All">All</ToggleButton>
            <ToggleButton value="A">A</ToggleButton>
            <ToggleButton value="B">B</ToggleButton>
            <ToggleButton value="C">C</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Menu>

      {/* --- START: MODIFICATION --- */}
      {/* The old messy Stack layout is replaced with a single call to our new component. */}
      <GenericDashboard
        statCards={statCards}
        chartLayoutConfig={chartLayoutConfig}
      />
      {/* --- END: MODIFICATION --- */}
    </Stack>
  );
}
