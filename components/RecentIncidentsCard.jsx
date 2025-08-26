"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  Typography,
  List,
  ListItemText,
  Chip,
  Divider,
  Box,
  ListItemButton,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import { DateTime } from "luxon";

export default function RecentIncidentsCard({ incidents }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  const recentIncidents = [...(incidents || [])]
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.reportedOn, { zone: "Asia/Kolkata" });
      const dateB = DateTime.fromISO(b.reportedOn, { zone: "Asia/Kolkata" });
      return dateB.toMillis() - dateA.toMillis();
    })
    .slice(0, 5);

  const getStatusChipColor = (status) => {
    if (status === "New") return "success";
    if (status === "Processed") return "info";
    if (status === "Resolved") return "success";
    if (status === "Closed") return "default";
    return "default";
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error.main";
    if (priority === "Medium") return "warning.main";
    return "info.main";
  };

  const handleItemClick = (id) => {
    setIsLoading(true); // Set loading to true on click
    router.push(`/incidents/${id}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative", // Make Paper a positioning context
      }}
    >
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          p: 0,
          overflowY: "auto",
        }}
      >
        {recentIncidents.map((incident, index) => (
          <ListItemButton
            key={incident.id}
            divider={index < recentIncidents.length - 1}
            onClick={() => handleItemClick(incident.id)}
            disabled={isLoading} // Optionally disable button during load
            sx={{ py: 1.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText
                primary={incident.incidentType?.name}
                secondary={`#${incident.id} - Reported by ${
                  incident.requestor?.name || "Unknown"
                }`}
                sx={{ m: 0 }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  textAlign: "right",
                  pl: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    width: "90px",
                    color: getPriorityColor(incident.priority),
                    fontWeight: 500,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {incident.priority}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    width: "180px",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {DateTime.fromISO(incident.reportedOn, {
                    zone: "Asia/Kolkata",
                  }).toFormat("dd MMM, h:mm a")}
                </Typography>
                <Box sx={{ width: "95px" }}>
                  <Chip
                    label={incident.status}
                    color={getStatusChipColor(incident.status)}
                    variant={incident.status === "New" ? "outlined" : "filled"}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </ListItemButton>
        ))}
        {recentIncidents.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No recent activity to display.
          </Typography>
        )}
      </List>

      {/* --- ADD THIS LOADING OVERLAY BLOCK --- */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: "4px", // Match Paper's default border-radius
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
}
