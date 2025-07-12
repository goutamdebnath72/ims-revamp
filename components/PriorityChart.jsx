'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { formatISO } from 'date-fns';

const COLORS = { High: '#f44336', Medium: '#ed6c02', Low: '#6c757d' };

// UPDATED: Added 'shift' to the component's props
export default function PriorityChart({ data, view, dateRange, userRole, shift }) {
  const router = useRouter();
  const hasData = data.some(item => item.value > 0);

  const handlePieClick = (data) => {
    if (data && data.name) {
      const category = userRole === 'sys_admin' ? view : 'general';
      const params = new URLSearchParams();
      params.append('priority', data.name);
      params.append('category', category);
      params.append('status', 'open'); // Ensure we are searching for open incidents

      // UPDATED: Add the shift parameter to the URL if it is active
      if (shift && shift !== 'All') {
        params.append('shift', shift);
      }

      if (dateRange.start) {
        params.append('startDate', formatISO(dateRange.start, { representation: 'date' }));
      }
      if (dateRange.end) {
        params.append('endDate', formatISO(dateRange.end, { representation: 'date' }));
      }
      router.push(`/search?${params.toString()}`);
    }
  };

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
              onClick={handlePieClick}
            >
              {data.map((entry, index) => (
                 <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name]} 
                  stroke={'#FFFFFF'}
                  strokeWidth={3}
                  style={{ cursor: 'pointer' }} 
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">No open incidents to display.</Typography>
          </Box>
        )}
      </ResponsiveContainer>
    </Paper>
  );
}