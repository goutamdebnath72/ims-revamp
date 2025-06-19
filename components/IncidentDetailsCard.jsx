// File: components/IncidentDetailsCard.jsx
// VERSION 2: Increased spacing and improved layout for the description field.
'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// A helper component for displaying a label and its value
function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" component="div">
        {value || 'N/A'}
      </Typography>
    </Box>
  );
}

export default function IncidentDetailsCard({ incident }) {
  if (!incident) {
    return null; // Don't render if there's no incident data
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Incident Details
      </Typography>
      <Divider sx={{ mb: 3 }}/>
      
      {/* Increased spacing from 2 to 3 */}
      <Grid container spacing={3} rowSpacing={2}>
        {/* -- TOP ROW -- */}
        <Grid item xs={12} sm={6} md={3}>
          <DetailItem label="Incident No." value={incident.id} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailItem label="Status" value={<Chip label={incident.status} color={incident.status === 'Resolved' ? 'success' : 'info'} size="small"/>} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailItem label="Priority" value={<Chip label={incident.priority} color={incident.priority === 'High' ? 'error' : 'warning'} size="small"/>} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailItem label="Incident Type" value={incident.incidentType} />
        </Grid>

        {/* -- JOB TITLE -- */}
        <Grid item xs={12}>
          <DetailItem label="Job Title" value={incident.jobTitle} />
        </Grid>

        {/* -- DESCRIPTION -- */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <DetailItem label="Description" value={incident.description} />
          <Divider sx={{ mt: 2 }} />
        </Grid>

        {/* -- BOTTOM ROWS -- */}
        <Grid item xs={12} sm={6}>
          <DetailItem label="Requestor" value={`${incident.requestor} (${incident.ticketNo})`} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailItem label="Department" value={incident.department} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailItem label="Location" value={incident.location} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailItem label="Contact" value={incident.contactNumber} />
        </Grid>
      </Grid>
    </Paper>
  );
}