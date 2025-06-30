// File: components/RaiseIncidentForm.jsx
// UPDATED: Added tooltips to Job Title and Description fields.
'use client';

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
import InfoTooltip from './InfoTooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { departments } from '@/lib/departments';
import { incidentTypes } from '@/lib/incident-types';

const priorities = ['Low', 'Medium', 'High'];

const contactTooltipText = (
    <Box>
        <Typography color="inherit" sx={{ fontWeight: 'bold' }}>Input Instructions</Typography>
        <ul style={{ paddingLeft: '20px', margin: '8px 0 0 0' }}>
            <li>For **Non- Executives**, please provide the 5-digit Department PAX No.</li>
            <li>For **Executives**, please provide your 10-digit CUG mobile number.</li>
        </ul>
    </Box>
);

// --- NEW: Tooltip content for Job Title ---
const jobTitleTooltipText = (
  <Typography color="inherit">
    Think of this as the <b>Subject Line</b> of an email. Provide a short, clear summary of the issue.
  </Typography>
);

// --- NEW: Tooltip content for Description ---
const descriptionTooltipText = (
  <Typography color="inherit">
    Think of this as the <b>Body</b> of an email. Provide all the details, error messages, and steps you've already tried.
  </Typography>
);

export default function RaiseIncidentForm({ onSubmit, isSubmitting }) {
  const { user } = React.useContext(UserContext);
  
  const isExecutive = user && user.ticketNo.startsWith('4');

  const [formData, setFormData] = React.useState({
    incidentType: '',
    priority: 'Medium',
    department: user ? user.departmentCode : '',
    location: '',
    contactNumber: '',
    jobTitle: '',
    description: '',
  });
  const [errors, setErrors] = React.useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
        case 'contactNumber':
            if (!value) {
                error = "Required.";
            } else if (isExecutive) {
                if (!/^943479\d{4}$/.test(value)) {
                    error = "Please enter a valid 10-digit CUG No. starting with 943479.";
                }
            } else {
                if (!/^\d{5}$/.test(value)) {
                    error = "Please enter a valid 5-digit PAX No.";
                }
            }
            break;
        case 'incidentType':
        case 'location':
        case 'description':
        case 'jobTitle':
        case 'department':
            if (!value) error = "Required.";
            break;
        default:
            break;
    }
    return error;
  };

  const handleBlur = (event) => {
      const { name, value } = event.target;
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: ""}));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
        }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>

        {/* --- ROW 1: Four side-by-side fields --- */}
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth required error={!!errors.incidentType}>
            <InputLabel>Incident Type</InputLabel>
            <Select name="incidentType" value={formData.incidentType} label="Incident Type" onChange={handleChange} onBlur={handleBlur}>
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
            <Select name="department" value={formData.department} label="Department" onChange={handleChange} onBlur={handleBlur}>
              {departments.map((dept) => (<MenuItem key={dept.code} value={dept.code}>{dept.name}</MenuItem>))}
            </Select>
            {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
          </FormControl>
          <TextField required fullWidth name="location" label="Location" value={formData.location} onChange={handleChange} onBlur={handleBlur} error={!!errors.location} helperText={errors.location || " "}/>
        </Stack>

        {/* --- ROW 2: Four side-by-side fields --- */}
        <Stack direction="row" spacing={2}>
          <InfoTooltip title={contactTooltipText} placement="top-start">
            <TextField 
                required 
                fullWidth 
                name="contactNumber" 
                label="Contact Number / PAX" 
                value={formData.contactNumber} 
                onChange={handleChange} 
                onBlur={handleBlur}
                error={!!errors.contactNumber} 
                helperText={errors.contactNumber || " "}
            />
          </InfoTooltip>
          <InfoTooltip title={jobTitleTooltipText} placement="top-start">
            <TextField required fullWidth name="jobTitle" label="Job Title" value={formData.jobTitle} onChange={handleChange} onBlur={handleBlur} error={!!errors.jobTitle} helperText={errors.jobTitle || " "}/>
          </InfoTooltip>
          <TextField fullWidth disabled label="Ticket No." value={user ? user.ticketNo : ''} />
          <TextField fullWidth disabled label="Requestor Name" value={user ? user.name : ''} />
        </Stack>

        {/* --- ROW 3: Description --- */}
        <InfoTooltip title={descriptionTooltipText} placement="top-start">
            <TextField required fullWidth multiline rows={5} name="description" label="Please provide a detailed description of the issue" value={formData.description} onChange={handleChange} onBlur={handleBlur} error={!!errors.description} helperText={errors.description || " "}/>
        </InfoTooltip>

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
              letterSpacing: '1.5px'
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