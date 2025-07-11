// File: app/(main)/raise/page.jsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IncidentContext } from "@/context/IncidentContext";
import { NotificationContext } from "@/context/NotificationContext";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import RaiseIncidentForm from "@/components/RaiseIncidentForm";

const C_AND_IT_DEPT_CODES = [98540, 98541, 98500];

export default function RaiseIncidentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addIncident } = React.useContext(IncidentContext);
  const { showNotification } = React.useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedIncidentId, setSubmittedIncidentId] = React.useState(null);

  const user = session?.user;

  if (status === "loading") return null;
  if (!user) {
    return (
      <Typography variant="h6" sx={{ m: 4 }}>
        Unauthorized
      </Typography>
    );
  }

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const newIncident = addIncident(formData);
        setSubmittedIncidentId(newIncident.id);

        const isCITEmployee =
          user && C_AND_IT_DEPT_CODES.includes(user.departmentCode);
        if (!isCITEmployee) {
          showNotification(
            {
              title: "Success!",
              message: `Your incident #${newIncident.id} has been submitted.`,
            },
            "success"
          );
        }
      } catch (error) {
        showNotification(
          {
            title: "Error",
            message: "Failed to submit incident. Please try again.",
          },
          "error"
        );
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
            <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
              <AlertTitle>Submission Successful!</AlertTitle>
              Your incident has been submitted with ID:{" "}
              <strong>{submittedIncidentId}</strong>.
            </Alert>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() =>
                  router.push(`/incidents/${submittedIncidentId}`)
                }
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