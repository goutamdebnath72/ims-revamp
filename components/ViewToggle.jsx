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

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: "999px",
        overflow: "hidden",
        width: "fit-content",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {/* Moving pill */}
      <div
        style={{
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
        <div
          onClick={() => onChange("general")}
          style={{
            position: "relative",
            padding: "6px 22px",
            zIndex: 2,
            color: isGeneral ? "red" : "#444",
            cursor: "pointer",
            borderRight: "none",
          }}
        >
          General View
        </div>
      </Tooltip>

      {/* System View */}
      <Tooltip title={systemTooltipContent} arrow>
        <div
          onClick={() => onChange("system")}
          style={{
            position: "relative",
            padding: "6px 22px",
            zIndex: 2,
            color: !isGeneral ? "red" : "#444",
            cursor: "pointer",
            borderLeft: "none",
          }}
        >
          System View
        </div>
      </Tooltip>
    </div>
  );
}
