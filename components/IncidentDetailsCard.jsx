"use client";

import * as React from "react";
import { DateTime } from "luxon";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

function DetailItem({ label, value, component = "div" }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: "bold",
          display: "block",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        component={component}
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

export default function IncidentDetailsCard({
  incident,
  onOpenDescriptionModal,
}) {
  if (!incident) {
    return null;
  }

  const getStatusChipColor = (status) => {
    switch (status) {
      case "New":
        return "warning";
      case "Processed":
        return "info";
      case "Resolved":
        return "success";
      case "Closed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityChipColor = (priority) => {
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

  // Updated to use the nested requestor object
  const requestor = incident.requestor || {};

  const formattedReportedOn = DateTime.fromISO(incident.reportedOn, {
    zone: "Asia/Kolkata",
  }).toFormat("dd MMM yyyy, h:mm a");

  const descriptionPreview =
    incident.description?.substring(0, 200) +
    (incident.description?.length > 200 ? "..." : "");

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h5">Incident Details</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "medium", fontSize: "0.9em" }}
        >
          {/* Display the newly formatted date */}
          Reported On:{" "}
          {incident.reportedOn ? formattedReportedOn : "Not available"}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          overflowY: "auto",
          pr: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2.5}>
          {/* This top section remains the same */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: "2 1 0px", minWidth: 0 }}>
              <DetailItem label="Incident No." value={incident.id} />
            </Box>
            <Box sx={{ flex: "2 1 0px", minWidth: 0 }}>
              <DetailItem
                label="Incident Type"
                value={incident.incidentType?.name}
              />
            </Box>
            <Box sx={{ flex: "1 1 0px", minWidth: 0 }}>
              <DetailItem
                label="Priority"
                value={
                  <Chip
                    label={incident.priority}
                    color={getPriorityChipColor(incident.priority)}
                    size="small"
                  />
                }
              />
            </Box>
            <Box sx={{ flex: "1 1 0px", minWidth: 0 }}>
              <DetailItem
                label="Status"
                value={
                  <Tooltip title={incident.status} arrow>
                    <Chip
                      label={incident.status}
                      color={getStatusChipColor(incident.status)}
                      variant={
                        incident.status === "New" ? "outlined" : "filled"
                      }
                      size="small"
                    />
                  </Tooltip>
                }
              />
            </Box>
          </Stack>
          <Divider />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: "bold",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              Job Title
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {incident.jobTitle || "N/A"}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: "bold",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mt: 0.5 }}
            >
              {descriptionPreview || "N/A"}
            </Typography>
            {incident.description && incident.description.length > 200 && (
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenDescriptionModal}
                sx={{ mt: 1 }}
              >
                View Full Description...
              </Button>
            )}
          </Box>

          {/* --- CORRECTED REQUESTOR INFORMATION SECTION --- */}
          <Box
            sx={{
              position: "relative",
              mt: "32px !important",
              p: 2,
              pt: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                position: "absolute",
                top: 0,
                left: 12,
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                px: 1,
              }}
            >
              Requestor Information
            </Typography>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Requestor" value={requestor.name} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Ticket No." value={requestor.ticketNo} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem
                    label="Department"
                    value={requestor.department?.name}
                  />{" "}
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Contact No." value={requestor.contactNo} />
                </Box>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Email ID" value={requestor.emailId} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem
                    label="Email ID (NIC)"
                    value={requestor.emailIdNic}
                  />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="SAIL P/No" value={requestor.sailPNo} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Location" value={incident.location} />
                </Box>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="IP Address" value={incident.ipAddress} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
                  <DetailItem label="Job From" value={incident.jobFrom} />
                </Box>
                <Box sx={{ flex: "1 1 0", minWidth: 0 }} />
                <Box sx={{ flex: "1 1 0", minWidth: 0 }} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
