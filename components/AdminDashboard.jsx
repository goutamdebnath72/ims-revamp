"use client";

import * as React from "react";
import Link from "next/link";
import { IncidentContext } from "@/context/IncidentContext";
import { getCurrentShift } from "@/lib/date-helpers";
import ViewToggle from "@/components/ViewToggle";
import {
  isSystemIncident,
  filterIncidents,
  SYSTEM_INCIDENT_TYPES,
} from "@/lib/incident-helpers";
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
  Tooltip,
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
    if (user) {
      const now = DateTime.local().setZone("Asia/Kolkata");
      setDateRange({ start: now.toJSDate(), end: now.toJSDate() });
      if (user.role === "sys_admin") {
        setShift("All");
      } else {
        setShift(getCurrentShift());
      }
    }
  }, [user]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };
  const handleShiftChange = (event, newShift) => {
    if (newShift !== null) setShift(newShift);
  };
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const setPresetRange = (rangeName) => {
    const now = DateTime.local().setZone("Asia/Kolkata");
    if (rangeName === "today") {
      setDateRange({ start: now.toJSDate(), end: now.toJSDate() });
    } else if (rangeName === "week") {
      setDateRange({
        start: now.startOf("week").toJSDate(),
        end: now.toJSDate(),
      });
    } else if (rangeName === "month") {
      setDateRange({
        start: now.startOf("month").toJSDate(),
        end: now.toJSDate(),
      });
    } else if (rangeName === "all") {
      setDateRange({ start: null, end: null });
    }
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

  const filteredIncidents = React.useMemo(() => {
    const criteria = { dateRange, shift };
    return filterIncidents(incidentsToDisplay, criteria, user);
  }, [incidentsToDisplay, dateRange, shift, user]);

  const sortedIncidents = React.useMemo(() => {
    return [...filteredIncidents].sort((a, b) => {
      const dateA = DateTime.fromFormat(a.reportedOn, "dd MMM yyyy HH:mm", {
        zone: "Asia/Kolkata",
      });
      const dateB = DateTime.fromFormat(b.reportedOn, "dd MMM yyyy HH:mm", {
        zone: "Asia/Kolkata",
      });
      return dateB - dateA;
    });
  }, [filteredIncidents]);

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
    if (dateRange.start) {
      params.append(
        "startDate",
        DateTime.fromJSDate(dateRange.start).toISODate()
      );
    }
    if (dateRange.end) {
      params.append("endDate", DateTime.fromJSDate(dateRange.end).toISODate());
    }
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
    const startDt = DateTime.fromJSDate(start);
    const endDt = DateTime.fromJSDate(end);
    const today = DateTime.local().setZone("Asia/Kolkata");
    if (startDt.hasSame(today, "day") && endDt.hasSame(today, "day")) {
      return "Today";
    }
    if (startDt.toISODate() === endDt.toISODate()) {
      return startDt.toFormat("d MMM, yy");
    }
    return `${startDt.toFormat("d MMM")} - ${endDt.toFormat("d MMM, yy")}`;
  };

  const showTeamAvailability =
    user?.role === "admin" ||
    (user?.role === "sys_admin" && view === "general");

  const systemTooltipContent = (
    <Box sx={{ textAlign: "left", p: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        System Incident Types
      </Typography>
      <Divider sx={{ my: 1, borderColor: "grey.500" }} />
      {SYSTEM_INCIDENT_TYPES.map((type) => (
        <Typography key={type} variant="caption" display="block">
          {type}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Stack spacing={3}>
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
            <ViewToggle selectedView={view} onChange={setView} />
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
            <RecentIncidentsCard incidents={sortedIncidents} />
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
          <RecentIncidentsCard incidents={sortedIncidents} />
        </Stack>
      )}
    </Stack>
  );
}
