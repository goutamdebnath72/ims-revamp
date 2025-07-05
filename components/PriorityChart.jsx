'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const COLORS = {
    High: '#f44336', // error.main
    Medium: '#ed6c02', // warning.main
    Low: '#6c757d', // grey
};

export default function PriorityChart({ data }) {
  const router = useRouter();
  const hasData = data.some(item => item.value > 0);

  const handlePieClick = (data) => {
    if (data && data.name) {
      router.push(`/search?priority=${data.name}`);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '400px',
      }}
    >
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
              onClick={handlePieClick}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name]} 
                  stroke={'#FFFFFF'}
                  // --- GAP & VISUAL FIXES ---
                  strokeWidth={3} // Increased gap for better visual separation
                  style={{ cursor: 'pointer' }} 
                  // This event handler prevents the default browser focus rectangle on click
                  onMouseDown={(e) => e.preventDefault()}
                />
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