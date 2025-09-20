// components/NewRecentIncidentsCard.jsx
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
  const { isLoading, setIsLoading } = useLoading();

  const recentIncidents = [...(incidents || [])]
    .sort((a, b) => {
      const dateA = DateTime.fromISO(a.reportedOn);
      const dateB = DateTime.fromISO(b.reportedOn);
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
    setIsLoading(true);
    router.push(`/incidents/${id}`);
  };

  if (hasIncidents) {
    return (
      <>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ p: 2, pb: 1, flexShrink: 0 }}
        >
          Recent Activity{" "}
          <Box
            component="span"
            sx={{
              color: "text.secondary",
              fontSize: "1.0rem",
              fontWeight: 500,
            }}
          >
            (Latest 5)
          </Box>
        </Typography>
        <Divider sx={{ mx: 2 }} />
        <List dense sx={{ px: 2 }}>
          {recentIncidents.map((incident, index) => (
            <ListItemButton
              key={incident.id}
              divider={index < recentIncidents.length - 1}
              onClick={() => handleItemClick(incident.id)}
              disabled={isLoading}
              sx={{ py: 1.5, px: 0 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  // === THIS IS THE FIX ===
                  flexWrap: "nowrap", // Prevents the right column from wrapping to a new line
                }}
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
                  </Box>
                </Box>
              </Box>
            </ListItemButton>
          ))}
        </List>
      </>
    );
  } else {
    // --- EMPTY VIEW ---
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No recent activity to display.
        </Typography>
      </Box>
    );
  }
}
