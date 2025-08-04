"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";

// A sub-component for the list items to ensure consistent styling
const InfoListItem = ({ children }) => (
  <Box
    sx={{
      position: "relative",
      pl: "2rem",
      "&::before": {
        content: '""',
        position: "absolute",
        left: "0.5rem",
        top: "0.6rem",
        width: "9px",
        height: "9px",
        backgroundColor: "#5d92e8",
        borderRadius: "50%",
      },
    }}
  >
    <Typography
      variant="body1"
      sx={{
        // --- FINAL FONT IDENTIFICATION ---
        // Prioritizing Gill Sans as it's the font from the reference image.
        fontFamily:
          '"Gill Sans", "Gill Sans MT", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: "1.35rem",
        fontWeight: 400,
        lineHeight: 1.7,
      }}
    >
      {children}
    </Typography>
  </Box>
);

// The main LoginInfoPanel component
export default function LoginInfoPanel() {
  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: "450px",
        minHeight: "650px",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        borderRadius: 2,
        bgcolor: "background.paper",
        p: { xs: 2, md: 3 },
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      <Box
        component="fieldset"
        sx={{
          border: "2px solid black",
          borderRadius: 0,
          p: { xs: 2, md: "2rem 3rem" },
          width: "100%",
        }}
      >
        <Box
          component="legend"
          sx={{
            px: "1rem",
            mx: "auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "0.18em",
              color: "common.black",
              whiteSpace: "nowrap",
            }}
          >
            NEED TO KNOW
          </Typography>
        </Box>

        {/* List Content Section */}
        <Stack spacing={4}>
          <InfoListItem>
            Sign in using your Employee Self Service (Payslip Viewing)
            Credentials.
          </InfoListItem>
          <InfoListItem>
            <Link
              href="#"
              underline="always"
              sx={{
                color: "text.primary",
                // Ensure the link font matches the other items
                fontFamily:
                  '"Gill Sans", "Gill Sans MT", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 400,
              }}
            >
              Read Before Login
            </Link>
          </InfoListItem>
          <InfoListItem>
            <Link
              href="#"
              underline="always"
              sx={{
                color: "text.primary",
                fontFamily:
                  '"Gill Sans", "Gill Sans MT", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 400,
              }}
            >
              Terms of Use
            </Link>
          </InfoListItem>
          <InfoListItem>Help Desk PAX: 42046</InfoListItem>
        </Stack>
      </Box>
    </Paper>
  );
}
