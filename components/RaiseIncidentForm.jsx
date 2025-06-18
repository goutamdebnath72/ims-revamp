'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

import { departments } from '@/lib/departments';
import { incidentTypes } from '@/lib/incident-types';

const priorities = ['Low', 'Medium', 'High'];

export default function RaiseIncidentForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = React.useState({
    incidentType: '',
    priority: 'Medium',
    department: '',
    location: '',
    contactNumber: '',
    jobTitle: '',
    description: '',
  });

  const [errors, setErrors] = React.useState({});

  const userDetails = {
    ticketNo: '342461',
    name: 'Goutam Debnath',
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.incidentType) tempErrors.incidentType = "Required.";
    if (!formData.priority) tempErrors.priority = "Required.";
    if (!formData.department) tempErrors.department = "Required.";
    if (!formData.location) tempErrors.location = "Required.";
    if (!formData.contactNumber) tempErrors.contactNumber = "Required.";
    if (!formData.jobTitle) tempErrors.jobTitle = "Required.";
    if (!formData.description) tempErrors.description = "Required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      const finalData = { ...formData, ...userDetails };
      onSubmit(finalData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>

      {/* === ROW 1 === */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth required error={!!errors.incidentType}>
            <InputLabel>Incident Type</InputLabel>
            <Select name="incidentType" value={formData.incidentType} onChange={handleChange} label="Incident Type">
              {incidentTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.incidentType && <FormHelperText>{errors.incidentType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth required error={!!errors.priority}>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} onChange={handleChange} label="Priority">
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
            {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth required error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select name="department" value={formData.department} onChange={handleChange} label="Department">
              {departments.map((dept) => (
                <MenuItem key={dept.code} value={dept.code}>{dept.name}</MenuItem>
              ))}
            </Select>
            {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required fullWidth name="location" label="Location"
            value={formData.location} onChange={handleChange}
            error={!!errors.location} helperText={errors.location || " "}
          />
        </Grid>
      </Grid>

      {/* === ROW 2 === */}
      <Grid container spacing={2} sx={{ width: '100%', mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required fullWidth name="contactNumber" label="Contact Number"
            value={formData.contactNumber} onChange={handleChange}
            error={!!errors.contactNumber} helperText={errors.contactNumber || " "}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required fullWidth name="jobTitle" label="Job Title"
            value={formData.jobTitle} onChange={handleChange}
            error={!!errors.jobTitle} helperText={errors.jobTitle || " "}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth disabled label="Ticket No." defaultValue={userDetails.ticketNo} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth disabled label="Requestor Name" defaultValue={userDetails.name} />
        </Grid>
      </Grid>

      {/* === ROW 3 === */}
      <Grid container spacing={2} sx={{ width: '100%', mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            required fullWidth multiline rows={5}
            name="description" label="Please provide a detailed description of the issue"
            value={formData.description} onChange={handleChange}
            error={!!errors.description} helperText={errors.description || " "}
          />
        </Grid>
      </Grid>

      {/* === ROW 4 === */}
      <Grid container spacing={2} sx={{ width: '100%', mt: 1 }}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={isSubmitting}
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Incident'}
            </Button>
            {isSubmitting && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.contrastText',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
}