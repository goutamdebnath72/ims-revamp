// components/TeamAvailabilityCard.jsx
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { teamMembers } from "@/lib/team-availability";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

const C_AND_IT_DEPT_CODES = [98540, 98500];

export default function TeamAvailabilityCard() {
  const { data: session } = useSession();
  const user = session?.user;

  if (
    !user ||
    !user.departmentCode ||
    !C_AND_IT_DEPT_CODES.includes(user.departmentCode)
  ) {
    return null;
  }

  const onLeave = teamMembers.filter((member) => member.status === "On Leave");

  // The outer <Paper> and the scrolling <Box> have been removed.
  // The component now only renders its content.
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ flexShrink: 0, p: 1, pb: 0 }}>
        Team Availability (On Leave)
      </Typography>
      <List dense>
        {onLeave.length > 0 ? (
          onLeave.map((member, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <BeachAccessIcon color="action" />
              </ListItemIcon>
              <ListItemText primary={member.name} />
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Everyone is available today.
          </Typography>
        )}
      </List>
    </>
  );
}
