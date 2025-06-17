// File: components/IncidentDataGrid.jsx
// A modular component for displaying incident search results.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

// Define the columns for our Data Grid.
// The 'field' property must match a key in our data rows.
const columns = [
  { field: 'id', headerName: 'Incident No.', width: 130 },
  { field: 'incidentType', headerName: 'Incident Type', width: 200 },
  { field: 'location', headerName: 'Location', width: 250, flex: 1 }, // flex: 1 allows this column to grow
  { field: 'requestor', headerName: 'Requestor', width: 200 },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 120,
    // We can use a 'renderCell' function to customize how the data is displayed.
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

// This component expects to receive the search result rows as a prop.
export default function IncidentDataGrid({ rows, loading }) {
  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading} // Pass the loading state to the grid
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