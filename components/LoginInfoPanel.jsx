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
      pl: { xs: "1.5rem", md: "2rem" },
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
        // Prioritizing Gill Sans as it's the font from the reference image.
        fontFamily:
          '"Gill Sans", "Gill Sans MT", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: { xs: "1rem", sm: "1.15rem", md: "1.4rem" },

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
        aspectRatio: 0.692,
        // Use a responsive width instead of aspect-ratio
        //width: { xs: "90vw", sm: "450px" },
        //maxWidth: "450px",

        height: "75%",
        //minHeight: "500px",
        //maxHeight: "700px",
        //overflowY: "auto",
        overflow: "hidden",
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
          // Use breakpoints for padding
          padding: { xs: "1rem 1.5rem", md: "2rem 2.5rem" },
          width: "100%",
          overflowY: "auto",
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
              // Use breakpoints for font size and letter spacing
              fontSize: { xs: "1.2rem", sm: "1.35rem", md: "1.6rem" },
              letterSpacing: { xs: "0.1em", md: "0.18em" },
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
          <InfoListItem>
            Help Desk PAX:{" "}
            <Box
              component="span"
              sx={{
                fontWeight: "bold",
                color: "primary.main", // Uses your theme's primary color
                backgroundColor: "#e3f2fd", // A light blue background
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              42046
            </Box>
          </InfoListItem>
        </Stack>
      </Box>
    </Paper>
  );
}
