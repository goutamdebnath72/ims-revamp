"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Rating from '@mui/material/Rating';
import { generateIncidentPdf } from "@/utils/pdfGenerators";
import EditableComment from './EditableComment';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const IncidentAuditTrail = React.forwardRef(function IncidentAuditTrail({
  auditTrail,
  incident,
  isResolved,
  onCommentEdit,
  isExpanded,
  onToggleExpand,
}, ref) {

  const scrollContainerRef = React.useRef(null);
  const [canExpand, setCanExpand] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    scrollToBottom() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }
  }), []);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setCanExpand(scrollHeight > clientHeight);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [auditTrail]);

  const handleDownload = () => {
    generateIncidentPdf(incident, auditTrail);
  };

  const isProcessed = incident.status === 'Processed';
  const showExpandButton = canExpand && isProcessed;

  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, width: '100%', height: '100%' }}>
        <Typography variant="h5" gutterBottom>Audit Trail</Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography color="text.secondary">No history available for this incident.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>Audit Trail</Typography>
          {isResolved && (
            <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download PDF
            </Button>
          )}
        </Box>
        <Divider sx={{ mt: 1.5, mb: 0 }} />
      </Box>
      
      <List 
        ref={scrollContainerRef}
        sx={{ width: "100%", bgcolor: "background.paper", p: 0, py: 1.5, flexGrow: 1, overflowY: 'auto' }}
      >
        {auditTrail.map((entry, index) => {
          const isResolvedEntry = entry.action.toLowerCase().includes("resolved");
          const isFinalEntry = entry.action.toLowerCase().includes("resolved") || entry.action.toLowerCase().includes("closed");

          return (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography component="span" variant="body1" sx={{ 
                          display: "block", 
                          fontWeight: "bold", 
                          color: isResolvedEntry ? "#4CAF50" : "text.primary" 
                        }}>
                        {entry.action}
                      </Typography>
                      <EditableComment
                         initialComment={entry.comment}
                        author={entry.author}
                        isEdited={entry.isEdited}
                        onSave={(newComment) => onCommentEdit(index, newComment)}
                        incidentStatus={incident.status}
                      />
                      {entry.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Final Rating:</Typography>
                          <Rating name="read-only-rating" value={entry.rating} readOnly />
                        </Box>
                      )}
                     </React.Fragment>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 1, fontWeight: isFinalEntry ? "bold" : "normal", color: "text.secondary" }}>
                      <span>{`${entry.author} — `}</span>
                      <span style={{ textDecoration: isFinalEntry ? "underline" : "none" }}>{entry.timestamp}</span>
                    </Typography>
                  }
                />
              </ListItem>
              {index < auditTrail.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </List>
      
      {showExpandButton && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            borderRadius: '50%',
            p: 0.25,
          }}
        >
          <IconButton
            size="medium"
            onClick={onToggleExpand}
            sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}
            aria-label={isExpanded ? "Collapse audit trail" : "Expand audit trail"}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      )}
    </Paper>
  );
});

export default IncidentAuditTrail;