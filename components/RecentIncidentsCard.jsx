'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { IncidentContext } from '@/context/IncidentContext';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Divider, Box, ListItemButton } from '@mui/material';

export default function RecentIncidentsCard() {
  const { incidents } = React.useContext(IncidentContext);
  const router = useRouter();

  // Sort incidents by parsing the date string robustly to find the most recent ones.
  const recentIncidents = [...incidents]
    .sort((a, b) => {
        // A simple date sort might not be reliable for 'dd MMM yy' format.
        // For production, a proper date object (like from new Date()) is better.
        // For this mock data, a reverse sort is sufficient.
        return b.id - a.id;
    })
    .slice(0, 5); // Get the top 5 most recent incidents

  const getStatusChipColor = (status) => {
    if (status === 'New') return 'success';
    if (status === 'Processed') return 'info';
    if (status === 'Resolved') return 'success';
    if (status === 'Closed') return 'default';
    return 'default';
  };
  
  const handleItemClick = (id) => {
      router.push(`/incidents/${id}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <Divider />
      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {recentIncidents.map((incident, index) => (
          <ListItemButton 
            key={incident.id} 
            divider={index < recentIncidents.length - 1}
            onClick={() => handleItemClick(incident.id)}
          >
            <ListItemText
              primary={incident.jobTitle}
              secondary={`#${incident.id} - Reported by ${incident.requestor}`}
            />
            <Chip 
              label={incident.status} 
              color={getStatusChipColor(incident.status)}
              variant={incident.status === 'New' ? 'outlined' : 'filled'}
              size="small" 
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}