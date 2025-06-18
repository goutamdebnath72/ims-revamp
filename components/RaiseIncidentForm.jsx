// File: components/RaiseIncidentForm.jsx
// Version: FINAL - 19 June 2025, 9:20 PM
// This version adds letter-spacing to the submit button for a more refined look.
'use client';

import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack'; // Using Stack (which is Flexbox) for layout
import { departments } from '@/lib/departments';
import { incidentTypes } from '@/lib/incident-types';

const priorities = ['Low', 'Medium', 'High'];

export default function RaiseIncidentForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = React.useState({
    incidentType: '',
    priority: 'Medium',
    department: 98540,
    location: '',
    contactNumber: '',
    jobTitle: '',
    description: '',
  });
  const [errors, setErrors] = React.useState({});

  const userDetails = {
      ticketNo: '342461',
      name: 'Goutam Debnath'
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.incidentType) tempErrors.incidentType = "Required.";
    if (!formData.location) tempErrors.location = "Required.";
    if (!formData.contactNumber) tempErrors.contactNumber = "Required.";
    if (!formData.description) tempErrors.description = "Required.";
    if (!formData.jobTitle) tempErrors.jobTitle = "Required.";
    if (!formData.department) tempErrors.department = "Required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      const finalData = { ...formData, ...userDetails };
      onSubmit(finalData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>

        {/* --- ROW 1: Four side-by-side fields --- */}
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth required error={!!errors.incidentType}>
            <InputLabel>Incident Type</InputLabel>
            <Select name="incidentType" value={formData.incidentType} label="Incident Type" onChange={handleChange}>
              {incidentTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
            </Select>
            {errors.incidentType && <FormHelperText>{errors.incidentType}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} label="Priority" onChange={handleChange}>
              {priorities.map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
            </Select>
          </FormControl>
           <FormControl fullWidth required error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select name="department" value={formData.department} label="Department" onChange={handleChange}>
              {departments.map((dept) => (<MenuItem key={dept.code} value={dept.code}>{dept.name}</MenuItem>))}
            </Select>
             {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
          </FormControl>
          <TextField required fullWidth name="location" label="Location" value={formData.location} onChange={handleChange} error={!!errors.location} helperText={errors.location || " "}/>
        </Stack>

        {/* --- ROW 2: Four side-by-side fields --- */}
        <Stack direction="row" spacing={2}>
          <TextField required fullWidth name="contactNumber" label="Contact Number / PAX" value={formData.contactNumber} onChange={handleChange} error={!!errors.contactNumber} helperText={errors.contactNumber || " "}/>
          <TextField required fullWidth name="jobTitle" label="Job Title" value={formData.jobTitle} onChange={handleChange} error={!!errors.jobTitle} helperText={errors.jobTitle || " "}/>
          <TextField fullWidth disabled label="Ticket No." defaultValue={userDetails.ticketNo} />
          <TextField fullWidth disabled label="Requestor Name" defaultValue={userDetails.name} />
        </Stack>

        {/* --- ROW 3: Description --- */}
        <TextField required fullWidth multiline rows={5} name="description" label="Please provide a detailed description of the issue" value={formData.description} onChange={handleChange} error={!!errors.description} helperText={errors.description || " "}/>

        {/* --- ROW 4: Submit Button --- */}
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={isSubmitting}
            fullWidth
            sx={{ 
              py: 1.5, 
              fontSize: '1.1rem',
              letterSpacing: '1.5px' // <-- THE ADDED STYLE
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Incident'}
          </Button>
          {isSubmitting && (
            <CircularProgress size={24} sx={{ color: 'primary.contrastText', position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>
          )}
        </Box>
        
      </Stack>
    </Box>
  );
}