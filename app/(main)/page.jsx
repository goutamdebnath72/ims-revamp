// File: app/(main)/page.jsx
// UPDATED: Implemented a fully dynamic dashboard with date filters, animated numbers, and responsive cards.
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
import { Chip, Stack } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CountUp from 'react-countup'; // <-- Import animation library
import { startOfWeek, startOfMonth, isWithinInterval, parse } from 'date-fns'; // <-- Import date calculation functions

const recentIncidentsData = [
  { id: '10001', title: 'Network Down in Admin Building', priority: 'High', status: 'Processed' },
  { id: '10002', title: 'Email Not Working for Mr. Debnath', priority: 'High', status: 'Processed' },
  { id: '10003', title: 'Software Install Request: VS Code', priority: 'Medium', status: 'Pending' },
  { id: '10004', title: 'SAP Login Issue', priority: 'Medium', status: 'Pending' },
];

export default function DashboardPage() {
    const { incidents } = React.useContext(IncidentContext);
    const [timeRange, setTimeRange] = React.useState('all');

    const handleTimeRangeChange = (event, newTimeRange) => {
        if (newTimeRange !== null) {
            setTimeRange(newTimeRange);
        }
    };

    // --- NEW: Filter incidents based on the selected time range ---
    const filteredIncidents = React.useMemo(() => {
        const now = new Date();
        const parseDate = (dateStr) => parse(dateStr, 'dd MMM yy, hh:mm a', new Date());

        if (timeRange === 'all') {
            return incidents;
        }
        
        let interval;
        if (timeRange === 'today') {
            interval = { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date(now.setHours(23, 59, 59, 999)) };
        } else if (timeRange === 'week') {
            interval = { start: startOfWeek(now), end: now };
        } else if (timeRange === 'month') {
            interval = { start: startOfMonth(now), end: now };
        }
        
        return incidents.filter(i => isWithinInterval(parseDate(i.reportedOn), interval));
    }, [incidents, timeRange]);

    // --- All calculations now use the 'filteredIncidents' list ---
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

    // Helper to adjust font size for large numbers
    const getNumberVariant = (value) => {
        return value.toString().length > 4 ? 'h4' : 'h3';
    };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
              Dashboard
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size="small"
          >
            <ToggleButton value="today" aria-label="today">Today</ToggleButton>
            <ToggleButton value="week" aria-label="this week">This Week</ToggleButton>
            <ToggleButton value="month" aria-label="this month">This Month</ToggleButton>
            <ToggleButton value="all" aria-label="all time">All Time</ToggleButton>
          </ToggleButtonGroup>
      </Stack>
      
      <Grid container spacing={3}>
          {statCardsData.map((card, index) => (
            <Grid container xs={12} sm={6} md={2.4} key={index}> 
                <Card elevation={2} sx={{ width: '100%'}}>
                  <CardContent sx={{ textAlign: 'center' }}> {/* <-- Center align content */}
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {card.title}
                      </Typography>
                      <Typography variant={getNumberVariant(card.value)} component="div" color={`${card.color}.main`}>
                        {/* Use the CountUp component for animation */}
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