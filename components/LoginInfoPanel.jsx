"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";

const INFO_FS = "clamp(1.05rem, 1.55vw, 1.45rem)";
// Legend sizing knobs — tuned to match your xs:1.28, sm:1.48, md:1.55
export const LEGEND_FS = "clamp(1.1rem, calc(1rem + 0.25vw), 1.55rem)";
// (optional) letter-spacing that grows gently but stays capped
export const LEGEND_LS = "clamp(0.05em, calc(0.10em + 0.01vw), 0.15em)";
export const PAX_LS = "clamp(0.02em, calc(0.012em + 0.10vw), 0.06em)";
// Bullet controls — tweak these three to taste
// Bullet controls (scale with text size)
export const BULLET_SIZE = "clamp(0.40em, 0.48em, 0.58em)"; // diameter
export const BULLET_TOP = "clamp(0.40lh, 0.58lh, 0.68lh)"; // ↓ bigger = lower
export const BULLET_LEFT = "clamp(0.40rem, 0.45vw, 0.70rem)"; // → bigger = more gap

/* How clamp() actually works
   clamp(min, preferred, max) returns the preferred value, but clipped to the min/max range:

   result = max(min(preferred, max), min)

   So:
   
   If preferred is between min & max → we get preferred.
   
   If preferred < min → you get min.
   
   If preferred > max → you get max.

   That’s why changing only the max didn’t move your bullet: your current viewport was already using the preferred term.*/

/* Bullet + line item that scales smoothly */
const InfoListItem = ({ children }) => (
  <Box
    sx={{
      position: "relative",
      // slightly lighter indent to gain line length on 14"
      pl: "clamp(0.9rem, 1.6vw, 1.6rem)",
      "&::before": {
        content: '""',
        position: "absolute",
        left: BULLET_LEFT,
        top: BULLET_TOP,
        width: BULLET_SIZE,
        height: BULLET_SIZE,
        backgroundColor: "#5d92e8",
        borderRadius: "50%",
        //transform: "translateY(-50%)",
      },
    }}
  >
    <Typography
      component="span"
      sx={{
        fontFamily:
          '"Gill Sans","Gill Sans MT","Helvetica Neue",Helvetica,Arial,sans-serif',
        // a touch smaller minimum + tighter line-height to avoid overflow
        fontSize: INFO_FS,
        fontWeight: 400,
        lineHeight: 1.5,
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default function LoginInfoPanel() {
  return (
    <Paper
      elevation={8}
      sx={{
        aspectRatio: 0.692,
        // safe caps so it never overflows 14" fullscreen, but still generous on 24"
        height: "clamp(420px, 68vh, 620px)",
        maxWidth: "min(44vw, 540px)",
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "background.paper",
        // trim outer padding a little on small screens
        p: "clamp(0.6rem, 1.6vw, 1.1rem)",
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      {/* Black bordered box */}
      <Box
        component="fieldset"
        sx={{
          border: "2px solid black",
          borderRadius: 0,
          width: "100%",
          height: "100%",
          // slightly tighter padding => more line length; also helps kill the scrollbar
          padding: "clamp(0.8rem, 2vw, 1.6rem)",
          margin: 0,
          // allow children (legend) to shrink, and avoid a scrollbar unless truly needed
          minWidth: 0,
          overflowY: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Legend (kept native, but shrink-safe) */}
        <Box
          component="legend"
          sx={{
            px: "clamp(0.5rem, 1.2vw, 0.9rem)",
            mx: "auto",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
              fontWeight: 700,
              // trims min size & letter-spacing so it never pushes borders on 14"
              fontSize: LEGEND_FS,
              letterSpacing: LEGEND_LS,
              color: "common.black",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
            }}
          >
            NEED TO KNOW
          </Typography>
        </Box>

        {/* Bulleted content */}
        <Stack
          // slightly tighter rhythm; helps remove the scrollbar at 14"
          spacing="clamp(0.9rem, 2vw, 1.4rem)"
          sx={{ mt: "clamp(0.45rem, 1vw, 0.8rem)" }}
        >
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
                fontFamily:
                  '"Gill Sans","Gill Sans MT","Helvetica Neue",Helvetica,Arial,sans-serif',
                fontWeight: 400,
                fontSize: INFO_FS,
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
                  '"Gill Sans","Gill Sans MT","Helvetica Neue",Helvetica,Arial,sans-serif',
                fontWeight: 400,
                fontSize: INFO_FS,
              }}
            >
              Terms of Use
            </Link>
          </InfoListItem>

          <InfoListItem>
            Help Desk PAX:&nbsp;
            <Box
              component="span"
              sx={{
                display: "inline-block",
                fontWeight: 700,
                fontSize: "clamp(0.88rem, 1.35vw, 1.6rem)",
                letterSpacing: PAX_LS,
                color: "primary.main",
                backgroundColor: "#e3f2fd",
                padding: "clamp(1px, 0.25vw, 3px) clamp(4px, 0.5vw, 8px)",
                borderRadius: "4px",
                lineHeight: 1.2,
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
