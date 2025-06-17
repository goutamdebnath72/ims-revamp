// File: app/search/page.jsx
// Implements the "Hide on Scroll" feature for the search form.
'use client';

import * as React from 'react';
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
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = (criteria) => {
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
  };

  return (
    <Stack spacing={2}>
      {/* The Search Form is now wrapped in our HideOnScroll component */}
      <HideOnScroll>
        <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: 0, zIndex: 10 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Search & Archive
            </Typography>
            <IncidentSearchForm onSearch={handleSearch} isLoading={loading} />
        </Paper>
      </HideOnScroll>

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