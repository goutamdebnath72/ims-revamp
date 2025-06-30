// File: app/search/page.jsx
// UPDATED: Added useEffect to auto-sync results and fixed unfiltered search message.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { IncidentContext } from '@/context/IncidentContext';
import Alert from '@mui/material/Alert';

export default function SearchPage() {
  const { incidents } = React.useContext(IncidentContext);
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [showUnfilteredMessage, setShowUnfilteredMessage] = React.useState(false);
  
  // Keep track of the last search criteria
  const [lastCriteria, setLastCriteria] = React.useState(null);

  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  // This is the function that performs the filtering logic
  const performFilter = React.useCallback((criteria) => {
    if (!criteria) return [];
    return incidents.filter(incident => (
      (criteria.incidentId ? incident.id.toString().includes(criteria.incidentId) : true) &&
      (criteria.requestor ? incident.requestor.toLowerCase().includes(criteria.requestor.toLowerCase()) : true) &&
      (criteria.status !== 'Any' ? incident.status === criteria.status : true) &&
      (criteria.priority !== 'Any' ? incident.priority === criteria.priority : true)
    ));
  }, [incidents]);

  // This is called when the user clicks the search button
  const handleSearch = React.useCallback((criteria) => {
    setLoading(true);
    setHasSearched(true); 
    setLastCriteria(criteria); // Save the latest search criteria

    const isUnfiltered = !criteria.incidentId && !criteria.requestor && criteria.status === 'Any' && criteria.priority === 'Any';
    setShowUnfilteredMessage(isUnfiltered);

    setTimeout(() => {
      const results = performFilter(criteria);
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [performFilter]);

  // --- THIS IS THE FIX FOR THE SYNCING ISSUE ---
  // This effect will run whenever the global 'incidents' list changes.
  React.useEffect(() => {
    // If a search has been performed before, re-apply the filter automatically
    if (hasSearched && lastCriteria) {
      const updatedResults = performFilter(lastCriteria);
      setSearchResults(updatedResults);
    }
  }, [incidents, hasSearched, lastCriteria, performFilter]); // Re-run when global data changes

  return (
    <Stack spacing={2}>
      <Paper 
        elevation={isScrolled ? 4 : 2} 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          top: 64,
          zIndex: 10, 
          backgroundColor: 'background.default',
          transition: 'box-shadow 0.2s ease-in-out',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'left' }}>
            Search & Archive
        </Typography>
        <IncidentSearchForm onSearch={handleSearch} isLoading={loading} />
      </Paper>

      {hasSearched && (
         <Paper elevation={2} sx={{p: 2}}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Search Results
            </Typography>

            {/* Conditionally render the unfiltered search message */}
            {showUnfilteredMessage && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Showing all incidents. Use the filters above to refine your search.
                </Alert>
            )}

            <IncidentDataGrid rows={searchResults} loading={loading} />
         </Paper>
      )}
    </Stack>
  );
}