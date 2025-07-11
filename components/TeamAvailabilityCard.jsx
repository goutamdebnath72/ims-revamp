// components/TeamAvailabilityCard.jsx
'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { teamMembers } from '@/lib/team-availability';
import { Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

// The list of C&IT department codes, with 98541 removed as you requested.
const C_AND_IT_DEPT_CODES = [98540, 98500];

export default function TeamAvailabilityCard() {
  // Get the session data, which now includes departmentCode thanks to the changes in Part 1.
  const { data: session } = useSession();
  const user = session?.user;

  // This logic now works correctly. The card will only render if the logged-in
  // user's departmentCode is in the C_AND_IT_DEPT_CODES array.
  if (!user || !user.departmentCode || !C_AND_IT_DEPT_CODES.includes(user.departmentCode)) {
    return null; // Don't render the card for other departments
  }

  // Restore the original logic to filter for "On Leave" members from the live data source.
  const onLeave = teamMembers.filter(member => member.status === 'On Leave');

  return (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Team Availability (On Leave)
      </Typography>
      {/* Restore the original scrollable Box layout. */}
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
              // Restore the original message for when no one is on leave.
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Everyone is available today.
              </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
}