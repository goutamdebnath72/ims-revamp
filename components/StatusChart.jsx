"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

export default function StatusChart({ data }) {
  return (
    <Paper elevation={0} sx={{ p: 3, height: "350px" }}>
      <Typography variant="h6" gutterBottom>
        Incidents by Status
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis
            allowDecimals={false}
            fontSize={12}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip cursor={false} />
          <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
          <Bar dataKey="count" name="Total Incidents" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
