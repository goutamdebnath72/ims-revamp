"use client";

import * as React from "react";
// Import useState for state and signIn for authentication
import { useState } from "react";
import { signIn } from "next-auth/react";
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
const VW_MIN = 1200;
const VW_MAX = 1920;

function fluidPx(minPx, maxPx) {
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

  // State variables to hold user input and loading status
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // The function that runs when the form is submitted
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevents the browser from reloading the page
    setLoading(true);
    console.log("Attempting to sign in with:", { userId, password });

    try {
      const result = await signIn("credentials", {
        redirect: false,
        userId: userId,
        password: password,
      });

      console.log("NextAuth signIn result:", result);

      if (result.error) {
        console.error("Login failed:", result.error);
        alert("Login failed! Please check your User ID and Password.");
        setLoading(false);
      } else if (result.ok) {
        console.log("Login successful, redirecting...");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  /* Card shell quick controls */
  const LOGIN_CARD_H = "70vh";
  const LOGIN_CARD_AR = 0.8;
  const LOGIN_CARD_MAX_W = "clamp(320px, 26vw, 650px)";

  const TOK = {
    pad: fluidPx(12, 28),
    gapRows: fluidPx(0, 15),
    logoMb: fluidPx(0, 15),
    titleFS: fluidRem(1.3, 2.7),
    titleLS: fluidEm(0.04, 0.03),
    titleMt: fluidPx(12, 14),
    subFS: fluidRem(0.9, 1.33),
    subMt: fluidPx(8, 12),
    fieldsMt: fluidPx(22, 28),
    fieldsGap: fluidPx(18, 29),
    inputH: fluidPx(42, 56),
    inputFS: fluidRem(0.95, 1.05),
    btnMt: fluidPx(10, 16),
    btnH: fluidPx(44, 56),
    btnPx: fluidPx(16, 24),
    btnFS: fluidRem(1.0, 1.14),
    btnLS: fluidEm(0.1, 0.12),
  };
  const SAIL_LOGO_AR = 0.9527;
  const TOK_logoW = fluidPx(80, 150);

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
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <LoginInfoPanel />
        </Box>
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
              component="form"
              onSubmit={handleLogin}
              elevation={8}
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateRows: "auto auto auto 1fr auto",
                rowGap: TOK.gapRows,
                borderRadius: 2,
                p: TOK.pad,
                boxSizing: "border-box",
              }}
            >
              {/* Logo */}
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
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>

              {/* Title */}
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

              {/* Subtitle */}
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

              {/* Form Fields */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TOK.fieldsGap,
                  overflow: "auto",
                  minHeight: 0,
                  pt: TOK.fieldsMt,
                }}
              >
                <TextField
                  fullWidth
                  label="User ID / Ticket No. *"
                  size="medium"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: TOK.inputFS,
                      padding: `${fluidPx(9, 15)} 14px`,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password *"
                  size="medium"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: TOK.inputFS,
                      padding: `${fluidPx(9, 15)} 14px`,
                    },
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

              {/* Submit Button */}
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={loading || !userId || !password}
                sx={{
                  mt: TOK.btnMt,
                  height: TOK.btnH,
                  minHeight: TOK.btnH,
                  py: 0,
                  px: TOK.btnPx,
                  fontSize: TOK.btnFS,
                  lineHeight: 1,
                  letterSpacing: TOK.btnLS,
                  fontWeight: 700,
                  alignSelf: "stretch",
                }}
              >
                {/* Show loading text */}
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
