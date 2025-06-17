// File: app/search/page.jsx
// This final version uses a stable, performant "elevation on scroll" effect and corrects all layout issues.
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

  // This hook is simple and reliable for detecting if the page is scrolled.
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0, // Fire as soon as scrolling starts
  });

  const handleSearch = React.useCallback((criteria) => {
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
      {/* This Paper component is our sticky header.
        It does NOT change height or position.
        Only its shadow (elevation) changes, which is extremely fast.
      */}
      <Paper 
        elevation={isScrolled ? 4 : 2} 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          top: 64, // Positioned 64px from the top to be below the main AppBar
          zIndex: 10, 
          backgroundColor: 'background.default',
          transition: 'box-shadow 0.2s ease-in-out', // A fast, subtle shadow animation
        }}
      >
        {/* The content inside is now correctly aligned */}
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'left' }}>
            Search & Archive
        </Typography>
        <IncidentSearchForm onSearch={handleSearch} isLoading={loading} />
      </Paper>

      {/* Results Section */}
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
