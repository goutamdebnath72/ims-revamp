'use client';

import React, { memo } from 'react';
import { UserContext } from '@/context/UserContext';
import { incidentTypes } from '@/lib/incident-types';
// --- FIX: Importing the departments list directly from the correct file ---
import { departments } from '@/lib/departments.js';
import { isSystemIncident } from '@/lib/incident-helpers';
import { Box, Stack, TextField, Button, MenuItem, Tooltip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const statuses = ['Any', 'New', 'Processed', 'open', 'Resolved', 'Closed'];
const priorities = ['Any', 'Low', 'Medium', 'High'];
const categories = ['Any', 'System', 'General'];

// --- FIX: The hardcoded list has been removed ---

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {/* --- Row 1 --- */}
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" />
            
            {isCnIT && (
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
            )}

            {isCnIT && (
              // --- FIX: Dropdown now uses the imported departments list ---
              <TextField select fullWidth label="Department" name="department" value={criteria.department} onChange={handleChange} size="small">
                <MenuItem key="any-dept" value="Any">Any</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            
            <TextField select fullWidth label="Incident Type" name="incidentType" value={criteria.incidentType} onChange={handleChange} size="small">
              {filteredIncidentTypes.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
          </Stack>

          {/* --- Row 2 --- */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField select sx={{minWidth: 150}} label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
              {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            
            <TextField select sx={{minWidth: 150}} label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
              {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>

            {isCnIT && (
              <>
                {user.role === 'sys_admin' && (
                  <TextField select sx={{minWidth: 150}} label="Category" name="category" value={criteria.category} onChange={handleChange} size="small">
                    {categories.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                  </TextField>
                )}
                <DatePicker label="Start Date" value={criteria.dateRange.start} onChange={(val) => handleDateChange('start', val)} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                <DatePicker label="End Date" value={criteria.dateRange.end} onChange={(val) => handleDateChange('end', val)} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                
                <Tooltip title="By default, search is limited to the last 30 days." placement="top" arrow>
                    <IconButton size="small">
                        <InfoOutlinedIcon color="action" fontSize="small" />
                    </IconButton>
                </Tooltip>
              </>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px', width: '120px' }}>
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

export default memo(IncidentSearchForm);