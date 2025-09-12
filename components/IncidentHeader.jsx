"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { NotificationContext } from "@/context/NotificationContext";

// Helper to determine chip color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "info";
    case "Processed":
      return "primary";
    case "Pending Telecom Action":
    case "Pending ETL Action":
      return "warning";
    case "Resolved":
      return "success";
    case "Closed":
      return "default";
    default:
      return "default";
  }
};

// Helper to determine chip color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "info";
    default:
      return "default";
  }
};

export default function IncidentHeader({ incident }) {
  const { showNotification } = React.useContext(NotificationContext);

  const handleCopyId = () => {
    navigator.clipboard.writeText(incident.id);
    showNotification(
      {
        title: "Copied!",
        message: `Incident ID ${incident.id} copied to clipboard.`,
      },
      "success"
    );
  };

  if (!incident) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2, // Margin bottom to space it from the tabs
        bgcolor: "background.default",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1.5}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h5"
              component="h1"
              noWrap
              title={incident.jobTitle}
            >
              {incident.jobTitle}
            </Typography>
            <Tooltip title="Copy Incident ID">
              <IconButton onClick={handleCopyId} size="small">
                <ContentCopyIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>
            ID: {incident.id} | Raised by:{" "}
            <strong>{incident.requestor?.name}</strong>
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            label={incident.status}
            color={getStatusColor(incident.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`P: ${incident.priority}`}
            color={getPriorityColor(incident.priority)}
            size="small"
            variant="outlined"
          />
          <Chip
            label={incident.incidentType?.name}
            size="small"
            variant="outlined"
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
