"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
import { isSystemIncident } from "@/lib/incident-helpers";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import CountUp from "react-countup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";
import StatusChart from "@/components/StatusChart";
import PriorityChart from "@/components/PriorityChart";
import TeamAvailabilityCard from "@/components/TeamAvailabilityCard";
import RecentIncidentsCard from "@/components/RecentIncidentsCard";
import ViewToggle from "@/components/ViewToggle";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

    console.log("DASHBOARD RENDER: User object is", user);


  // --- REFACTORED ---
  // Data now comes directly from the context.
  // This assumes your DashboardFilterContext provides these values.
  const { filters, setFilters, resetFilters, incidents, isLoading, error } =
    React.useContext(DashboardFilterContext);
  const { dateRange, shift } = filters;

  // --- DELETED ---
  // The useSWR hook, buildQueryString function, and fetcher function have been removed.
  // The context is now responsible for all data fetching.

  const [view, setView] = React.useState("general");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleShiftChange = (event, newShift) => {
    if (newShift !== null) {
      setFilters((prev) => ({ ...prev, shift: newShift }));
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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

  const incidentsToDisplay = React.useMemo(() => {
    const category = user?.role === "sys_admin" ? view : "general";
    if (!incidents) return []; // Now uses incidents from context
    return incidents.filter((incident) => {
      const isSys = isSystemIncident(incident);
      if (category === "system") return isSys;
      if (category === "general") return !isSys;
      return true;
    });
  }, [incidents, user, view]);

  const newIncidents = incidentsToDisplay.filter(
    (i) => i.status === "New"
  ).length;
  const processedIncidents = incidentsToDisplay.filter(
    (i) => i.status === "Processed"
  ).length;
  const allOpenIncidents = newIncidents + processedIncidents;

  const statCardsData = [
    {
      title: "New Incidents",
      value: newIncidents,
      color: "warning",
      filterStatus: "New",
    },
    {
      title: "Processed",
      value: processedIncidents,
      color: "info",
      filterStatus: "Processed",
    },
    {
      title: "All Open",
      value: allOpenIncidents,
      color: "secondary",
      filterStatus: "open",
    },
    {
      title: "Resolved",
      value: incidentsToDisplay.filter((i) => i.status === "Resolved").length,
      color: "success",
      filterStatus: "Resolved",
    },
    {
      title: "Closed",
      value: incidentsToDisplay.filter((i) => i.status === "Closed").length,
      color: "default",
      filterStatus: "Closed",
    },
  ];

  const constructCardUrl = (status) => {
    const category = user?.role === "sys_admin" ? view : "general";
    const params = new URLSearchParams();
    params.append("status", status);
    params.append("category", category);
    if (shift !== "All") params.append("shift", shift);
    if (dateRange?.start)
      params.append("startDate", dateRange.start.toISODate());
    if (dateRange?.end) params.append("endDate", dateRange.end.toISODate());
    return `/search?${params.toString()}`;
  };

  const statusChartData = [
    { name: "New", count: newIncidents },
    { name: "Processed", count: processedIncidents },
    {
      name: "Resolved",
      count: incidentsToDisplay.filter((i) => i.status === "Resolved").length,
    },
    {
      name: "Closed",
      count: incidentsToDisplay.filter((i) => i.status === "Closed").length,
    },
  ];

  const openIncidentsList = incidentsToDisplay.filter(
    (i) => i.status === "New" || i.status === "Processed"
  );

  const priorityChartData = [
    {
      name: "High",
      value: openIncidentsList.filter((i) => i.priority === "High").length,
    },
    {
      name: "Medium",
      value: openIncidentsList.filter((i) => i.priority === "Medium").length,
    },
    {
      name: "Low",
      value: openIncidentsList.filter((i) => i.priority === "Low").length,
    },
  ].filter((item) => item.value > 0);

  const getNumberVariant = (value) =>
    value.toString().length > 4 ? "h4" : "h3";

  const formatDateRange = (currentDateRange) => {
    const { start, end } = currentDateRange;
    if (!start || !end) return "All Time"; // Handle "All Time"
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

  const showTeamAvailability =
    user?.role === "admin" ||
    (user?.role === "sys_admin" && view === "general");

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
            Dashboard
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {user?.role === "sys_admin" && (
            <ViewToggle selectedView={view} onChange={setView} />
          )}
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
            aria-label="Shift filter"
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

      {/* This debug box now uses the state from the context */}
      {/*<Box sx={{ p: 2, border: "2px solid red", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Context Debugger:
        </Typography>
        {isLoading && (
          <Typography>
            Current Status: <strong>Loading...</strong>
          </Typography>
        )}
        {error && (
          <Typography>
            Current Status: <strong>Error!</strong> Failed to fetch data.
          </Typography>
        )}
        {incidents && (
          <Typography>
            Current Status: <strong>Success!</strong> Found {incidents.length}{" "}
            incidents.
          </Typography>
        )}
        {!isLoading && !error && !incidents && (
          <Typography>
            Current Status: <strong>Idle</strong>
          </Typography>
        )}
      </Box>*/}

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
      {showTeamAvailability ? (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Stack sx={{ flex: 7 }} spacing={3}>
            <Card
              elevation={3}
              sx={{
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <StatusChart data={statusChartData} />
            </Card>
            <RecentIncidentsCard incidents={incidentsToDisplay} />
          </Stack>
          <Stack sx={{ flex: 5 }} spacing={3}>
            <Card
              elevation={3}
              sx={{
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <PriorityChart
                key={`${shift}-${String(dateRange.start)}-${String(
                  dateRange.end
                )}`}
                data={priorityChartData}
                view={view}
                dateRange={dateRange}
                userRole={user?.role}
                shift={shift}
              />
            </Card>
            <TeamAvailabilityCard />
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box sx={{ flex: 7 }}>
              <StatusChart data={statusChartData} />
            </Box>
            <Box sx={{ flex: 5 }}>
              <PriorityChart
                key={`${shift}-${String(dateRange.start)}-${String(
                  dateRange.end
                )}`}
                data={priorityChartData}
                view={view}
                dateRange={dateRange}
                userRole={user?.role}
                shift={shift}
              />
            </Box>
          </Stack>
          <RecentIncidentsCard incidents={incidentsToDisplay} />
        </Stack>
      )}
    </Stack>
  );
}