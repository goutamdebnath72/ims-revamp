// File: components/IncidentSearchForm.jsx
// UPDATED: Added 'Closed' back to the list of statuses in the dropdown filter.
'use client';

import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';

// --- THIS IS THE FIX: The 'Closed' status is now included in this array ---
const statuses = ['Any', 'New', 'Processed', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];

function IncidentSearchForm({ onSearch, isLoading }) {
  const [criteria, setCriteria] = React.useState({
    incidentId: '',
    requestor: '',
    status: 'Any',
    priority: 'Any'
  });
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(criteria);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth label="Requestor Name/ID" name="requestor" value={criteria.requestor} onChange={handleChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField select fullWidth label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
            {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField select fullWidth label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
            {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button type="submit" variant="contained" fullWidth startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px' }}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(IncidentSearchForm);