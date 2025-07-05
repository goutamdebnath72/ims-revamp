'use client';

import React, { memo } from 'react';
import { UserContext } from '@/context/UserContext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'; // Using Stack for a more direct flexbox layout
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';

const statuses = ['Any', 'New', 'Processed', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];

function IncidentSearchForm({ onSearch, isLoading }) {
  const { user } = React.useContext(UserContext);

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
  
  const isAdmin = user?.role === 'admin' || user?.role === 'sys_admin';

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* --- LAYOUT FIX V3: Using Stack with Flexbox for guaranteed equal widths --- */}
      <Stack direction="row" spacing={2} alignItems="center">
        
        <Box sx={{ flex: 1 }}>
          <TextField fullWidth label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" />
        </Box>
        
        {isAdmin && (
          <Box sx={{ flex: 1 }}>
            <TextField fullWidth label="Requestor Name/ID" name="requestor" value={criteria.requestor} onChange={handleChange} size="small" />
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <TextField select fullWidth label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
            {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </TextField>
        </Box>

        <Box sx={{ flex: 1 }}>
          <TextField select fullWidth label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
            {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </TextField>
        </Box>
        
        <Box>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px' }}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

      </Stack>
    </Box>
  );
}

export default memo(IncidentSearchForm);