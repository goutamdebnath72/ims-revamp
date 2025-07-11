'use client';

import React, { memo } from 'react';
import { useSession } from 'next-auth/react';
import { incidentTypes } from '@/lib/incident-types';
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

function IncidentSearchForm({ criteria, onCriteriaChange, onSearch, isLoading }) {
  const { data: session } = useSession();
  const user = session?.user;

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
        
        {isCnIT ? (
          // LAYOUT FOR ADMIN & SYS_ADMIN USERS (2-Row Structure)
          <Stack spacing={2}>
            {/* --- Row 1 --- */}
            <Stack direction="row" spacing={2}>
              <TextField sx={{ flex: 1 }} label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" />
              <Tooltip title="Search by Name, Ticket No, SAIL P.No, or CUG No." placement="top" arrow>
                <TextField 
                  sx={{ flex: 1 }}
                  label="Requestor" 
                  name="requestor" 
                  value={criteria.requestor} 
                  onChange={handleChange} 
                  size="small"
                  InputProps={{ endAdornment: (<InfoOutlinedIcon color="action" sx={{ fontSize: 16 }} />) }}
                />
              </Tooltip>
              <TextField select sx={{ flex: 1 }} label="Department" name="department" value={criteria.department} onChange={handleChange} size="small">
                <MenuItem key="any-dept" value="Any">Any</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select sx={{ flex: 1 }} label="Incident Type" name="incidentType" value={criteria.incidentType} onChange={handleChange} size="small">
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
              {user?.role === 'sys_admin' && (
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
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px', width: '120px' }}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </Box>
            </Stack>
          </Stack>
        ) : (
          // LAYOUT FOR NON-C&IT USERS (Clean Single-Row Structure)
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField sx={{ flex: '2 1 200px' }} label="Incident ID" name="incidentId" value={criteria.incidentId} onChange={handleChange} size="small" />
            <TextField select sx={{ flex: '2 1 200px' }} label="Incident Type" name="incidentType" value={criteria.incidentType} onChange={handleChange} size="small">
              {filteredIncidentTypes.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <TextField select sx={{ flex: '1 1 150px', minWidth: 120 }} label="Status" name="status" value={criteria.status} onChange={handleChange} size="small">
              {statuses.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <TextField select sx={{ flex: '1 1 150px', minWidth: 120 }} label="Priority" name="priority" value={criteria.priority} onChange={handleChange} size="small">
              {priorities.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large" disabled={isLoading} sx={{ height: '40px' }}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Stack>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default memo(IncidentSearchForm);