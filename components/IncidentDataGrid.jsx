// File: components/IncidentDataGrid.jsx
// UPDATED: Simplified statuses and applied high-contrast background colors.
'use client';

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

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
        // Simplified status colors for high contrast
        if (status === 'New') color = 'success';
        if (status === 'Processed') color = 'primary'; // Using blue for 'Processed'
        if (status === 'Resolved') color = 'success'; // Keeping solid green for 'Resolved'
        
        // Use 'filled' variant for all to have solid backgrounds, except for 'New'
        const variant = status === 'New' ? 'outlined' : 'filled';
        
        // For 'Resolved', use a lighter text color for better contrast
        const chipStyles = status === 'Resolved' ? { color: '#fff' } : {};

        return <Chip label={status} color={color} size="small" variant={variant} sx={chipStyles} />;
    },
  },
  { field: 'reportedOn', headerName: 'Reported On', width: 180 },
];

function IncidentDataGrid({ rows, loading }) {
  const router = useRouter();

  const handleRowClick = (params) => {
    const incidentId = params.row.id;
    router.push(`/incidents/${incidentId}`);
  };

  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        sx={{
            '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
            },
        }}
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

export default memo(IncidentDataGrid);