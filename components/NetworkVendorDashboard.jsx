"use client";

import * as React from "react";
import Link from "next/link";
import { IncidentContext } from "@/context/IncidentContext";
import { filterIncidents } from "@/lib/incident-helpers";
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
} from "@mui/material";
import CountUp from "react-countup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import StatusChart from "@/components/StatusChart";
import PriorityChart from "@/components/PriorityChart";
import RecentIncidentsCard from "@/components/RecentIncidentsCard";
import { useSession } from "next-auth/react";

// This is a specialized dashboard for the Network Vendor role.
export default function NetworkVendorDashboard() {
  const { incidents } = React.useContext(IncidentContext);
  const { data: session } = useSession();
  const user = session?.user;

  const [dateRange, setDateRange] = React.useState({ start: null, end: null });
  const [shift, setShift] = React.useState("All");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const now = DateTime.local().setZone("Asia/Kolkata");
    setDateRange({ start: now.toJSDate(), end: now.toJSDate() });
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleShiftChange = (event, newShift) => {
    if (newShift !== null) setShift(newShift);
  };

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

  const networkIncidents = React.useMemo(() => {
    return incidents.filter(
      (incident) =>
        incident.incidentType === "NETWORK" && incident.status !== "New"
    );
  }, [incidents]);

  const filteredIncidents = React.useMemo(() => {
    const criteria = { dateRange, shift };
    return filterIncidents(networkIncidents, criteria, user);
  }, [networkIncidents, dateRange, shift, user]);

  const sortedIncidents = React.useMemo(() => {
    return [...filteredIncidents].sort((a, b) => {
      const dateA = DateTime.fromISO(a.reportedOn, { zone: "Asia/Kolkata" });
      const dateB = DateTime.fromISO(b.reportedOn, { zone: "Asia/Kolkata" });
      return dateB - dateA;
    });
  }, [filteredIncidents]);

  const processedIncidents = filteredIncidents.filter(
    (i) => i.status === "Processed"
  ).length;
  const resolvedIncidents = filteredIncidents.filter(
    (i) => i.status === "Resolved"
  ).length;
  const closedIncidents = filteredIncidents.filter(
    (i) => i.status === "Closed"
  ).length;
  const allOpenIncidents = processedIncidents;

  const statCardsData = [
    {
      title: "Assigned (Processed)",
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
      title: "Resolved Incidents",
      value: resolvedIncidents,
      color: "success",
      filterStatus: "Resolved",
    },
    {
      title: "Closed",
      value: closedIncidents,
      color: "default",
      filterStatus: "Closed",
    },
  ];

  // *** FIX: THIS FUNCTION NOW CORRECTLY ADDS ALL FILTERS TO THE URL ***
  const constructCardUrl = (status) => {
    const params = new URLSearchParams();
    params.append("status", status);
    params.append("incidentType", "NETWORK"); // Always filter for network
    if (shift !== "All") {
      params.append("shift", shift);
    }
    // Pass the dashboard's current date range to the search page
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
    { name: "Processed", count: processedIncidents },
    { name: "Resolved", count: resolvedIncidents },
    { name: "Closed", count: closedIncidents },
  ];

  const priorityChartData = [
    {
      name: "High",
      value: filteredIncidents.filter((i) => i.priority === "High").length,
    },
    {
      name: "Medium",
      value: filteredIncidents.filter((i) => i.priority === "Medium").length,
    },
    {
      name: "Low",
      value: filteredIncidents.filter((i) => i.priority === "Low").length,
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

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
          Network Incidents Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
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
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box sx={{ flex: 7 }}>
            <StatusChart data={statusChartData} />
          </Box>
          <Box sx={{ flex: 5 }}>
            <PriorityChart data={priorityChartData} />
          </Box>
        </Stack>
        <RecentIncidentsCard incidents={sortedIncidents} />
      </Stack>
    </Stack>
  );
}
