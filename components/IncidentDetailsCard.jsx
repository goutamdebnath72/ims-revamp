// File: components/IncidentDetailsCard.jsx
// UPDATED: Re-architected with a robust Stack (Flexbox) layout to permanently fix all alignment issues.
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
    // Box now has a defined width of 25% within its row Stack
    <Box sx={{ width: '25%', minWidth: 0, pr: 2 }}>
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

  // Combine requestor details for display, handling potentially missing data
  const requestorName = incident.requestor || "N/A";
  const requestorTicketNo = incident.ticketNo || "N/A";
  const requestorDesignation = incident.designation || "N/A";
  const requestorSailPNo = incident.sailPNo || "N/A";
  const requestorMailId = incident.mailId || "N/A";
  const requestorDepartment = incident.department || "N/A";
  const requestorContact = incident.contactNumber || "N/A";
  const requestorLocation = incident.location || "N/A";


  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Incident Details
      </Typography>
      <Divider sx={{ mb: 3 }}/>
      
      {/* Main vertical Stack to hold all rows */}
      <Stack spacing={2.5}>

        {/* --- ROW 1: Key Info --- */}
        <Stack direction="row">
          <DetailItem label="Incident No." value={incident.id} />
          <DetailItem label="Incident Type" value={incident.incidentType} />
          <DetailItem label="Priority" value={<Chip label={incident.priority} color={getPriorityChipColor(incident.priority)} size="small"/>} />
          <DetailItem label="Status" value={<Chip label={incident.status} color={getStatusChipColor(incident.status)} variant={incident.status === 'New' ? 'outlined' : 'filled'} size="small"/>} />
        </Stack>

        <Divider />

        {/* --- ROW 2: Job Title (Full Width) --- */}
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                Job Title
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {incident.jobTitle || 'N/A'}
            </Typography>
        </Box>
        
        <Divider />

        {/* --- ROW 3: Description (Full Width) --- */}
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                Description
            </Typography>
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {incident.description || 'N/A'}
            </Typography>
        </Box>
        
        {/* --- "REQUESTOR INFORMATION" FIELDSET --- */}
        <Box sx={{ position: 'relative', mt: '32px !important', p: 2, pt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ fontWeight: 'bold', position: 'absolute', top: 0, left: 12, transform: 'translateY(-50%)', bgcolor: 'background.paper', px: 1 }}
          >
            Requestor Information
          </Typography>
          
          <Stack spacing={2}>
              {/* --- Sub-Row 1 --- */}
              <Stack direction="row">
                <DetailItem label="Requestor" value={requestorName} />
                <DetailItem label="Designation" value={requestorDesignation} />
                <DetailItem label="Ticket No." value={requestorTicketNo} />
                <DetailItem label="SAIL P. No." value={requestorSailPNo} />
              </Stack>

              <Divider />
              
              {/* --- Sub-Row 2 --- */}
              <Stack direction="row">
                <DetailItem label="Mail ID" value={requestorMailId} />
                {/* For the middle item, we give it 50% width to center it */}
                <Box sx={{ width: '50%', minWidth: 0, pr: 2 }}> 
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                        Department
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {requestorDepartment}
                    </Typography>
                </Box>
                {/* The Contact field is pushed to the end */}
                <DetailItem label="Contact" value={requestorContact} />
              </Stack>

              <Divider />

              {/* --- Sub-Row 3 --- */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                    Location
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {requestorLocation}
                </Typography>
              </Box>
          </Stack>
        </Box>

      </Stack>
    </Paper>
  );
}