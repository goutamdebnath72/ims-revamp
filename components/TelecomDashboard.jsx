"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
import { DateTime } from "luxon";
import {
  Stack,
  Button,
  Menu,
  MenuItem,
  Divider,
  Box,
  CardActionArea,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import CountUp from "react-countup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";
import StatusChart from "@/components/StatusChart";
import PriorityChart from "@/components/PriorityChart";
import RecentIncidentsCard from "@/components/RecentIncidentsCard";
import {
  TEAMS,
  INCIDENT_STATUS,
  INCIDENT_PRIORITY,
  INCIDENT_TYPES,
} from "@/lib/constants";

export default function TelecomDashboard() {
  const dashboardTitle = "Telecom Department Dashboard";
  const cardContainerStyles = {
    height: 380,
    display: "flex",
    flexDirection: "column",
  };

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

  // The 'incidents' variable from context is now used directly, as it's pre-filtered.
  const pendingIncidents = (incidents || []).filter(
    (i) => i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
  ).length;
  const resolvedIncidents = (incidents || []).filter(
    (i) => i.status === INCIDENT_STATUS.RESOLVED
  ).length;
  const closedIncidents = (incidents || []).filter(
    (i) => i.status === INCIDENT_STATUS.CLOSED
  ).length;

  const statCardsData = [
    {
      title: "Pending Action",
      value: pendingIncidents,
      color: "warning",
      filterStatus: INCIDENT_STATUS.PENDING_TELECOM_ACTION,
    },
    {
      title: "Resolved Incidents",
      value: resolvedIncidents,
      color: "success",
      filterStatus: INCIDENT_STATUS.RESOLVED,
    },
    {
      title: "Closed",
      value: closedIncidents,
      color: "default",
      filterStatus: INCIDENT_STATUS.CLOSED,
    },
  ];

  const constructCardUrl = (status) => {
    const params = new URLSearchParams();
    params.append("status", status);
    params.append("assignedTeam", TEAMS.TELECOM);
    if (shift !== "All") params.append("shift", shift);
    if (dateRange?.start) params.append("startDate", dateRange.start.toISO());
    if (dateRange?.end) params.append("endDate", dateRange.end.toISO());
    return `/search?${params.toString()}`;
  };

  const statusChartData = [
    { name: "Pending", count: pendingIncidents },
    { name: "Resolved", count: resolvedIncidents },
    { name: "Closed", count: closedIncidents },
  ];

  const priorityChartData = [
    {
      name: "High",
      value: (incidents || []).filter(
        (i) =>
          i.priority === INCIDENT_PRIORITY.HIGH &&
          i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
      ).length,
    },
    {
      name: "Medium",
      value: (incidents || []).filter(
        (i) =>
          i.priority === INCIDENT_PRIORITY.MEDIUM &&
          i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
      ).length,
    },
    {
      name: "Low",
      value: (incidents || []).filter(
        (i) =>
          i.priority === INCIDENT_PRIORITY.LOW &&
          i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
      ).length,
    },
  ].filter((item) => item.value > 0);

  const getNumberVariant = (value) =>
    value.toString().length > 4 ? "h4" : "h3";

  return (
    <Stack spacing={3}>
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
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
            {dashboardTitle}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }} />
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
      <Stack direction="row" spacing={3}>
        {statCardsData.map((card, index) => (
          <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardActionArea
                component={Link}
                href={constructCardUrl(card.filterStatus)}
                sx={{ height: "100%" }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant={getNumberVariant(card.value)}
                    component="div"
                    color={`${card.color}.main`}
                  >
                    <CountUp end={card.value} duration={1.5} separator="," />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Stack>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box sx={{ flex: 7 }}>
            <StatusChart data={statusChartData} />
          </Box>
          <Box sx={{ flex: 5 }}>
            <PriorityChart
              data={priorityChartData}
              dateRange={dateRange}
              shift={shift}
              incidentTypeFilter={INCIDENT_TYPES.NETWORK}
            />
          </Box>
        </Stack>
        <Box sx={cardContainerStyles}>
          <RecentIncidentsCard incidents={incidents} />
        </Box>
      </Stack>
    </Stack>
  );
}
