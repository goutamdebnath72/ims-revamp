"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import {
  Typography,
  List,
  ListItemText,
  Chip,
  Divider,
  Box,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import { DateTime } from "luxon";

export default function RecentIncidentsCard({ incidents }) {
  const router = useRouter();
  const { isNavigating, setIsNavigating } = useLoading();
  const recentIncidents = [...(incidents || [])]
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.reportedOn, { zone: "Asia/Kolkata" });
      const dateB = DateTime.fromISO(b.reportedOn, { zone: "Asia/Kolkata" });
      return dateB.toMillis() - dateA.toMillis();
    })
    .slice(0, 5);

  const hasIncidents = recentIncidents.length > 0;

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
    setIsNavigating(true);
    router.push(`/incidents/${id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // --- THE FIX: Apply height: 100% ONLY for the empty state ---
        // This allows the populated list to overflow its container and trigger scrollbars.
        height: hasIncidents ? "auto" : "100%",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0,
          p: 2,
          pb: 0,
        }}
      >
        Recent Activity
        {hasIncidents && (
          <Typography component="span" variant="body2" color="text.secondary">
            (Latest {recentIncidents.length})
          </Typography>
        )}
      </Typography>

      {hasIncidents ? (
        <>
          <Divider sx={{ mx: 2, mb: 1 }} />
          <List
            sx={{ width: "100%", bgcolor: "background.paper", p: 0, px: 2 }}
          >
            {recentIncidents.map((incident, index) => (
              <ListItemButton
                key={incident.id}
                divider={index < recentIncidents.length - 1}
                onClick={() => handleItemClick(incident.id)}
                disabled={isNavigating}
                sx={{ py: 1.5, px: 0 }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
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
                      <Tooltip
                        title={incident.status}
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "#333",
                              fontSize: "0.8rem",
                              letterSpacing: "0.5px",
                            },
                          },
                        }}
                      >
                        <Chip
                          label={incident.status}
                          color={getStatusChipColor(incident.status)}
                          variant={
                            incident.status === "New" ? "outlined" : "filled"
                          }
                          size="small"
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </ListItemButton>
            ))}
          </List>
        </>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No recent activity to display.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
