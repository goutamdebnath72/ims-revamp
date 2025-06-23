// File: components/IncidentAuditTrail.jsx
'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  PhoneInTalk as PhoneIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { generateIncidentPdf } from '@/utils/pdfGenerators'; // ⬅️ import reusable utility

export default function IncidentAuditTrail({ auditTrail, incident }) {
  const getIconForAction = (action) => {
    const lower = action.toLowerCase();
    if (lower.includes('closed')) return <CheckIcon color="success" sx={{ mr: 1 }} />;
    if (lower.includes('accepted') || lower.includes('call')) return <PhoneIcon color="info" sx={{ mr: 1 }} />;
    if (lower.includes('reset') || lower.includes('processed')) return <SettingsIcon color="warning" sx={{ mr: 1 }} />;
    return <CommentIcon color="disabled" sx={{ mr: 1 }} />;
  };

  const handlePdf = () => {
    generateIncidentPdf(incident, auditTrail);
  };

  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fafafa', borderLeft: '1px solid #e0e0e0' }}>
        <Typography variant="h5" gutterBottom>
          Audit Trail
        </Typography>
        <Typography color="text.secondary">No history available for this incident.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        maxHeight: { xs: 300, sm: 400, md: 500 },
        overflowY: 'auto',
        backgroundColor: '#fafafa',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Audit Trail</Typography>
        {incident?.status === 'Resolved' && (
          <Button variant="outlined" size="small" onClick={handlePdf}>
            Download PDF
          </Button>
        )}
      </Stack>

      <List sx={{ width: '100%', p: 0 }}>
        {auditTrail.map((entry, index) => {
          const isClosedEntry = entry.action.toLowerCase().includes('closed');
          const comment = entry.comment.trim();
          const needsPunctuation = !/[.!?]$/.test(comment);
          const formattedComment = needsPunctuation ? `${comment}.` : comment;

          return (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  px: 1,
                  transition: 'background 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  },
                  borderRadius: 1,
                }}
              >
                {getIconForAction(entry.action)}
                <ListItemText
                  primary={
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          color: isClosedEntry ? 'green' : 'text.primary',
                        }}
                      >
                        {entry.action}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formattedComment}
                      </Typography>
                    </>
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
                      {entry.author} —{' '}
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