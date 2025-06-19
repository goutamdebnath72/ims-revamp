// File: components/IncidentAuditTrail.jsx
// FINAL VERSION 3: Corrects the timestamp color for the "Closed" entry.
'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

export default function IncidentAuditTrail({ auditTrail }) {
  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Audit Trail
        </Typography>
        <Typography color="text.secondary">No history available for this incident.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Audit Trail
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {auditTrail.map((entry, index) => {
          // --- LOGIC ---
          const isClosedEntry = entry.action.toLowerCase().includes('closed');
          const finalColor = '#4CAF50';

          // Add a period to the comment if it's missing punctuation
          const comment = entry.comment.trim();
          const needsPunctuation = !/[.!?]$/.test(comment);
          const formattedComment = needsPunctuation ? `${comment}.` : comment;
          // --- END LOGIC ---

          return (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          display: 'block',
                          fontWeight: 'bold',
                          color: isClosedEntry ? finalColor : 'text.primary',
                        }}
                      >
                        {entry.action}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {formattedComment}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 1,
                        fontWeight: isClosedEntry ? 'bold' : 'normal',
                        // CORRECTED: Color is now always the default secondary text color
                        color: 'text.secondary',
                      }}
                    >
                      <span>{`${entry.author} — `}</span>
                      <span style={{ textDecoration: isClosedEntry ? 'underline' : 'none' }}>
                        {entry.timestamp}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
              {index < auditTrail.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
}