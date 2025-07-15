"use client";

import * as React from "react";
import Link from "next/link";
import { IncidentContext } from "@/context/IncidentContext";
import { getCurrentShift } from "@/lib/date-helpers";
import { isSystemIncident, filterIncidents } from '@/lib/incident-helpers';
import {
  formatISO,
  startOfWeek,
  startOfMonth,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
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
import StatusChart from "@/components/StatusChart";
import PriorityChart from "@/components/PriorityChart";
import TeamAvailabilityCard from "@/components/TeamAvailabilityCard";
import RecentIncidentsCard from "@/components/RecentIncidentsCard";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { incidents } = React.useContext(IncidentContext);
  const { data: session } = useSession();
  const user = session?.user;

  const [view, setView] = React.useState("general");
  const [dateRange, setDateRange] = React.useState({ start: null, end: null });
  const [shift, setShift] = React.useState("All");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    setShift(getCurrentShift());
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };
  const handleShiftChange = (event, newShift) => {
    if (newShift !== null) setShift(newShift);
  };
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const setPresetRange = (rangeName) => {
    const now = new Date();
    if (rangeName === "today") setDateRange({ start: now, end: now });
    if (rangeName === "week")
      setDateRange({ start: startOfWeek(now), end: now });
    if (rangeName === "month")
      setDateRange({ start: startOfMonth(now), end: now });
    if (rangeName === "all") setDateRange({ start: null, end: null });
    handleClose();
  };

  const incidentsToDisplay = React.useMemo(() => {
    const category = user?.role === "sys_admin" ? view : "general";
    return incidents.filter((incident) => {
      const isSys = isSystemIncident(incident);
      if (category === "system") return isSys;
      if (category === "general") return !isSys;
      return true;
    });
  }, [incidents, user, view]);

  // CORRECTED: The entire filtering logic now uses the incident ID for date and shift checks.
const filteredIncidents = React.useMemo(() => {
  const criteria = { dateRange, shift };
  // Pass the user object for consistency and add it to the dependency array.
  return filterIncidents(incidentsToDisplay, criteria, user);
}, [incidentsToDisplay, dateRange, shift, user]);
  const newIncidents = filteredIncidents.filter(
    (i) => i.status === "New"
  ).length;
  const processedIncidents = filteredIncidents.filter(
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
      value: filteredIncidents.filter((i) => i.status === "Resolved").length,
      color: "success",
      filterStatus: "Resolved",
    },
    {
      title: "Closed",
      value: filteredIncidents.filter((i) => i.status === "Closed").length,
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
    if (dateRange.start)
      params.append(
        "startDate",
        formatISO(dateRange.start, { representation: "date" })
      );
    if (dateRange.end)
      params.append(
        "endDate",
        formatISO(dateRange.end, { representation: "date" })
      );
    return `/search?${params.toString()}`;
  };

  const statusChartData = [
    { name: "New", count: newIncidents },
    { name: "Processed", count: processedIncidents },
    {
      name: "Resolved",
      count: filteredIncidents.filter((i) => i.status === "Resolved").length,
    },
    {
      name: "Closed",
      count: filteredIncidents.filter((i) => i.status === "Closed").length,
    },
  ];

  const openIncidentsList = filteredIncidents.filter(
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

  const formatDateRange = () => {
    const { start, end } = dateRange;
    if (!start || !end) return "All Time";
    const options = { locale: enUS };
    if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd"))
      return format(start, "do MMM, yy", options);
    return `${format(start, "do MMM", options)} - ${format(
      end,
      "do MMM, yy",
      options
    )}`;
  };

  const showTeamAvailability =
    user?.role === "admin" ||
    (user?.role === "sys_admin" && view === "general");

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
          Dashboard
        </Typography>
        {user?.role === "sys_admin" && (
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="Dashboard view"
            >
              <ToggleButton value="general" aria-label="general view">
                General View
              </ToggleButton>
              <ToggleButton value="system" aria-label="system view">
                System View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
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
            {formatDateRange()}
          </Button>
        </Box>
      </Stack>

      {/* Menu & Filters */}
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
              value={dateRange.start}
              onChange={(newValue) =>
                setDateRange((prev) => ({ ...prev, start: newValue }))
              }
            />
            <DatePicker
              label="End Date"
              value={dateRange.end}
              onChange={(newValue) =>
                setDateRange((prev) => ({ ...prev, end: newValue }))
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
            <ToggleButton value="All" aria-label="all shifts">
              All
            </ToggleButton>
            <ToggleButton value="A" aria-label="a shift">
              A
            </ToggleButton>
            <ToggleButton value="B" aria-label="b shift">
              B
            </ToggleButton>
            <ToggleButton value="C" aria-label="c shift">
              C
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Menu>

      {/* Stat Cards */}
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

      {/* Charts and Cards */}
      {showTeamAvailability ? (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Stack sx={{ flex: 7 }} spacing={3}>
            <StatusChart data={statusChartData} />
            <RecentIncidentsCard incidents={filteredIncidents} />
          </Stack>
          <Stack sx={{ flex: 5 }} spacing={3}>
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
          <RecentIncidentsCard incidents={filteredIncidents} />
        </Stack>
      )}
    </Stack>
  );
}
