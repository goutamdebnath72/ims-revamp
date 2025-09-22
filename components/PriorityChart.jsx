"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const COLORS = { High: "#f44336", Medium: "#ed6c02", Low: "#6c757d" };

export default function PriorityChart({
  data,
  view,
  dateRange,
  userRole,
  shift,
  incidentTypeFilter,
}) {
  const router = useRouter();
  const hasData = data.some((item) => item.value > 0);

  // --- START: DYNAMIC RADIUS LOGIC ---
  const [radius, setRadius] = React.useState(100);

  React.useEffect(() => {
    const handleResize = () => {
      // Set a larger radius for screens 1800px or wider
      if (window.innerWidth >= 1800) {
        setRadius(110);
      } else {
        setRadius(100);
      }
    };

    // Set initial size on component mount
    handleResize();

    // Add event listener to adjust on window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs only once on mount
  // --- END: DYNAMIC RADIUS LOGIC ---

  const handlePieClick = (data) => {
    if (data && data.name) {
      const category = userRole === "sys_admin" ? view : "general";
      const params = new URLSearchParams();
      params.append("priority", data.name);
      params.append("category", category);
      params.append("status", "open");
      if (incidentTypeFilter) {
        params.append("incidentType", incidentTypeFilter);
      }
      if (shift && shift !== "All") {
        params.append("shift", shift);
      }
      if (dateRange.start) {
        params.append("startDate", dateRange.start.toISO());
      }
      if (dateRange.end) {
        params.append("endDate", dateRange.end.toISO());
      }
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, height: "350px" }}>
      <Typography variant="h6" gutterBottom>
        Open Incidents by Priority
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        {hasData ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={radius} // Use the dynamic radius state
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={(entry) => `${entry.name}: ${entry.value}`}
              onClick={handlePieClick}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name]}
                  stroke={"#FFFFFF"}
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
          </PieChart>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography color="text.secondary">
              No open incidents to display.
            </Typography>
          </Box>
        )}
      </ResponsiveContainer>
    </Paper>
  );
}
