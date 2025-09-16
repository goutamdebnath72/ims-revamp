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
  CircularProgress,
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
import RecentIncidentsCard from "@/components/RecentIncidentsCard";
import ViewToggle from "@/components/ViewToggle";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { INCIDENT_STATUS } from "@/lib/constants";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { filters, setFilters, resetFilters, incidents, isLoading, error } =
    React.useContext(DashboardFilterContext);

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

      <Box sx={{ position: "relative" }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {primaryStatCards.map((card, index) => (
              <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
                <Card elevation={3} sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() =>
                      router.push(constructCardUrl(card.filterStatus))
                    }
                    sx={{ height: "100%" }}
                    disabled={isLoading}
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
          <Stack
            direction="row"
            spacing={2}
            sx={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {secondaryStatCards.map((card, index) => (
              <Box key={index} sx={{ flex: 1, textDecoration: "none" }}>
                <Card elevation={3} sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() =>
                      router.push(constructCardUrl(card.filterStatus))
                    }
                    sx={{ height: "100%" }}
                    disabled={isLoading}
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
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {showTeamAvailability ? (
        <Grid container>
          <Grid item xs={12} md={6} sx={{ pr: { md: 1 } }}>
            <Stack spacing={2}>
              <Card
                elevation={3}
                sx={{
                  aspectRatio: "16 / 10",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <StatusChart data={statusChartData} />
              </Card>
              <Card
                elevation={3}
                sx={{
                  aspectRatio: "16 / 10",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    minHeight: 0,
                  }}
                >
                  <Box sx={{ flexGrow: 1, overflow: "auto" }}>
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
              <Card
                elevation={3}
                sx={{
                  aspectRatio: "16 / 10",
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
                  view={category}
                  dateRange={dateRange}
                  userRole={user?.role}
                  shift={shift}
                />
              </Card>
              <Card
                elevation={3}
                sx={{
                  aspectRatio: "16 / 10",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    minHeight: 0,
                  }}
                >
                  <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                    <TeamAvailabilityCard />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={12} md={7} sx={{ pr: { md: 1 } }}>
            <Card
              elevation={3}
              sx={{
                aspectRatio: "16 / 10",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <StatusChart data={statusChartData} />
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
          >
            <Card
              elevation={3}
              sx={{
                aspectRatio: "16 / 10",
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
                view={category}
                dateRange={dateRange}
                userRole={user?.role}
                shift={shift}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <RecentIncidentsCard incidents={incidentsToDisplay} />
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
