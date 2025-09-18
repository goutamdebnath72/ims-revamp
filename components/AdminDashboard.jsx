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
  // CircularProgress is no longer needed here
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import CountUp from "react-countup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from "@mui/icons-material/Event";
import ReplayIcon from "@mui/icons-material/Replay";
import StatusChart from "@/components/StatusChart";
import PriorityChart from "@/components/PriorityChart";
import TeamAvailabilityCard from "@/components/TeamAvailabilityCard";
import ViewToggle from "@/components/ViewToggle";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { INCIDENT_STATUS } from "@/lib/constants";
// We are still using the old RecentIncidentsCard here from your file
import RecentIncidentsCard from "@/components/RecentIncidentsCard";

const scrollableOnHoverStyles = {
  // ... (this style object is correct and unchanged)
  flexGrow: 1,
  overflowY: "auto",
  scrollbarGutter: "stable",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
  },
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  // The 'isLoading' from the context is no longer needed here
  const { filters, setFilters, resetFilters, incidents, error } =
    React.useContext(DashboardFilterContext);
  // ... (all other constants and handlers are correct and unchanged) ...
  const { dateRange, shift, category } = filters;
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
  const primaryStatCards = [
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
  ];
  const secondaryStatCards = [
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
  ];
  const systemStatCards = [
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
  const constructCardUrl = (status) => {
    const params = new URLSearchParams();
    params.append("status", status);
    if (category) params.append("category", category);
    if (shift !== "All") params.append("shift", shift);
    if (dateRange?.start) params.append("startDate", dateRange.start.toISO());
    if (dateRange?.end) params.append("endDate", dateRange.end.toISO());
    return `/search?${params.toString()}`;
  };
  const statusChartData = [
    { name: "New", count: newIncidents },
    { name: "Processed", count: processedIncidents },
    { name: "Pending", count: pendingTelecomIncidents + pendingEtlIncidents },
    { name: "Resolved", count: resolvedIncidents },
    { name: "Closed", count: closedIncidents },
  ];
  const openIncidentsList = incidentsToDisplay.filter(
    (i) =>
      i.status === INCIDENT_STATUS.NEW ||
      i.status === INCIDENT_STATUS.PROCESSED ||
      i.status === INCIDENT_STATUS.PENDING_TELECOM_ACTION ||
      i.status === INCIDENT_STATUS.PENDING_ETL
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
  const showTeamAvailability =
    user?.role === "admin" ||
    (user?.role === "sys_admin" && category === "general");

  return (
    <Stack spacing={2}>
      {/* Filters and Menu components are unchanged */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
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

      {/* The position: "relative" is still needed for the stat cards section */}
      <Box sx={{ position: "relative" }}>
        {/* The opacity is no longer needed on the stat card stacks */}
        {showTeamAvailability ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              {primaryStatCards.map((card, index) => (
                <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
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
              {secondaryStatCards.map((card, index) => (
                <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
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
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            {systemStatCards.map((card, index) => (
              <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
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
        )}

        {/* === THE LOCAL OVERLAY IS REMOVED FROM HERE === */}
        {/* The global overlay in LoadingContext now handles this. */}
      </Box>

      {/* The rest of the dashboard layout (Grids, Charts, etc.) is correct and unchanged */}
      {showTeamAvailability ? (
        <Grid container>
          <Grid item xs={12} md={6} sx={{ pr: { md: 1 } }}>
            <Stack spacing={2}>
              <Card elevation={3} sx={{ height: "350px" }}>
                <StatusChart data={statusChartData} />
              </Card>
              <Card elevation={3} sx={{ height: "350px" }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Box sx={scrollableOnHoverStyles}>
                    <RecentIncidentsCard incidents={incidentsToDisplay} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
          >
            <Stack spacing={2}>
              <Card elevation={3} sx={{ height: "350px" }}>
                <PriorityChart
                  key={`${shift}-${String(dateRange.start)}-${String(
                    dateRange.end
                  )}`}
                  data={priorityChartData}
                  view={category}
                  dateRange={dateRange}
                  userRole={user?.role}
                  shift={shift}
                />
              </Card>
              <Card elevation={3} sx={{ height: "350px" }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Box sx={scrollableOnHoverStyles}>
                    <TeamAvailabilityCard />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        // System View Layout
        <Grid container>
          <Grid item xs={12} md={6} sx={{ pr: { md: 1 } }}>
            <Card elevation={3} sx={{ height: "350px" }}>
              <StatusChart data={statusChartData} />
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
          >
            <Card elevation={3} sx={{ height: "350px" }}>
              <PriorityChart
                key={`${shift}-${String(dateRange.start)}-${String(
                  dateRange.end
                )}`}
                data={priorityChartData}
                view={category}
                dateRange={dateRange}
                userRole={user?.role}
                shift={shift}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Card elevation={3} sx={{ height: "350px" }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Box sx={scrollableOnHoverStyles}>
                  <RecentIncidentsCard incidents={incidentsToDisplay} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
