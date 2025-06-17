// File: components/IncidentDataGrid.jsx
// Optimized with React.memo to prevent unnecessary re-renders.
'use client';

// Import memo from React
import React, { memo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

// Define the columns for our Data Grid.
const columns = [
  { field: 'id', headerName: 'Incident No.', width: 130 },
  { field: 'incidentType', headerName: 'Incident Type', width: 200 },
  { field: 'location', headerName: 'Location', width: 250, flex: 1 },
  { field: 'requestor', headerName: 'Requestor', width: 200 },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 120,
    renderCell: (params) => {
      const priority = params.value;
      let color = 'default';
      if (priority === 'High') color = 'error';
      if (priority === 'Medium') color = 'warning';
      return <Chip label={priority} color={color} size="small" />;
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
        const status = params.value;
        let color = 'default';
        if (status === 'Resolved') color = 'success';
        if (status === 'Processed') color = 'info';
        if (status === 'Closed') color = 'primary';
        return <Chip label={status} color={color} size="small" />;
      },
  },
  { field: 'reportedOn', headerName: 'Reported On', width: 180 },
];

// The component function itself is unchanged.
function IncidentDataGrid({ rows, loading }) {
  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

// We export a memoized version of the component.
export default memo(IncidentDataGrid);