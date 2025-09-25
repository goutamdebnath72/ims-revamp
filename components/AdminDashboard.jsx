// components/AdminDashboard.jsx

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardFilterContext } from "@/context/DashboardFilterContext";
import {
  Stack,
  Button,
  Menu,
  MenuItem,
  Divider,
  Box,
  CardActionArea,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CountUp from "react-countup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";
import ViewToggle from "@/components/ViewToggle";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { INCIDENT_STATUS } from "@/lib/constants";

import GenericDashboard from "@/components/GenericDashboard";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { filters, setFilters, resetFilters, incidents } = React.useContext(
    DashboardFilterContext
  );
  // ✅ MODIFICATION: Destructure incidentTypeFilter from context
  const { dateRange, shift, category, incidentTypeFilter } = filters;

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
  const newIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.NEW
  ).length;
  const processedIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.PROCESSED
  ).length;
  const pendingTelecomIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION
  ).length;
  const pendingEtlIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.PENDING_ETL
  ).length;
  const resolvedIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.RESOLVED
  ).length;
  const closedIncidents = incidentsToDisplay.filter(
    (i) => i.status === INCIDENT_STATUS.CLOSED
  ).length;
  const allOpenIncidents =
    newIncidents +
    processedIncidents +
    pendingTelecomIncidents +
    pendingEtlIncidents;

  const systemViewStatCards = [
    {
      title: "New Incidents",
      value: newIncidents,
      color: "warning",
      filterStatus: INCIDENT_STATUS.NEW,
    },
    {
      title: "Processed",
      value: processedIncidents,
      color: "info",
      filterStatus: INCIDENT_STATUS.PROCESSED,
    },
    {
      title: "All Open",
      value: allOpenIncidents,
      color: "secondary",
      filterStatus: "open",
    },
    {
      title: "Resolved",
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

  const systemViewChartConfig = {
    layout: "2_over_1",
    barChartData: [
      { name: "New", count: newIncidents },
      { name: "Processed", count: processedIncidents },
      { name: "Pending", count: pendingTelecomIncidents + pendingEtlIncidents },
      { name: "Resolved", count: resolvedIncidents },
      { name: "Closed", count: closedIncidents },
    ],
    pieChartData: [
      {
        name: "High",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === "High" &&
            i.status !== INCIDENT_STATUS.CLOSED &&
            i.status !== INCIDENT_STATUS.RESOLVED
        ).length,
      },
      {
        name: "Medium",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === "Medium" &&
            i.status !== INCIDENT_STATUS.CLOSED &&
            i.status !== INCIDENT_STATUS.RESOLVED
        ).length,
      },
      {
        name: "Low",
        value: incidentsToDisplay.filter(
          (i) =>
            i.priority === "Low" &&
            i.status !== INCIDENT_STATUS.CLOSED &&
            i.status !== INCIDENT_STATUS.RESOLVED
        ).length,
      },
    ].filter((item) => item.value > 0),
    recentIncidents: incidentsToDisplay,
  };

  const generalViewChartConfig = {
    layout: "2x2",
    barChartData: systemViewChartConfig.barChartData,
    pieChartData: systemViewChartConfig.pieChartData,
    recentIncidents: incidentsToDisplay,
  };

  const getNumberVariant = (value) =>
    value.toString().length > 4 ? "h4" : "h3";

  const constructCardUrl = (status) => {
    const params = new URLSearchParams();
    params.append("status", status);
    if (category) params.append("category", category);
    if (shift !== "All") params.append("shift", shift);
    if (dateRange?.start) params.append("startDate", dateRange.start.toISO());
    if (dateRange?.end) params.append("endDate", dateRange.end.toISO());
    return `/search?${params.toString()}`;
  };

  const showTeamAvailability =
    user?.role === "admin" ||
    (user?.role === "sys_admin" && category === "general");

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ flexShrink: 0 }}>
            Dashboard
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {user?.role === "sys_admin" && (
            <ViewToggle
              selectedView={category}
              onChange={(newCategory) => {
                if (newCategory) {
                  setFilters((prev) => ({ ...prev, category: newCategory }));
                }
              }}
            />
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

      {showTeamAvailability ? (
        // --- GENERAL VIEW ---
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            {[
              {
                title: "New Incidents",
                value: newIncidents,
                color: "warning",
                filterStatus: INCIDENT_STATUS.NEW,
              },
              {
                title: "Processed",
                value: processedIncidents,
                color: "info",
                filterStatus: INCIDENT_STATUS.PROCESSED,
              },
              {
                title: "Resolved",
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
            ].map((card, index) => (
              <Box key={index} sx={{ flex: 1 }}>
                <Card elevation={3} sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() =>
                      router.push(constructCardUrl(card.filterStatus))
                    }
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
                        <CountUp
                          end={card.value}
                          duration={1.5}
                          separator=","
                        />
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            {[
              {
                title: "All Open",
                value: allOpenIncidents,
                color: "secondary",
                filterStatus: "open",
              },
              {
                title: "Pending Telecom",
                value: pendingTelecomIncidents,
                color: "primary",
                filterStatus: INCIDENT_STATUS.PENDING_TELECOM_ACTION,
              },
              {
                title: "Pending ETL",
                value: pendingEtlIncidents,
                color: "primary",
                filterStatus: INCIDENT_STATUS.PENDING_ETL,
              },
            ].map((card, index) => (
              <Box key={index} sx={{ flex: 1 }}>
                <Card elevation={3} sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() =>
                      router.push(constructCardUrl(card.filterStatus))
                    }
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
                        <CountUp
                          end={card.value}
                          duration={1.5}
                          separator=","
                        />
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Stack>

          {/* ✅ MODIFICATION: Pass new props to GenericDashboard */}
          <GenericDashboard
            chartLayoutConfig={generalViewChartConfig}
            userRole={user?.role}
            incidentTypeFilter={incidentTypeFilter}
          />
        </Stack>
      ) : (
        // --- SYSTEM VIEW ---
        // ✅ MODIFICATION: Pass new props to GenericDashboard
        <GenericDashboard
          statCards={systemViewStatCards}
          chartLayoutConfig={systemViewChartConfig}
          currentView={category}
          userRole={user?.role}
          incidentTypeFilter={incidentTypeFilter}
        />
      )}
    </Stack>
  );
}
