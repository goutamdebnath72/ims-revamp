// File: app/search/page.jsx
// This version replaces the slow slide animation with a highly performant "elevation on scroll" effect.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { mockIncidents } from '@/lib/mock-data';

export default function SearchPage() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  // This hook will now only be used to change the elevation (shadow) of the header.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0, // Fire immediately
  });

  const handleSearch = React.useCallback((criteria) => {
    console.log("Searching with criteria:", criteria);
    setLoading(true);
    setHasSearched(true); 

    setTimeout(() => {
      let results = mockIncidents.filter(incident => (
        (criteria.incidentId ? incident.id.toString().includes(criteria.incidentId) : true) &&
        (criteria.requestor ? incident.requestor.toLowerCase().includes(criteria.requestor.toLowerCase()) : true) &&
        (criteria.status !== 'Any' ? incident.status === criteria.status : true) &&
        (criteria.priority !== 'Any' ? incident.priority === criteria.priority : true)
      ));
      setSearchResults(results);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Stack spacing={2}>
      {/* This Paper component now acts as our sticky header.
        Instead of sliding, its 'elevation' prop changes on scroll.
        This is extremely performant.
      */}
      <Paper 
        elevation={trigger ? 4 : 2} 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          top: -1, // A small offset to ensure shadow is visible
          zIndex: 10, 
          backgroundColor: 'background.default',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', // Smooth transition for the shadow
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
            Search & Archive
        </Typography>
        <IncidentSearchForm onSearch={handleSearch} isLoading={loading} />
      </Paper>

      {/* Results Section - no changes needed here */}
      {hasSearched && (
         <Paper elevation={2}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h5">
                  Search Results
              </Typography>
            </Box>
            
            {!loading && searchResults.length === 0 ? (
                <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    No results found for your search criteria.
                </Typography>
            ) : (
                <IncidentDataGrid rows={searchResults} loading={loading} />
            )}
         </Paper>
      )}
    </Stack>
  );
}