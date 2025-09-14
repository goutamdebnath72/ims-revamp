"use client";

import * as React from "react";
import { DateTime } from "luxon";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function DetailItem({ label, value, component = "div" }) {
  if (!value) return null;
  return (
    <Box sx={{ flex: "1 1 0", minWidth: "160px" }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: "bold",
          display: "block",
          textTransform: "uppercase",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        component={component}
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function IncidentDetailsCard({
  incident,
  onOpenDescriptionModal,
}) {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevExpanded) => {
      if (isExpanded) {
        return [...prevExpanded, panel];
      } else {
        return prevExpanded.filter((p) => p !== panel);
      }
    });
  };

  const iconSx = {
    /*fontSize: "1.6rem",
    color: "grey.600",
    transform: "scale(1.1)",*/
  };

  const allPanels = ["panel1", "panel2", "panel3", "panel4"];
  const allOpen = expanded.length === allPanels.length;

  const handleToggleAll = () => {
    if (allOpen) {
      setExpanded([]);
    } else {
      setExpanded(allPanels);
    }
  };

  const accordionSx = {
    // Add margin to the bottom of each card for spacing
    mb: 2,
    // This removes the default thin line MUI puts on top of accordions
    "&:before": {
      display: "none",
    },
  };

  if (!incident) {
    return null;
  }

  const getStatusChipColor = (status) => {
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

  const requestor = incident.requestor || {};
  const formattedReportedOn = DateTime.fromISO(incident.reportedOn, {
    zone: "Asia/Kolkata",
  }).toFormat("dd MMM yyyy, h:mm a");
  const descriptionPreview =
    incident.description?.substring(0, 300) +
    (incident.description?.length > 300 ? "..." : "");

  return (
    <Box sx={{ width: "99%", mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 1 }}>
        <Button onClick={handleToggleAll}>
          {allOpen ? "Close All" : "Open All"}
        </Button>
      </Box>
      <Accordion
        elevation={2}
        sx={accordionSx}
        expanded={expanded.includes("panel1")}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={
            expanded.includes("panel1") ? (
              <RemoveIcon sx={iconSx} />
            ) : (
              <AddIcon sx={iconSx} />
            )
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 500 }}>
            Incident Classification
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Status, Priority, Type, and Title
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} divider={<Divider />}>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              <DetailItem label="Incident No." value={incident.id} />
              <DetailItem
                label="Incident Type"
                value={incident.incidentType?.name}
              />
              <DetailItem label="Reported On" value={formattedReportedOn} />
            </Stack>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              <DetailItem
                label="Status"
                value={
                  <Chip
                    label={incident.status}
                    color={getStatusChipColor(incident.status)}
                    size="small"
                  />
                }
              />
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
            </Stack>
            <DetailItem label="Job Title" value={incident.jobTitle} />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion
        elevation={2}
        sx={accordionSx}
        expanded={expanded.includes("panel2")}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={
            expanded.includes("panel2") ? (
              <RemoveIcon sx={iconSx} />
            ) : (
              <AddIcon sx={iconSx} />
            )
          }
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 500 }}>
            Requestor Information
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Contact and Department Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2} divider={<Divider />}>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              <DetailItem label="Requestor" value={requestor.name} />
              <DetailItem label="Ticket No." value={requestor.ticketNo} />
              <DetailItem
                label="Department"
                value={requestor.department?.name}
              />
              <DetailItem label="Contact No." value={requestor.contactNo} />
            </Stack>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              <DetailItem label="Email ID" value={requestor.emailId} />
              <DetailItem label="Email ID (NIC)" value={requestor.emailIdNic} />
              <DetailItem label="SAIL P/No" value={requestor.sailPNo} />
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion
        elevation={2}
        sx={accordionSx}
        expanded={expanded.includes("panel3")}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={
            expanded.includes("panel3") ? (
              <RemoveIcon sx={iconSx} />
            ) : (
              <AddIcon sx={iconSx} />
            )
          }
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 500 }}>
            System & Location Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <DetailItem label="Location" value={incident.location} />
            <DetailItem label="IP Address" value={incident.ipAddress} />
            <DetailItem label="Job From" value={incident.jobFrom} />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion
        elevation={2}
        sx={accordionSx}
        expanded={expanded.includes("panel4")}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={
            expanded.includes("panel4") ? (
              <RemoveIcon sx={iconSx} />
            ) : (
              <AddIcon sx={iconSx} />
            )
          }
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 500 }}>
            Full Description
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body1"
            component="div"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 1.5 }}
          >
            {descriptionPreview || "N/A"}
          </Typography>
          {incident.description && incident.description.length > 300 && (
            <Button
              variant="text"
              size="small"
              onClick={onOpenDescriptionModal}
            >
              View Full Description...
            </Button>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
