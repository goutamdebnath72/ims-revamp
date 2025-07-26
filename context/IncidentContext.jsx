"use client";

import * as React from "react";
import { NotificationContext } from "./NotificationContext";

export const IncidentContext = React.createContext(null);

export default function IncidentProvider({ children }) {
  const [incidents, setIncidents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { showNotification } = React.useContext(NotificationContext);

  const fetchIncidents = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/incidents");
      if (!response.ok) throw new Error("Failed to fetch incidents");
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error(error);
      showNotification(
        { title: "Error", message: "Could not load incident data." },
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  React.useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const updateIncident = async (incidentId, updatedData) => {
    const originalIncidents = incidents;
    // Optimistically update UI
    setIncidents((prevIncidents) =>
      prevIncidents.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const optimisticEntry = {
          id: `temp-${Date.now()}`,
          comment: updatedData.comment,
          author: "You",
          timestamp: "Just now...",
          action: "Action Taken",
          isEdited: false,
          rating: null,
        };
        return {
          ...inc,
          status: updatedData.status || inc.status,
          auditTrail: [...inc.auditTrail, optimisticEntry],
        };
      })
    );

    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Server responded with an error");

      const finalUpdatedIncident = await response.json();
      // Re-sync with server data
      setIncidents((prevIncidents) =>
        prevIncidents.map((inc) =>
          inc.id === incidentId ? finalUpdatedIncident : inc
        )
      );
    } catch (error) {
      console.error("Failed to update incident:", error);
      showNotification(
        { title: "Error", message: "Failed to save update. Reverting." },
        "error"
      );
      setIncidents(originalIncidents); // Roll back
    }
  };

  const editComment = async (incidentId, entryId, newComment) => {
    const originalIncidents = incidents;
    // Optimistically update UI
    setIncidents((prevIncidents) =>
      prevIncidents.map((inc) => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          auditTrail: inc.auditTrail.map((entry) =>
            entry.id === entryId
              ? { ...entry, comment: newComment, isEdited: true }
              : entry
          ),
        };
      })
    );

    try {
      const response = await fetch(`/api/audit-entries/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newComment }),
      });

      if (!response.ok) throw new Error("Server responded with an error");

      showNotification(
        { title: "Comment Updated", message: "Your comment has been saved." },
        "info"
      );
      const finalUpdatedEntry = await response.json();
      // Re-sync with server data
      setIncidents((prevIncidents) =>
        prevIncidents.map((inc) => {
          if (inc.id !== incidentId) return inc;
          return {
            ...inc,
            auditTrail: inc.auditTrail.map((entry) =>
              entry.id === entryId ? finalUpdatedEntry : entry
            ),
          };
        })
      );
    } catch (error) {
      console.error("Failed to save edited comment:", error);
      showNotification(
        {
          title: "Error",
          message: "Failed to save comment edit. Reverting change.",
        },
        "error"
      );
      setIncidents(originalIncidents); // Roll back
    }
  };

  const value = {
    incidents,
    isLoading,
    updateIncident,
    editComment,
    refetchIncidents: fetchIncidents,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}