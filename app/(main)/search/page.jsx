'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [showUnfilteredMessage, setShowUnfilteredMessage] = React.useState(false);
  
  const performSearch = React.useCallback((criteria) => {
    setLoading(true);
    setHasSearched(true); 
    
    const isUnfiltered = !criteria.incidentId && !criteria.requestor && criteria.status === 'Any' && criteria.priority === 'Any';
    setShowUnfilteredMessage(isUnfiltered);

    setTimeout(() => {
      let results = incidents.filter(incident => (
        (criteria.incidentId ? incident.id.toString().includes(criteria.incidentId) : true) &&
        (criteria.requestor ? incident.requestor.toLowerCase().includes(criteria.requestor.toLowerCase()) : true) &&
        (criteria.status !== 'Any' ? incident.status === criteria.status : true) &&
        (criteria.priority !== 'Any' ? incident.priority === criteria.priority : true)
      ));
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [incidents]);

  React.useEffect(() => {
    const initialStatus = searchParams.get('status');
    if (initialStatus) {
      const defaultCriteria = { status: initialStatus, priority: 'Any', incidentId: '', requestor: '' };
      if (initialStatus === 'AllOpen') {
          // A special case for our "All Open" card
          const openResults = incidents.filter(i => i.status === 'New' || i.status === 'Processed');
          setSearchResults(openResults);
          setHasSearched(true);
          setShowUnfilteredMessage(false);
      } else {
        performSearch(defaultCriteria);
      }
    }
  }, []);

  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Stack spacing={2}>
      <Paper 
        elevation={isScrolled ? 4 : 2} 
        sx={{ p: 2, position: 'sticky', top: 64, zIndex: 10, backgroundColor: 'background.default', transition: 'box-shadow 0.2s ease-in-out' }}
      >
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'left' }}>
            Search & Archive
        </Typography>
        <IncidentSearchForm onSearch={performSearch} isLoading={loading} />
      </Paper>

      {hasSearched && (
         <Paper elevation={2} sx={{p: 2}}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Search Results
            </Typography>
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