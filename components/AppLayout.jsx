// File: components/AppLayout.jsx
// This is our main, shared layout component with the sidebar and header.
'use client';

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

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { text: 'Search & Archive', icon: <SearchIcon />, href: '/search' },
  { text: 'Raise Incident', icon: <BugReportIcon />, href: '/raise' },
];

// The layout now accepts 'children', which will be our page content.
export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
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
      
      {/* This is where the content of our different pages will be rendered */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}