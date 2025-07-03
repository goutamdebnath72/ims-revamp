"use client";

import * as React from 'react';
import Link from 'next/link';
import { IncidentContext } from '@/context/IncidentContext';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CountUp from 'react-countup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { startOfWeek, startOfMonth, endOfDay, format, isWithinInterval, parse, isValid } from 'date-fns';
import { Stack, Button, Menu, MenuItem, Divider, Box, CardActionArea } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

import StatusChart from '@/components/StatusChart';
import PriorityChart from '@/components/PriorityChart';
import TeamAvailabilityCard from '@/components/TeamAvailabilityCard';
import RecentIncidentsCard from '@/components/RecentIncidentsCard';

export default function DashboardPage() {
    const { incidents } = React.useContext(IncidentContext);
    
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
            return incidents;
        }

        const interval = { start, end: endOfDay(end) };
        const parseDate = (dateStr) => parse(dateStr, 'dd MMM yy, hh:mm a', new Date());
        
        return incidents.filter(i => {
            const reportedDate = parseDate(i.reportedOn);
            return isValid(reportedDate) && isWithinInterval(reportedDate, interval);
        });
    }, [incidents, dateRange]);

    const newIncidents = filteredIncidents.filter(i => i.status === 'New').length;
    const processedIncidents = filteredIncidents.filter(i => i.status === 'Processed').length;
    const resolvedIncidents = filteredIncidents.filter(i => i.status === 'Resolved').length;
    const closedIncidents = filteredIncidents.filter(i => i.status === 'Closed').length;
    const allOpenIncidents = newIncidents + processedIncidents;

    const statCardsData = [
        { title: 'New Incidents', value: newIncidents, color: 'warning', filterStatus: 'New' },
        { title: 'Processed', value: processedIncidents, color: 'info', filterStatus: 'Processed' },
        { title: 'All Open', value: allOpenIncidents, color: 'secondary', filterStatus: 'AllOpen' },
        { title: 'Resolved', value: resolvedIncidents, color: 'success', filterStatus: 'Resolved' },
        { title: 'Closed', value: closedIncidents, color: 'default', filterStatus: 'Closed' },
    ];
    
    const statusChartData = [
        { name: 'New', count: newIncidents },
        { name: 'Processed', count: processedIncidents },
        { name: 'Resolved', count: resolvedIncidents },
        { name: 'Closed', count: closedIncidents },
    ];
    
    const openIncidentsList = filteredIncidents.filter(i => i.status === 'New' || i.status === 'Processed');
    const priorityChartData = [
        { name: 'High', value: openIncidentsList.filter(i => i.priority === 'High').length },
        { name: 'Medium', value: openIncidentsList.filter(i => i.priority === 'Medium').length },
        { name: 'Low', value: openIncidentsList.filter(i => i.priority === 'Low').length },
    ];

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
      
      <Stack direction="row" spacing={3}>
          {statCardsData.map((card, index) => (
            <Box key={index} sx={{ flex: 1, textDecoration: 'none' }}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardActionArea component={Link} href={`/search?status=${card.filterStatus}`} sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {card.title}
                        </Typography>
                        <Typography variant={getNumberVariant(card.value)} component="div" color={`${card.color}.main`}>
                          <CountUp end={card.value} duration={1.5} separator="," />
                        </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
            </Box>
          ))}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Stack sx={{ flex: 7 }} spacing={3}>
            <StatusChart data={statusChartData} />
            <RecentIncidentsCard />
          </Stack>
          <Stack sx={{ flex: 5 }} spacing={3}>
              <PriorityChart data={priorityChartData} />
              <TeamAvailabilityCard />
          </Stack>
      </Stack>
    </Stack>
  );
}