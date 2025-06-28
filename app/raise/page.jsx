"use client";

import * as React from "react";
import { useRouter } from 'next/navigation'; // <-- Import the router
import { IncidentContext } from "@/context/IncidentContext"; // <-- Import our new context
import { NotificationContext } from "@/context/NotificationContext"; // <-- To show success
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";

export default function RaiseIncidentPage() {
  const router = useRouter();
  const { addIncident } = React.useContext(IncidentContext);
  const { showNotification } = React.useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    
    // Simulate a short delay for the submission process
    setTimeout(() => {
      try {
        const newIncident = addIncident(formData); // Use our context function
        setSubmittedIncidentId(newIncident.id);
        showNotification("Incident submitted successfully!", "success");
      } catch (error) {
        showNotification("Failed to submit incident. Please try again.", "error");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // 1-second delay to show submitting state
  };
  
  const handleRaiseAnother = () => {
      setSubmittedIncidentId(null);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Raise a New Incident</Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        {/* If an incident has been submitted, show success message */}
        {submittedIncidentId ? (
          <Stack spacing={3} alignItems="center">
             <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
              <AlertTitle>Success!</AlertTitle>
              Your incident has been submitted successfully with ID: <strong>{submittedIncidentId}</strong>.
            </Alert>
            <Stack direction="row" spacing={2}>
                 <Button
                    variant="contained"
                    onClick={() => router.push(`/incidents/${submittedIncidentId}`)}
                 >
                    View Incident Details
                </Button>
                 <Button variant="outlined" onClick={handleRaiseAnother}>
                    Raise Another Incident
                </Button>
            </Stack>
          </Stack>
        ) : (
          // Otherwise, show the form
          <RaiseIncidentForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Paper>
    </Stack>
  );
}