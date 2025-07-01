// File: app/raise/page.jsx
// UPDATED: The success notification is now conditional based on user role.
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { IncidentContext, C_AND_IT_DEPT_CODES } from "@/context/IncidentContext"; // <-- Import constant
import { NotificationContext } from "@/context/NotificationContext";
import { UserContext } from "@/context/UserContext"; // <-- Import UserContext
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
  const { user } = React.useContext(UserContext); // <-- Get the logged-in user
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        const newIncident = addIncident(formData);
        setSubmittedIncidentId(newIncident.id);

        // --- THIS IS THE NEW LOGIC ---
        // Only show this generic success message if the user is NOT a C&IT employee
        const isCITEmployee = user && C_AND_IT_DEPT_CODES.includes(user.departmentCode);
        if (!isCITEmployee) {
            showNotification({ title: "Success!", message: `Your incident #${newIncident.id} has been submitted.` }, "success");
        }
        // C&IT employees will see the "New Incident Raised" notification from the IncidentContext instead.

      } catch (error) {
        showNotification({ title: "Error", message: "Failed to submit incident. Please try again." }, "error");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  const handleRaiseAnother = () => {
      setSubmittedIncidentId(null);
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Raise a New Incident</Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        {submittedIncidentId ? (
          <Stack spacing={3} alignItems="center">
             <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
              <AlertTitle>Submission Successful!</AlertTitle>
              Your incident has been submitted with ID: <strong>{submittedIncidentId}</strong>.
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
          <RaiseIncidentForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Paper>
    </Stack>
  );
}