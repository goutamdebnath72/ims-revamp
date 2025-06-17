// File: app/search/page.jsx
// Optimized with useCallback and a faster animation.
'use client';

import React, { useCallback, useState } from 'react'; // Import useCallback and useState
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { mockIncidents } from '@/lib/mock-data';

// A new component to handle the hide/show animation
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    // We've reduced the timeout to make the animation much snappier
    <Slide appear={false} direction="down" in={!trigger} timeout={150}>
      {children}
    </Slide>
  );
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // By wrapping this function in useCallback, we ensure it's not recreated on every render.
  // This helps prevent child components from re-rendering unnecessarily.
  const handleSearch = useCallback((criteria) => {
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
  }, []); // The empty dependency array [] means this function is created only once.

  return (
    <Stack spacing={2}>
      <HideOnScroll>
        <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'background.default' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Search & Archive
            </Typography>
            <IncidentSearchForm onSearch={handleSearch} isLoading={loading} />
        </Paper>
      </HideOnScroll>

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