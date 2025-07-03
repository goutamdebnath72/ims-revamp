// File: app/(main)/page.jsx
// UPDATED: Replaced the premium 'DateRangePicker' with the standard 'DatePicker' components.
"use client";

import * as React from 'react';
import { IncidentContext } from '@/context/IncidentContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Chip, Stack, Button, Menu, MenuItem, Divider, Box } from '@mui/material';
import CountUp from 'react-countup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // <-- Use the standard DatePicker
import { startOfWeek, startOfMonth, endOfDay, format, isWithinInterval, parse, isValid } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';

const recentIncidentsData = [
  { id: '10001', title: 'Network Down in Admin Building', priority: 'High', status: 'Processed' },
  { id: '10002', title: 'Email Not Working for Mr. Debnath', priority: 'High', status: 'Processed' },
  { id: '10003', title: 'Software Install Request: VS Code', priority: 'Medium', status: 'Pending' },
  { id: '10004', title: 'SAP Login Issue', priority: 'Medium', status: 'Pending' },
];

export default function DashboardPage() {
    const { incidents } = React.useContext(IncidentContext);
    
    // The state now holds a start and end date object
    const [dateRange, setDateRange] = React.useState({ start: null, end: null });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const setPresetRange = (rangeName) => {
        const now = new Date();
        if (rangeName === 'today') setDateRange({ start: now, end: now });
        if (rangeName === 'week') setDateRange({ start: startOfWeek(now), end: now });
        if (rangeName === 'month') setDateRange({ start: startOfMonth(now), end: now });
        if (rangeName === 'all') setDateRange({ start: null, end: null });
        handleClose();
    };

    const filteredIncidents = React.useMemo(() => {
        const { start, end } = dateRange;
        if (!start || !end || !isValid(start) || !isValid(end)) {
            return incidents; // If no valid range, return all
        }

        const interval = { start, end: endOfDay(end) };
        const parseDate = (dateStr) => parse(dateStr, 'dd MMM yy, hh:mm a', new Date());
        
        return incidents.filter(i => {
            const reportedDate = parseDate(i.reportedOn);
            return isValid(reportedDate) && isWithinInterval(reportedDate, interval);
        });
    }, [incidents, dateRange]);

    const pendingIncidents = filteredIncidents.filter(i => i.status === 'New').length;
    const processedIncidents = filteredIncidents.filter(i => i.status === 'Processed').length;
    const resolvedIncidents = filteredIncidents.filter(i => i.status === 'Resolved').length;
    const closedIncidents = filteredIncidents.filter(i => i.status === 'Closed').length;
    const allOpenIncidents = pendingIncidents + processedIncidents;

    const statCardsData = [
        { title: 'New Incidents', value: pendingIncidents, color: 'warning' },
        { title: 'Processed Incidents', value: processedIncidents, color: 'info' },
        { title: 'All Open Incidents', value: allOpenIncidents, color: 'secondary' },
        { title: 'Resolved Incidents', value: resolvedIncidents, color: 'success' },
        { title: 'Closed Incidents', value: closedIncidents, color: 'default' },
    ];

    const getPriorityChipColor = (priorityValue) => {
        if (priorityValue === 'High') return 'error';
        if (priorityValue === 'Medium') return 'warning';
        return 'default';
    };

    const getNumberVariant = (value) => value.toString().length > 4 ? 'h4' : 'h3';

    const formatDateRange = () => {
        const { start, end } = dateRange;
        if (!start || !end) return "All Time";
        if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) return format(start, 'do MMM, yyyy');
        return `${format(start, 'do MMM')} - ${format(end, 'do MMM, yyyy')}`;
    };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
              Dashboard
          </Typography>
          <Button
            id="date-range-button"
            aria-controls={open ? 'date-range-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="outlined"
            onClick={handleClick}
            startIcon={<EventIcon />}
          >
            {formatDateRange()}
          </Button>
          <Menu
            id="date-range-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => setPresetRange('today')}>Today</MenuItem>
            <MenuItem onClick={() => setPresetRange('week')}>This Week</MenuItem>
            <MenuItem onClick={() => setPresetRange('month')}>This Month</MenuItem>
            <MenuItem onClick={() => setPresetRange('all')}>All Time</MenuItem>
            <Divider />
            {/* Using two separate DatePicker components */}
            <Box sx={{ p: 2 }}>
                <Typography variant="overline" display="block" sx={{ mb: 2 }}>Custom Range</Typography>
                <Stack spacing={2}>
                    <DatePicker 
                        label="Start Date" 
                        value={dateRange.start} 
                        onChange={(newValue) => setDateRange(prev => ({...prev, start: newValue}))}
                    />
                    <DatePicker 
                        label="End Date" 
                        value={dateRange.end} 
                        onChange={(newValue) => setDateRange(prev => ({...prev, end: newValue}))}
                    />
                </Stack>
            </Box>
          </Menu>
      </Stack>
      
      <Grid container spacing={3}>
          {statCardsData.map((card, index) => (
            <Grid container xs={12} sm={6} md={2.4} key={index}> 
                <Card elevation={2} sx={{ width: '100%'}}>
                  <CardContent sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {card.title}
                      </Typography>
                      <Typography variant={getNumberVariant(card.value)} component="div" color={`${card.color}.main`}>
                        <CountUp end={card.value} duration={1.5} separator="," />
                      </Typography>
                  </CardContent>
                </Card>
            </Grid>
          ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
          Recent Incidents
      </Typography>
      <Card elevation={2}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {recentIncidentsData.map((incident) => (
                <ListItem
                  key={incident.id}
                  divider
                  secondaryAction={
                    <Chip label={incident.priority} color={getPriorityChipColor(incident.priority)} size="small" />
                  }
                >
                  <ListItemText
                  primary={incident.title}
                  secondary={`Status: ${incident.status}`}
                  />
              </ListItem>
              ))}
          </List>
      </Card>
    </Stack>
  );
}