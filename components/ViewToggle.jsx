// components/ViewToggle.jsx
import { useState } from "react";
import { Tooltip } from "@mui/material";
import { SYSTEM_INCIDENT_TYPES } from "@/lib/incident-helpers";
import { Divider, Box, Typography } from "@mui/material";

export default function ViewToggle({ selectedView, onChange }) {
  const isGeneral = selectedView === "general";
  const systemTooltipContent = (
    <Box sx={{ textAlign: "left", p: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        System Incident Types
      </Typography>
      <Divider sx={{ my: 1, borderColor: "grey.500" }} />
      {SYSTEM_INCIDENT_TYPES.map((type) => (
        <Typography key={type} variant="caption" display="block">
          {type}
        </Typography>
      ))}
    </Box>
  );

  // --- START: REFACTORED FOR RESPONSIVE SIZING ---
  // A single style object for the buttons to keep them consistent
  const buttonStyles = {
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    // Base (mobile-first) size
    padding: "6px 22px",
    fontSize: "16px",
    // Responsive overrides
    "@media (min-width: 1200px) and (max-width: 1499px)": {
      padding: "4px 15px",
      fontSize: "13px",
    },
    "@media (min-width: 1500px) and (max-width: 1599px)": {
      padding: "5px 17px",
      fontSize: "14px",
    },
    "@media (min-width: 1800px)": {
      padding: "6px 20px",
      fontSize: "14px",
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: "999px",
        overflow: "hidden",
        width: "fit-content",
        fontWeight: 600,
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Moving pill */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: isGeneral ? 0 : "50%",
          width: "50%",
          height: "100%",
          backgroundColor: "#ffecec",
          border: "1px solid red",
          borderRadius: "999px",
          transition: "left 0.3s ease",
          zIndex: 1,
        }}
      />

      {/* General View */}
      <Tooltip>
        <Box
          onClick={() => onChange("general")}
          sx={{
            ...buttonStyles,
            color: isGeneral ? "red" : "#444",
          }}
        >
          General View
        </Box>
      </Tooltip>

      {/* System View */}
      <Tooltip title={systemTooltipContent} arrow>
        <Box
          onClick={() => onChange("system")}
          sx={{
            ...buttonStyles,
            color: !isGeneral ? "red" : "#444",
          }}
        >
          System View
        </Box>
      </Tooltip>
    </Box>
  );
  // --- END: REFACTORED FOR RESPONSIVE SIZING ---
}