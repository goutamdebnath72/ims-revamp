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
      const response = await fetch('/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error(error);
      showNotification({ title: 'Error', message: 'Could not load incident data.' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  React.useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // UPDATED: This function now sends the update to our new API
  const updateIncident = async (incidentId, updatedData) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error during update');
      }

      // After a successful update, refetch all data to ensure UI is in sync
      await fetchIncidents();

    } catch (error) {
      console.error('Failed to update incident:', error);
      showNotification({ title: 'Error', message: 'Failed to save update.' }, 'error');
    }
  };

  const value = { incidents, isLoading, updateIncident, refetchIncidents: fetchIncidents };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}