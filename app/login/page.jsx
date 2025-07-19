"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import LoginInfoPanel from "@/components/LoginInfoPanel";

export default function LoginPage() {
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  // Add this line
  const router = useRouter();
  const { status } = useSession();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      userId,
      password,
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Invalid User ID or Password");
    }
  };

  // Stage 1: Force full-screen loading fallback
  if (status === "loading") {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          fontWeight: 600,
          letterSpacing: "1px",
          background: "linear-gradient(to top, #eef2f3, #ffffff)",
          transition: "opacity 0.3s ease",
        }}
      >
        Loading . . .
      </Box>
    );
  }

  // Stage 2: Actual UI with smooth fade-in
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        background: "linear-gradient(to top, #eef2f3, #ffffff)",
        padding: 0,
        opacity: 0, 
        animation: "fadeIn 0.5s ease 0.1s forwards",
        "@keyframes fadeIn": {
          to: { opacity: 1 },
        },
      }}
    >
      {/* Left Column */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 50%",
          px: 2,
          minWidth: "0",
        }}
      >
        <LoginInfoPanel />
      </Box>

      {/* Vertical Divider */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 1px",
          height: "700px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          alignSelf: "center",
          mx: 0,
        }}
      />

      {/* Right Column */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: "0 0 50%",
          px: 0,
        }}
      >
        <Box
          sx={{
            width: "475px",
            minHeight: "505px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          <Paper
            elevation={8}
            sx={{
              px: 4,
              py: 3,
              width: "100%",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              boxSizing: "border-box",
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 2 }}>
              <Image
                src="/sail-logo.png"
                alt="SAIL Logo"
                width={130}
                height={0}
                priority
                style={{ height: "auto", width: "130px" }}
              />
            </Box>

            {/* Main Title */}
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 400,
                color: "#1a1a1a",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              IMS Login
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#666",
                fontSize: "1rem",
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              Incident Management System - DSP
            </Typography>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ width: "100%", maxWidth: "395px" }}
            >
              <Stack spacing={2.25}>
                <TextField
                  required
                  fullWidth
                  id="userId"
                  label="User ID / Ticket No."
                  name="userId"
                  autoComplete="username"
                  autoFocus
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  error={!!error}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      "& fieldset": { borderColor: "#ddd", borderWidth: "1px" },
                      "&:hover fieldset": { borderColor: "#4A90E2" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4A90E2",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "1rem",
                      color: "#666",
                      "&.Mui-focused": { color: "#4A90E2" },
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      "& fieldset": { borderColor: "#ddd", borderWidth: "1px" },
                      "&:hover fieldset": { borderColor: "#4A90E2" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4A90E2",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "1rem",
                      color: "#666",
                      "&.Mui-focused": { color: "#4A90E2" },
                    },
                  }}
                />
                {error && (
                  <Alert severity="error" sx={{ fontSize: "0.9rem", py: 1 }}>
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    backgroundColor: "#4A90E2",
                    borderRadius: "6px",
                    height: "48px",
                    boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
                    "&:hover": {
                      backgroundColor: "#357ABD",
                      boxShadow: "0 6px 16px rgba(74, 144, 226, 0.4)",
                    },
                    "&:active": {
                      boxShadow: "0 2px 8px rgba(74, 144, 226, 0.3)",
                    },
                  }}
                >
                  SIGN IN
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
