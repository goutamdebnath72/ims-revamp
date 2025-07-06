'use client';

import React, { memo } from 'react';
import { UserContext } from '@/context/UserContext';
import { incidentTypes } from '@/lib/incident-types'; // Import the list of types
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const statuses = ['Any', 'New', 'Processed', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];
const allIncidentTypes = ['Any', ...incidentTypes];

function IncidentSearchForm({ onSearch, isLoading }) {
  const { user } = React.useContext(UserContext);

  const [criteria, setCriteria] = React.useState({
    incidentId: '',
    requestor: '',
    status: 'Any',
    priority: 'Any',
    incidentType: 'Any', // Add state for the new field
  });
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(criteria);
  };
  
  const isCnIT = user?.role === 'admin' || user?.role === 'sys_admin';

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack direction="row" spacing={2} alignItems="center">
        
        <Box sx={{ flex: 1 }}><TextField fullWidth label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" /></Box>
        
        {isCnIT && (
          <>
            <Box sx={{ flex: 1 }}>
              <Tooltip title="Search by Name, Ticket No, SAIL P.No, or CUG No." placement="top" arrow>
                <TextField 
                  fullWidth 
                  label="Requestor" 
                  name="requestor" 
                  value={criteria.requestor} 
                  onChange={handleChange} 
                  size="small"
                  InputProps={{
                    endAdornment: (<InfoOutlinedIcon color="action" sx={{ fontSize: 16 }} />)
                  }}
                />
              </Tooltip>
            </Box>
            {/* --- NEW "INCIDENT TYPE" FIELD --- */}
            <Box sx={{ flex: 1 }}>
              <TextField select fullWidth label="Incident Type" name="incidentType" value={criteria.incidentType} onChange={handleChange} size="small">
                {allIncidentTypes.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
              </TextField>
            </Box>
          </>
        )}

        <Box sx={{ flex: 1 }}><TextField select fullWidth label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
            {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
        </TextField></Box>

        <Box sx={{ flex: 1 }}><TextField select fullWidth label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
            {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
        </TextField></Box>
        
        <Box><Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px' }}>
            {isLoading ? 'Searching...' : 'Search'}
        </Button></Box>

      </Stack>
    </Box>
  );
}

export default memo(IncidentSearchForm);