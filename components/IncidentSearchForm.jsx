'use client';

import React, { memo } from 'react';
import { UserContext } from '@/context/UserContext';
import { incidentTypes } from '@/lib/incident-types';
import { isSystemIncident } from '@/lib/incident-helpers';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { Box, Stack, TextField, Button, MenuItem, Tooltip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const statuses = ['Any', 'New', 'Processed', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];
const categories = ['Any', 'System', 'General'];

function IncidentSearchForm({ criteria, onCriteriaChange, onSearch, isLoading }) {
  const { user } = React.useContext(UserContext);

  const filteredIncidentTypes = React.useMemo(() => {
    if (user?.role === 'sys_admin') {
      return ['Any', ...incidentTypes];
    }
    if (user?.role === 'admin') {
      const generalTypes = incidentTypes.filter(type => !isSystemIncident({ incidentType: type }));
      return ['Any', ...generalTypes];
    }
    // Default for standard users is to see all types
    return ['Any', ...incidentTypes];
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    onCriteriaChange({ ...criteria, [name]: value });
  };
  
  const handleDateChange = (field, newValue) => {
    onCriteriaChange({
        ...criteria,
        dateRange: { ...criteria.dateRange, [field]: newValue }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(criteria);
  };

  const isCnIT = user?.role === 'admin' || user?.role === 'sys_admin';

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}><TextField fullWidth label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" /></Box>
            
            {isCnIT && (
                <Box sx={{ flex: 1 }}>
                    <Tooltip title="Search by Name, Ticket No, SAIL P.No, or CUG No." placement="top" arrow>
                        <TextField 
                          fullWidth 
                          label="Requestor" 
                          name="requestor" 
                          value={criteria.requestor} 
                          onChange={handleChange} 
                          size="small"
                          InputProps={{ endAdornment: (<InfoOutlinedIcon color="action" sx={{ fontSize: 16 }} />) }}
                        />
                    </Tooltip>
                </Box>
            )}

            {/* --- FIX: "Incident Type" dropdown is now visible to all users --- */}
            <Box sx={{ flex: 1 }}>
                <TextField select fullWidth label="Incident Type" name="incidentType" value={criteria.incidentType} onChange={handleChange} size="small">
                    {filteredIncidentTypes.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                </TextField>
            </Box>

            <Box sx={{ flex: 1 }}><TextField select fullWidth label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
                {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField></Box>

            <Box sx={{ flex: 1 }}><TextField select fullWidth label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
                {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField></Box>
        </Stack>

        {isCnIT && (
            <Stack direction="row" spacing={2} alignItems="center">
                {user.role === 'sys_admin' && (
                    <Box sx={{ flex: 1 }}>
                        <TextField select fullWidth label="Category" name="category" value={criteria.category} onChange={handleChange} size="small">
                            {categories.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                        </TextField>
                    </Box>
                )}
                
                <Box sx={{ flex: 1 }}>
                    <DatePicker label="Start Date" value={criteria.dateRange.start} onChange={(val) => handleDateChange('start', val)} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <DatePicker label="End Date" value={criteria.dateRange.end} onChange={(val) => handleDateChange('end', val)} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                    <Tooltip title="By default, search is limited to the last 30 days." placement="top" arrow>
                        <IconButton size="small" sx={{ ml: 0.5 }}>
                            <InfoOutlinedIcon color="action" fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
        )}
        
        <Box sx={{ alignSelf: 'flex-end' }}>
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px' }}>
                {isLoading ? 'Searching...' : 'Search'}
            </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default memo(IncidentSearchForm);