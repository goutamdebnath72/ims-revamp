"use client";

import * as React from "react";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";

// Import the reusable GenericDashboard component
import GenericDashboard from "@/components/GenericDashboard";

export default function BiometricAMCDashboard() {
  const { filters, setFilters, resetFilters, incidents } = React.useContext(
    DashboardFilterContext
  );
  const { dateRange, shift } = filters;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
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

  // Filter incidents for BIOMETRIC type
  const biometricIncidents = React.useMemo(() => {
    if (!incidents) return [];
    return incidents.filter(
      (incident) => incident.incidentType?.name === "BIOMETRIC"
    );
  }, [incidents]);

  // --- START: PREPARE PROPS FOR GENERIC DASHBOARD ---
  const statCards = [
    {
      title: "Assigned (Processed)",
      value: biometricIncidents.filter((i) => i.status === "Processed").length,
      color: "info",
      filterStatus: "Processed",
    },
    {
      title: "Resolved Incidents",
      value: biometricIncidents.filter((i) => i.status === "Resolved").length,
      color: "success",
      filterStatus: "Resolved",
    },
    {
      title: "Closed",
      value: biometricIncidents.filter((i) => i.status === "Closed").length,
      color: "default",
      filterStatus: "Closed",
    },
  ];

  const chartLayoutConfig = {
    layout: "2_over_1",
    barChartData: [
      {
        name: "Processed",
        count:
          statCards.find((c) => c.title === "Assigned (Processed)")?.value || 0,
      },
      {
        name: "Resolved",
        count:
          statCards.find((c) => c.title === "Resolved Incidents")?.value || 0,
      },
      {
        name: "Closed",
        count: statCards.find((c) => c.title === "Closed")?.value || 0,
      },
    ],
    pieChartData: [
      {
        name: "High",
        value: biometricIncidents.filter(
          (i) => i.priority === "High" && i.status === "Processed"
        ).length,
      },
      {
        name: "Medium",
        value: biometricIncidents.filter(
          (i) => i.priority === "Medium" && i.status === "Processed"
        ).length,
      },
      {
        name: "Low",
        value: biometricIncidents.filter(
          (i) => i.priority === "Low" && i.status === "Processed"
        ).length,
      },
    ].filter((item) => item.value > 0),
    recentIncidents: biometricIncidents,
  };
  // --- END: PREPARE PROPS ---

  return (
    <Stack spacing={2}>
      {/* Filter Bar and Menu are preserved */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
            Biometric Incidents Dashboard
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
          <ReplayIcon
            onClick={resetFilters}
            sx={{ cursor: "pointer", color: "action.active" }}
          />
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

      {/* The old layout is replaced with a single call to the new component */}
      <GenericDashboard
        statCards={statCards}
        chartLayoutConfig={chartLayoutConfig}
      />
    </Stack>
  );
}
