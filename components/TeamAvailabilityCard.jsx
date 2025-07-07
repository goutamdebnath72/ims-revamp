// File: components/TeamAvailabilityCard.jsx
'use client';

import * as React from 'react';
import { UserContext } from '@/context/UserContext';
import { Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { teamMembers } from '@/lib/team-availability';

const C_AND_IT_DEPT_CODES = [98540, 98541, 98500];

export default function TeamAvailabilityCard() {
  const { user } = React.useContext(UserContext);

  if (!user || !C_AND_IT_DEPT_CODES.includes(user.departmentCode)) {
    return null;
  }

  const onLeave = teamMembers.filter(member => member.status === 'On Leave');

  return (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Team Availability (On Leave)
      </Typography>
      {/* --- NEW: The List is now scrollable to match the Recent Activity card --- */}
      <Box sx={{
        maxHeight: 220,
        overflowY: 'auto'
      }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Everyone is available today.
              </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
}