// File: components/IncidentSearchForm.jsx
// This version adds the missing import for the Box component.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box'; // <-- THE MISSING IMPORT IS ADDED HERE
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';

// Mock data for dropdowns
const statuses = ['Any', 'New', 'Processed', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];

export default function IncidentSearchForm({ onSearch }) {
  // We use state to hold the values of the form fields
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
    event.preventDefault(); // Prevent default form submission
    onSearch(criteria); // Pass the criteria up to the parent page
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Incident ID"
            name="incidentId"
            value={criteria.incidentId}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Requestor Name/ID"
            name="requestor"
            value={criteria.requestor}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={criteria.status}
            onChange={handleChange}
            size="small"
          >
            {statuses.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            label="Priority"
            name="priority"
            value={criteria.priority}
            onChange={handleChange}
            size="small"
          >
            {priorities.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}