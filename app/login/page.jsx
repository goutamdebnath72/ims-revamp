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
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false); // State for the eye icon
  const router = useRouter();
  const { status } = useSession();

  // This hook handles redirecting users who are already logged in.
  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to dashboard if already logged in
    }
  }, [status, router]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    // --- DETAILED DEBUGGING LOG ---
    console.log(`--- LOGIN ATTEMPT ---
    Timestamp: ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })}
    User ID: ${userId}
    -------------------------`);

    const res = await signIn("credentials", {
      redirect: false,
      userId,
      password,
    });

    if (res.ok) {
      // --- DETAILED DEBUGGING LOG ---
      console.log(`--- LOGIN SUCCESS ---
      User ID: ${userId} successfully authenticated. Redirecting...
      ---------------------`);
      window.location.href = "/";
    } else {
      // --- DETAILED DEBUGGING LOG ---
      console.log(`--- LOGIN FAILED ---
      Reason: Invalid credentials for User ID: ${userId}
      ----------------------`);
      setError("Invalid User ID or Password");
    }
  };

  // The loading check prevents the form from flashing while session is verified.
  if (status === "loading" || status === "authenticated") {
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
        }}
      >
        Loading . . .
      </Box>
    );
  }

  // Actual UI (only shown if status is 'unauthenticated')
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
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
            width: "100%",
            maxWidth: "440px",
            minHeight: "505px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          <Paper
            elevation={4}
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
              border: "1px solid rgba(0, 0, 0, 0.05)",
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
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  variant="outlined"
                  type={showPassword ? "text" : "password"} // <-- THIS LINE IS NEW
                  InputProps={{
                    // <-- THIS ENTIRE BLOCK IS NEW
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                    transition: "all 0.25s ease-in-out",
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
