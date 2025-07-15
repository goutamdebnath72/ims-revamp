"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

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

export default function IncidentDetailsCard({ incident }) {
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

  const displayEmailSail = incident.emailSail || "N/A";
  const displayEmailNic = incident.emailNic || "N/A";
  const ipAddress = incident.ipAddress || "N/A";
  const jobFrom = incident.jobFrom || "N/A";

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
          Reported On: {incident.reportedOn}
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
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: "2 1 0px", minWidth: 0 }}>
              <DetailItem label="Incident No." value={incident.id} />
            </Box>
            <Box sx={{ flex: "2 1 0px", minWidth: 0 }}>
              <DetailItem label="Incident Type" value={incident.incidentType} />
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
                  <Chip
                    label={incident.status}
                    color={getStatusChipColor(incident.status)}
                    variant={incident.status === "New" ? "outlined" : "filled"}
                    size="small"
                  />
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
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {incident.description || "N/A"}
            </Typography>
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
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Requestor" value={incident.requestor} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Ticket No." value={incident.ticketNo} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Department" value={incident.department} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem
                    label="Contact No."
                    value={incident.contactNumber}
                  />
                </Box>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Email ID" value={displayEmailSail} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Email ID (NIC)" value={displayEmailNic} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="SAIL P/No" value={incident.sailpno} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Location" value={incident.location} />
                </Box>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="IP Address" value={ipAddress} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                  <DetailItem label="Job From" value={jobFrom} />
                </Box>
                <Box sx={{ flex: '1 1 0', minWidth: 0 }} />
                <Box sx={{ flex: '1 1 0', minWidth: 0 }} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}