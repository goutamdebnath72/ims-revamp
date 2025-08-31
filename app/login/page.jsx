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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginInfoPanel from "@/components/LoginInfoPanel";

/* ===========================
   Fluid scaling math (desktop)
   =========================== */
const VW_MIN = 1200; // lower end of your target desktop widths (~13")
const VW_MAX = 1920; // upper end (~24")

function fluidPx(minPx, maxPx) {
  // clamp(min, calc(b + m*vw), max)
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minPx}px, calc(${b}px + ${m}vw), ${maxPx}px)`;
}
function fluidRem(minRem, maxRem) {
  const minPx = minRem * 16,
    maxPx = maxRem * 16;
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minRem}rem, calc(${(b / 16).toFixed(
    4
  )}rem + ${m}vw), ${maxRem}rem)`;
}
function fluidEm(minEm, maxEm) {
  const minPx = minEm * 16,
    maxPx = maxEm * 16;
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minEm}em, calc(${(b / 16).toFixed(
    4
  )}em + ${m}vw), ${maxEm}em)`;
}

export default function LoginPage() {
  const [showPw, setShowPw] = React.useState(false);

  /* -------------------------
     Card shell quick controls
     ------------------------- */
  const LOGIN_CARD_H = "70vh"; // login card height (outer shell)
  const LOGIN_CARD_AR = 0.8; // width = height * aspect
  const LOGIN_CARD_MAX_W = "clamp(520px, 40vw, 760px)";

  /* -----------------------------
     SAIL logo aspect + scale knobs
     ----------------------------- */
  // Set this to our PNG's real ratio (width / height).
  const SAIL_LOGO_AR = 0.9527;
  // Width of the reserved logo slot; height comes from aspectRatio.
  const TOK_logoW = fluidPx(80, 150);

  /* ----------------------------------------
     ALL design tokens driven by viewport math
     ---------------------------------------- */
  const TOK = {
    // Paper padding + row spacing
    pad: fluidPx(12, 28),
    gapRows: fluidPx(0, 15),

    // Logo spacing
    logoMb: fluidPx(0, 15),

    // Title / subtitle
    titleFS: fluidRem(1.5, 2.7),
    titleLS: fluidEm(0.03, 0.03),
    titleMt: fluidPx(12, 14),

    subFS: fluidRem(0.9, 1.33),
    subMt: fluidPx(8, 12),

    // Form block
    fieldsMt: fluidPx(16, 28),
    fieldsGap: fluidPx(14, 29),
    inputH: fluidPx(42, 56),
    inputFS: fluidRem(0.95, 1.05),

    // Button
    btnMt: fluidPx(10, 16), // space above the button
    btnH: fluidPx(44, 56), // << fixed button HEIGHT (decouples from font)
    btnPx: fluidPx(16, 24), // horizontal padding (optional)
    btnFS: fluidRem(1.0, 1.14), // button font-size (now independent)
    btnLS: fluidEm(0.1, 0.12), // << letter-spacing for "SIGN IN"
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
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
        {/* LEFT HALF (Need-to-know) */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <LoginInfoPanel />
        </Box>

        {/* CENTER DIVIDER - exactly centered & 85% viewport height */}
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

        {/* RIGHT HALF (Login card) */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              height: LOGIN_CARD_H,
              width: `min(100%, calc(${LOGIN_CARD_H} * ${LOGIN_CARD_AR}))`,
              maxWidth: LOGIN_CARD_MAX_W,
              display: "flex",
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateRows: "auto auto auto 1fr auto", // logo, title, subtitle, form, button
                rowGap: TOK.gapRows,
                borderRadius: 2,
                p: TOK.pad,
                boxSizing: "border-box",
              }}
            >
              {/* -------- Reserved logo slot (keeps AR, no layout shift) -------- */}
              <Box
                sx={{
                  width: `min(100%, ${TOK_logoW})`,
                  aspectRatio: SAIL_LOGO_AR,
                  mx: "auto",
                  mb: TOK.logoMb,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  alt="SAIL"
                  src="/sail-logo.png"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>

              {/* ---------------- Title ---------------- */}
              <Typography
                component="h1"
                sx={{
                  fontSize: TOK.titleFS,
                  letterSpacing: TOK.titleLS,
                  lineHeight: 1.1,
                  mt: TOK.titleMt,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                IMS Login
              </Typography>

              {/* ---------------- Subtitle ---------------- */}
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: TOK.subFS,
                  mt: TOK.subMt,
                  lineHeight: 1.35,
                  textAlign: "center",
                }}
              >
                Incident Management System - DSP
              </Typography>

              {/* ---------------- Form body (scroll-safe) ---------------- */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TOK.fieldsGap,
                  overflow: "auto",
                  minHeight: 0,
                  mt: TOK.fieldsMt,
                }}
              >
                <TextField
                  fullWidth
                  label="User ID / Ticket No. *"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": { height: TOK.inputH },
                    "& .MuiInputBase-input": { fontSize: TOK.inputFS },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password *"
                  size="medium"
                  type={showPw ? "text" : "password"}
                  sx={{
                    "& .MuiOutlinedInput-root": { height: TOK.inputH },
                    "& .MuiInputBase-input": { fontSize: TOK.inputFS },
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

              {/* ---------------- Button ---------------- */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: TOK.btnMt,
                  height: TOK.btnH, // fixed height
                  minHeight: TOK.btnH,
                  py: 0, // vertical padding no longer controls height
                  px: TOK.btnPx, // optional: control width feel
                  fontSize: TOK.btnFS, // text can scale freely…
                  lineHeight: 1, // …without inflating height
                  letterSpacing: TOK.btnLS, // << letter-spacing token
                  fontWeight: 700,
                  alignSelf: "stretch",
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
