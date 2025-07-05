'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { IncidentContext } from '@/context/IncidentContext';
import { Paper, Typography, List, ListItemText, Chip, Divider, Box, ListItemButton } from '@mui/material';

// --- FIX: The component now accepts an `incidents` prop ---
// This allows us to pass a pre-filtered list of incidents to it.
export default function RecentIncidentsCard({ incidents: incidentsProp }) {
  const { incidents: allIncidents } = React.useContext(IncidentContext);
  const router = useRouter();

  // If a specific list is passed as a prop, use it. Otherwise, fall back to the full list from context.
  const incidentsToDisplay = incidentsProp || allIncidents;

  const recentIncidents = [...incidentsToDisplay]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

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
              // Secondary text now correctly shows the requestor from the data
              secondary={`#${incident.id} - Reported by ${incident.reportedBy?.name || 'Unknown'}`}
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