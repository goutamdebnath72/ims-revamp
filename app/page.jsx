// File: app/page.jsx
// This version removes all "Mui" naming from functions and the header text.
"use client";

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import BugReportIcon from '@mui/icons-material/BugReport';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Chip } from '@mui/material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { text: 'Search & Archive', icon: <SearchIcon />, href: '/search' },
  { text: 'Raise Incident', icon: <BugReportIcon />, href: '/raise' },
];

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

// CORRECTED: Renamed function
export default function DashboardPage() {
    const getPriorityChipColor = (priorityValue) => {
        if (priorityValue === 'High') return 'error';
        if (priorityValue === 'Medium') return 'warning';
        return 'default';
    };
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          {/* CORRECTED: Removed "MUI" from header text */}
          <Typography variant="h6" noWrap component="div">
            Incident Management System - DSP
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>IMS Portal</Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
                <ListItemButton LinkComponent={Link} href={item.href}>
                    <ListItemIcon>
                    {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
            Dashboard
        </Typography>
        
        <Grid container spacing={3}>
            {statCardsData.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}> 
                  <Card elevation={3}>
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
        <Card elevation={3}>
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
      </Box>
    </Box>
  );
}