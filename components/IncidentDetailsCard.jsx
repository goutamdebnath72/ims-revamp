// File: components/IncidentDetailsCard.jsx
// UPDATED: Redesigned the 4th row into a visually distinct "fieldset".
'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

// Helper component for displaying a label and its value
function DetailItem({ label, value, component = "div" }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body1" component={component} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );
}

export default function IncidentDetailsCard({ incident }) {
  if (!incident) {
    return null;
  }

  const getStatusChipColor = (status) => {
    if (status === 'New') return 'success';
    if (status === 'Processed') return 'info';
    if (status === 'Resolved') return 'success';
    return 'default';
  };

  const getPriorityChipColor = (priority) => {
    if (priority === 'High') return 'error';
    if (priority === 'Medium') return 'warning';
    return 'default';
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Incident Details
      </Typography>
      <Divider sx={{ mb: 3 }}/>
      
      <Stack spacing={3}>

        {/* --- ROW 1: Key Info --- */}
        <Stack direction="row" spacing={2}>
          <DetailItem label="Incident No." value={incident.id} />
          <DetailItem label="Incident Type" value={incident.incidentType} />
          <DetailItem label="Priority" value={<Chip label={incident.priority} color={getPriorityChipColor(incident.priority)} size="small"/>} />
          <DetailItem label="Status" value={<Chip label={incident.status} color={getStatusChipColor(incident.status)} variant={incident.status === 'New' ? 'outlined' : 'filled'} size="small"/>} />
        </Stack>

        <Divider />

        {/* --- ROW 2: Job Title (Full Width) --- */}
        <Stack direction="row">
          <DetailItem label="Job Title" value={incident.jobTitle} />
        </Stack>
        
        <Divider />

        {/* --- ROW 3: Description (Full Width) --- */}
        <Stack direction="row">
          <DetailItem label="Description" value={incident.description} component="div" />
        </Stack>
        
        {/* --- ROW 4: Requestor Details (Styled as a Fieldset) --- */}
        <Box sx={{ position: 'relative', mt: 3, p: 2, pt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 'bold', 
              position: 'absolute', 
              top: 0, 
              left: 12, 
              transform: 'translateY(-50%)', 
              bgcolor: 'background.paper', 
              px: 1 
            }}
          >
            Requestor Information
          </Typography>
          <Stack direction="row" spacing={2}>
            <DetailItem label="Requestor" value={incident.ticketNo ? `${incident.requestor} (${incident.ticketNo})` : incident.requestor} />
            <DetailItem label="Department" value={incident.department} />
            <DetailItem label="Contact" value={incident.contactNumber} />
            <DetailItem label="Location" value={incident.location} />
          </Stack>
        </Box>

      </Stack>
    </Paper>
  );
}