"use client";

import * as React from "react";
import {
  Box,
  CardActionArea,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

// Import all possible chart/card components
import StatusChart from "./StatusChart";
import PriorityChart from "./PriorityChart";
import RecentIncidentsCard from "./RecentIncidentsCard";
import TeamAvailabilityCard from "./TeamAvailabilityCard";

// Scrollbar style copied from AdminDashboard for consistency
const scrollableOnHoverStyles = {
  flexGrow: 1,
  overflowY: "auto",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: "4px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  "&:hover": {
    scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
  },
};

// Reusable StatCard component, unchanged
function StatCard({ title, value, color, onClick }) {
  const getNumberVariant = (val) => (val.toString().length > 4 ? "h4" : "h3");
  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent
          sx={{
            textAlign: "center",
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant={getNumberVariant(value)}
            component="div"
            color={`${color}.main`}
          >
            <CountUp end={value} duration={1.5} separator="," />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function GenericDashboard({
  statCards = [],
  chartLayoutConfig,
}) {
  const router = useRouter();
  const constructCardUrl = (status) => `/search?status=${status}`;

  const getChartComponent = (chartName) => {
    switch (chartName) {
      case "Bar Chart":
        return <StatusChart data={chartLayoutConfig.barChartData} />;
      case "Pie Chart":
        return <PriorityChart data={chartLayoutConfig.pieChartData} />;
      case "RA card":
        return (
          <RecentIncidentsCard incidents={chartLayoutConfig.recentIncidents} />
        );
      case "TA card":
        return <TeamAvailabilityCard />;
      default:
        return null;
    }
  };

  const renderChartCard = (chartName) => {
    const component = getChartComponent(chartName);
    if (chartName === "RA card" || chartName === "TA card") {
      return (
        <Card elevation={3} sx={{ height: "350px" }}>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Box sx={scrollableOnHoverStyles}>{component}</Box>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card elevation={3} sx={{ height: "350px" }}>
        {component}
      </Card>
    );
  };

  return (
    <Stack spacing={2}>
      {/* --- FIX: Conditionally render the stat card section --- */}
      {statCards && statCards.length > 0 && (
        <Stack direction="row" spacing={2}>
          {statCards.map((card) => (
            <Box key={card.title} sx={{ flex: 1 }}>
              <StatCard
                title={card.title}
                value={card.value}
                color={card.color || "primary"}
                onClick={() => router.push(constructCardUrl(card.filterStatus))}
              />
            </Box>
          ))}
        </Stack>
      )}

      {/* Section 2: Chart Layouts */}
      <Grid container>
        {/* Layout: 2x2 */}
        {chartLayoutConfig?.layout === "2x2" && (
          <>
            <Grid item xs={12} md={6} sx={{ pr: { md: 1 } }}>
              <Stack spacing={2}>
                {renderChartCard("Bar Chart")}
                {renderChartCard("RA card")}
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
            >
              <Stack spacing={2}>
                {renderChartCard("Pie Chart")}
                {renderChartCard("TA card")}
              </Stack>
            </Grid>
          </>
        )}

        {/* Layout: 2 over 1 */}
        {chartLayoutConfig?.layout === "2_over_1" && (
          <>
            <Grid item xs={12} md={6} sx={{ pr: { md: 1 } }}>
              <Stack spacing={2}>{renderChartCard("Bar Chart")}</Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
            >
              <Stack spacing={2}>{renderChartCard("Pie Chart")}</Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              {renderChartCard("RA card")}
            </Grid>
          </>
        )}

        {/* Layout: 1 Full Width */}
        {chartLayoutConfig?.layout === "1_full" && (
          <Grid item xs={12}>
            {renderChartCard("RA card")}
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
