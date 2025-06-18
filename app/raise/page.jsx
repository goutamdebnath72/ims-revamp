// File: app/raise/page.jsx
// This is the main page for the "Raise Incident" route.
"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";

export default function RaiseIncidentPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState(null); // null, 'success', or 'error'

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    console.log("Submitting incident:", formData);

    // --- Simulate an API call ---
    // In a real application, you would use fetch() to send data to your Express.js backend.
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2 second network delay
    // ----------------------------

    // For demonstration, we'll randomly succeed or fail.
    const isSuccess = Math.random() > 0.2; //  80% chance of success

    if (isSuccess) {
      setSubmissionStatus("success");
      // In a real app, you might get back the new incident ID from the server.
    } else {
      setSubmissionStatus("error");
    }

    setIsSubmitting(false);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Raise a New Incident</Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        {/* We only show the form if a submission is NOT successful */}
        {submissionStatus !== "success" ? (
          <RaiseIncidentForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null}

        {/* Show a success message after successful submission */}
        {submissionStatus === "success" && (
          <Alert severity="success" variant="filled">
            <AlertTitle>Success!</AlertTitle>
            Your incident has been submitted successfully. A member of the C&IT
            team will review it shortly.
          </Alert>
        )}

        {/* Show an error message if submission fails */}
        {submissionStatus === "error" && (
          <Alert severity="error" variant="filled">
            <AlertTitle>Submission Failed</AlertTitle>
            There was a problem submitting your incident. Please try again in a
            few moments.
          </Alert>
        )}
      </Paper>
    </Stack>
  );
}
