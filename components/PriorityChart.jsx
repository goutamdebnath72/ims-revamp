// File: components/PriorityChart.jsx
// NEW: A reusable pie chart to display incidents by priority.
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const COLORS = {
    High: '#f44336', // error.main
    Medium: '#ed6c02', // warning.main
    Low: '#6c757d', // grey
};

export default function PriorityChart({ data }) {
  // Ensure we don't try to render a chart with no data
  const hasData = data.some(item => item.value > 0);

  return (
    <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
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
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">No open incidents in the selected date range.</Typography>
          </Box>
        )}
      </ResponsiveContainer>
    </Paper>
  );
}