// File: components/IncidentAuditTrail.jsx
// Adds the Divider under the title for consistency.
'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider'; // <-- IMPORTED
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { generateIncidentPdf } from '@/utils/pdfGenerators';

export default function IncidentAuditTrail({ auditTrail, incident, isResolved }) {
  const handleDownload = () => {
    generateIncidentPdf(incident, auditTrail);
  };

  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Audit Trail
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography color="text.secondary">No history available for this incident.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Audit Trail
        </Typography>
        {isResolved && (
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        )}
      </Box>

      <Divider sx={{ mt: 1.5, mb: 2 }} /> {/* <-- ADDED THIS DIVIDER */}

      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {/* ... (rest of the component is unchanged) ... */}
        {auditTrail.map((entry, index) => {
          const isClosedEntry = entry.action.toLowerCase().includes('closed');
          const finalColor = '#4CAF50';
          const comment = entry.comment.trim();
          const needsPunctuation = !/[.!?]$/.test(comment);
          const formattedComment = needsPunctuation ? `${comment}.` : comment;

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