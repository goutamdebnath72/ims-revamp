"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginInfoPanel from "@/components/LoginInfoPanel";

export default function LoginPage() {
  const [showPw, setShowPw] = React.useState(false);
  // --- Tweak knobs ---
  const TITLE_MT = "clamp(0px, 0.0vw, 20px)"; // push "IMS Login" DOWN from the logo
  const SUBTITLE_MT = "clamp(2px, 0.5vw, 18px)"; // push subtitle DOWN from the title
  const SUBTITLE_FS = "clamp(1.05rem, 1.25vw, 1.35rem)"; // subtitle size ↑ (tweak freely)
  // --- SAIL logo sizing knobs ---
  const LOGO_AR = 0.9527; // width / height.
  // e.g. if the image is 220×200px => 1.1 ; if 200×220px => 0.909
  const LOGO_W = "clamp(128px, 7.0vw, 220px)"; // overall scale; tweak to taste

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw", // full viewport -> halves are true halves
        overflowX: "hidden",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      {/* Full-width row split exactly in half with a 1px center rail */}
      <Box
        sx={{
          width: "100vw",
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          alignItems: "center",
          justifyItems: "center",
          px: "clamp(16px, 4vw, 48px)",
          gap: "clamp(16px, 3vw, 48px)",
        }}
      >
        {/* LEFT HALF (card is centered inside its half) */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <LoginInfoPanel />
        </Box>

        {/* EXACTLY CENTERED DIVIDER (85% viewport height) */}
        <Box
          sx={{
            width: "1px",
            height: "85vh",
            backgroundColor: "rgba(0,0,0,.22)",
            borderRadius: "1px",
            alignSelf: "center",
            justifySelf: "center",
          }}
        />

        {/* RIGHT HALF (card centered inside its half) */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {/* Card shell: 60vh tall; width from a wider aspect (≈1.05) but capped */}
          <Box
            sx={{
              height: "60vh",
              // width = height * 1.05 (wider), but never exceed a sane cap
              width: "min(100%, calc(60vh * 0.85))",
              maxWidth: "clamp(520px, 36vw, 720px)",
              display: "flex",
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                p: "clamp(18px, 2vw, 28px)",
                boxSizing: "border-box",
                overflow: "hidden",
                gap: "clamp(8px, 1.1vw, 12px)",
              }}
            >
              {/* --Reserved logo slot: aspect-ratio container-- to avoid layout shift */}
              <Box
                sx={{
                  // the slot (reserved space) keeps the same aspect ratio as the image:
                  width: `min(100%, ${LOGO_W})`,
                  aspectRatio: LOGO_AR, // <— container’s height derives from width
                  mx: "auto", // <— centers horizontally in the card
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center", // keep the image perfectly centered inside
                  mb: "clamp(6px, .8vw, 12px)",
                }}
              >
                <Box
                  component="img"
                  alt="SAIL"
                  src="/sail-logo.png"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // preserves the image’s native ratio
                    display: "block",
                  }}
                />
              </Box>

              {/* Titles */}
              <Box sx={{ textAlign: "center", flexShrink: 0 }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: "clamp(1.6rem, 2.2vw, 2.8rem)",
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    lineHeight: 1.1,
                    mt: TITLE_MT,
                  }}
                >
                  IMS Login
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: SUBTITLE_FS,
                    lineHeight: 1.35,
                    mt: SUBTITLE_MT,
                  }}
                >
                  Incident Management System - DSP
                </Typography>
              </Box>

              {/* Form body (scrolls if space is tight) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(14px, 1.6vw, 22px)",
                  overflow: "auto",
                  flex: 1,
                  mt: "clamp(12px, 1.2vw, 18px)",
                  minHeight: 0,
                }}
              >
                <TextField
                  fullWidth
                  label="User ID / Ticket No. *"
                  size="medium"
                  inputProps={{
                    style: { fontSize: "clamp(0.95rem, 1vw, 1.05rem)" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password *"
                  size="medium"
                  type={showPw ? "text" : "password"}
                  inputProps={{
                    style: { fontSize: "clamp(0.95rem, 1vw, 1.05rem)" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((s) => !s)}
                          edge="end"
                          aria-label={
                            showPw ? "Hide password" : "Show password"
                          }
                        >
                          {showPw ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Button stays inside the card; never overflows */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  py: "clamp(10px, 1.1vw, 14px)",
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  fontSize: "clamp(0.95rem, 1vw, 1.05rem)",
                  alignSelf: "stretch",
                  flexShrink: 0,
                }}
              >
                SIGN IN
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
