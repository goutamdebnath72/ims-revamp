// File: app/page.jsx
// This page is now much simpler. It only contains dashboard content.
"use client";

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Chip } from '@mui/material';

const statCardsData = [
  { title: 'Pending Incidents', value: '8', color: 'warning' },
  { title: 'Awaiting My Response', value: '2', color: 'error' },
  { title: 'Resolved Today', value: '15', color: 'success' },
  { title: 'All Open Incidents', value: '25', color: 'info' },
];

const recentIncidentsData = [
  { id: '10001', title: 'Network Down in Admin Building', priority: 'High', status: 'Processed' },
  { id: '10002', title: 'Email Not Working for Mr. Debnath', priority: 'High', status: 'Processed' },
  { id: '10003', title: 'Software Install Request: VS Code', priority: 'Medium', status: 'Pending' },
  { id: '10004', title: 'SAP Login Issue', priority: 'Medium', status: 'Pending' },
];

export default function DashboardPage() {
    const getPriorityChipColor = (priorityValue) => {
        if (priorityValue === 'High') return 'error';
        if (priorityValue === 'Medium') return 'warning';
        return 'default';
    };
  return (
    <>
      <Typography variant="h4" gutterBottom>
          Dashboard
      </Typography>
      
      <Grid container spacing={3}>
          {statCardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}> 
                <Card elevation={2}>
                  <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {card.title}
                      </Typography>
                      <Typography variant="h3" component="div" color={`${card.color}.main`}>
                      {card.value}
                      </Typography>
                  </CardContent>
                </Card>
            </Grid>
          ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
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
    </>
  );
}