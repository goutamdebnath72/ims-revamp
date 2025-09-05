"use client";

import * as React from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { fluidPx, fluidRem } from "@/utils/fluidScale";

// --- Design Tokens Object ---
const TOK = {
  cardPad: fluidPx(12, 24),
  headerFS: fluidRem(1.0, 1.5),
  headerMb: fluidPx(8, 20),
};

export default function ActionFormContainer({
  children,
  isAuditTrailExpanded,
}) {
  return (
    <Box
      sx={{
        flex: isAuditTrailExpanded ? "1 1 0%" : "1 1 calc(50% - 4px)",
        minHeight: 0,
        opacity: isAuditTrailExpanded ? 0 : 1,
        visibility: isAuditTrailExpanded ? "hidden" : "visible",
        transition: "flex 0.3s ease-in-out, opacity 0.2s ease-in-out",
        zIndex: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: TOK.cardPad,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexShrink: 0, mb: TOK.headerMb }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: TOK.headerFS }}>
            Take Action
          </Typography>
          <Divider />
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>{children}</Box>
      </Paper>
    </Box>
  );
}
