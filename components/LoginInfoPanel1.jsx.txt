"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

function LegendTitle() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        columnGap: "clamp(8px, 1vw, 14px)",
        mb: "clamp(10px, 1.4vw, 16px)",
      }}
    >
      <Box sx={{ height: 2, bgcolor: "text.primary", opacity: 0.7 }} />
      <Typography
        sx={{
          fontSize: "clamp(1.0rem, 1.4vw, 1.25rem)",
          fontWeight: 800,
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
        }}
      >
        NEED TO KNOW
      </Typography>
      <Box sx={{ height: 2, bgcolor: "text.primary", opacity: 0.7 }} />
    </Box>
  );
}

export default function LoginInfoPanel() {
  return (
    // 80% viewport height; width from a slightly wider aspect (0.74)
    <Box
      sx={{
        height: "80vh",
        width: "min(100%, calc(80vh * 0.74))",
        maxWidth: "clamp(520px, 38vw, 640px)",
        display: "flex",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          borderRadius: 2,
          bgcolor: "background.paper",
          p: "clamp(0.8rem, 1.6vw, 1.2rem)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* inner bordered region; scrolls if ever needed */}
        <Box
          sx={{
            border: "2px solid",
            borderColor: "text.primary",
            borderRadius: "6px",
            p: "clamp(0.9rem, 1.7vw, 1.3rem)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 24px rgba(0,0,0,.06)",
            overflow: "auto",
          }}
        >
          <LegendTitle />

          <List
            disablePadding
            sx={{
              "& .MuiListItem-root": {
                px: 0,
                py: "clamp(6px, 0.9vw, 10px)",
              },
            }}
          >
            <ListItem>
              <ListItemIcon sx={{ minWidth: "28px", color: "#4b7bd6" }}>
                •
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
                    lineHeight: 1.5,
                  },
                }}
                primary={
                  <>
                    Sign in using your Employee Self Service (Payslip Viewing)
                    Credentials.
                  </>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon sx={{ minWidth: "28px", color: "#4b7bd6" }}>
                •
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
                    textDecoration: "underline",
                  },
                }}
                primary="Read Before Login"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon sx={{ minWidth: "28px", color: "#4b7bd6" }}>
                •
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
                    textDecoration: "underline",
                  },
                }}
                primary="Terms of Use"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon sx={{ minWidth: "28px", color: "#4b7bd6" }}>
                •
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  sx: { fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)" },
                }}
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>Help Desk PAX:</span>
                    <Chip
                      label="42046"
                      sx={{
                        fontWeight: 700,
                        fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
                        px: "6px",
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
}
