// In components/DescriptionModal.jsx

"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DescriptionModal({ open, onClose, description }) {
  if (!description) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { overflowY: "visible" } }} // Allow button to be visible outside
    >
      <Box sx={{ position: "relative" }}>
        {/* --- Custom Close Button --- */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: -16,
            right: -16,
            color: 'grey.800',
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'grey.400',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', pb: 1 }}>
          Full Incident Description
        </DialogTitle>
        <DialogContent>
          <Typography
            component="p"
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap', // This is crucial for preserving formatting
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'text.secondary',
            }}
          >
            {description}
          </Typography>
        </DialogContent>
      </Box>
    </Dialog>
  );
}