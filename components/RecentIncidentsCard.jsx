// components/RecentIncidentsCard.jsx
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
import { fluidRem, fluidPx } from "@/utils/fluidScale";

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
              sx={{ py: fluidPx(12, 10), px: 0 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  flexWrap: "nowrap",
                }}
              >
                <ListItemText
                  primary={incident.incidentType?.name}
                  secondary={`#${incident.id} - Reported by ${
                    incident.requestor?.name || "Unknown"
                  }`}
                  sx={{ m: 0 }}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: fluidRem(0.9, 0.85),
                      "@media (min-width: 1200px) and (max-width: 1600px)": {
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                      },
                      "@media (min-width: 1800px)": {
                        fontSize: "0.85rem",
                        lineHeight: 1.4,
                      },
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontSize: fluidRem(0.75, 0.7),
                      "@media (min-width: 1200px) and (max-width: 1600px)": {
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                      },
                      "@media (min-width: 1800px)": {
                        fontSize: "0.80rem",
                        lineHeight: 1.4,
                      },
                    },
                  }}
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
                      fontSize: fluidRem(0.8, 0.75),
                      "@media (min-width: 1200px) and (max-width: 1600px)": {
                        fontSize: "0.75rem",
                        width: "30px",
                      },
                      "@media (min-width: 1800px)": {
                        fontSize: "0.95rem",
                        lineHeight: 1.4,
                      },
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
                      fontSize: fluidRem(0.8, 0.75),
                      "@media (min-width: 1200px) and (max-width: 1600px)": {
                        fontSize: "0.75rem",
                        width: "120px",
                      },
                      "@media (min-width: 1800px)": {
                        fontSize: "0.90rem",
                        lineHeight: 1.4,
                      },
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
                        sx={{
                          // Media query for the specific screen size range
                          "@media (min-width: 1200px) and (max-width: 1600px)":
                            {
                              // This targets the text inside the chip
                              "& .MuiChip-label": {
                                fontSize: "0.75rem", // You can tweak this value
                                padding: "0 6px", // You can also adjust padding if needed
                              },
                            },
                        }}
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
