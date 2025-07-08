'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

function DetailItem({ label, value, component = "div" }) {
  //... (this helper component is unchanged)
  return (
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

  // --- DEBUGGING LOG ---
  // This will print the exact data object to your browser's console.
  console.log('%c[DEBUG] Data received by IncidentDetailsCard:', 'color: #8A2BE2; font-weight: bold;', incident);
  console.log('--- Checking for new fields: ---');
  console.log(`  - Has 'emailSail' field? -> ${incident.hasOwnProperty('emailSail')}`);
  console.log(`  - Has 'emailNic' field? -> ${incident.hasOwnProperty('emailNic')}`);
  console.log(`  - Has 'ipAddress' field? -> ${incident.hasOwnProperty('ipAddress')}`);
  console.log(`  - Has 'jobFrom' field? -> ${incident.hasOwnProperty('jobFrom')}`);
  // --- END DEBUGGING LOG ---

  const getStatusChipColor = (status) => { /* ... */ };
  const getPriorityChipColor = (priority) => { /* ... */ };

  const displayEmailSail = incident.emailSail?.endsWith('@saildsp.co.in') ? incident.emailSail : 'N/A';
  const displayEmailNic = incident.emailNic?.endsWith('@sail.in') ? incident.emailNic : 'N/A';
  const ipAddress = incident.ipAddress || "N/A";
  const jobFrom = incident.jobFrom || "N/A";

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        Incident Details
      </Typography>
      <Divider sx={{ mb: 3 }}/>
      
      <Box sx={{ overflowY: 'auto', pr: 2 }}>
        <Stack spacing={2.5}>
          <Stack direction="row">
            <DetailItem label="Incident No." value={incident.id} />
            <DetailItem label="Incident Type" value={incident.incidentType} />
            <DetailItem label="Priority" value={<Chip label={incident.priority} color={getPriorityChipColor(incident.priority)} size="small"/>} />
            <DetailItem label="Status" value={<Chip label={incident.status} color={getStatusChipColor(incident.status)} variant={incident.status === 'New' ? 'outlined' : 'filled'} size="small"/>} />
          </Stack>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                Job Title
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {incident.jobTitle || 'N/A'}
            </Typography>
          </Box>
          <Divider />
          <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
                  Description
              </Typography>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {incident.description || 'N/A'}
              </Typography>
          </Box>
          <Box sx={{ position: 'relative', mt: '32px !important', p: 2, pt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', position: 'absolute', top: 0, left: 12, transform: 'translateY(-50%)', bgcolor: 'background.paper', px: 1 }}>
              Requestor Information
            </Typography>
            <Stack spacing={2.5}>
                <Stack direction="row">
                  <DetailItem label="Requestor" value={incident.requestor} />
                  <DetailItem label="Ticket No." value={incident.ticketNo} />
                  <DetailItem label="Department" value={incident.department} />
                  <DetailItem label="Contact No." value={incident.contactNumber} />
                </Stack>
                <Divider />
                <Stack direction="row">
                  <DetailItem label="Email ID" value={displayEmailSail} />
                  <DetailItem label="Email ID (NIC)" value={displayEmailNic} />
                  <DetailItem label="SAIL P/No" value={incident.sailPNo} />
                  <DetailItem label="Location" value={incident.location} />
                </Stack>
                <Divider />
                <Stack direction="row">
                    <DetailItem label="IP Address" value={ipAddress} />
                    <DetailItem label="Job From" value={jobFrom} />
                </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}