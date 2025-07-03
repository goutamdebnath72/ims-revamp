// File: components/TeamAvailabilityCard.jsx
// NEW: A card to display team member availability, visible only to C&IT.
'use client';

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
import { Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { teamMembers } from '@/lib/team-availability';

const C_AND_IT_DEPT_CODES = [98540, 98541];

export default function TeamAvailabilityCard() {
  const { user } = React.useContext(UserContext);

  // This is the permission check. If user is not from C&IT, render nothing.
  if (!user || !C_AND_IT_DEPT_CODES.includes(user.departmentCode)) {
    return null;
  }

  const onLeave = teamMembers.filter(member => member.status === 'On Leave');

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Team Availability (On Leave)
      </Typography>
      <List dense>
        {onLeave.length > 0 ? (
            onLeave.map((member, index) => (
                <ListItem key={index}>
                    <ListItemIcon>
                        <BeachAccessIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary={member.name} />
                </ListItem>
            ))
        ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Everyone is available today.
            </Typography>
        )}
      </List>
    </Paper>
  );
}