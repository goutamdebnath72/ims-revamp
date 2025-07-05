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
import { UserContext } from '@/context/UserContext';
import Alert from '@mui/material/Alert';

export default function SearchPage() {
  const { incidents } = React.useContext(IncidentContext);
  const { user } = React.useContext(UserContext); // Get user for role check
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [showUnfilteredMessage, setShowUnfilteredMessage] = React.useState(false);
  
  const performSearch = React.useCallback((criteria) => {
    if (!user) return; // Don't search if user isn't loaded yet

    setLoading(true);
    setHasSearched(true); 
    
    const isUnfiltered = !criteria.incidentId && criteria.status === 'Any' && criteria.priority === 'Any';
    setShowUnfilteredMessage(isUnfiltered);

    setTimeout(() => {
      let results = incidents.filter(incident => {
        // --- ROLE-BASED DATA SECURITY ---
        // If the user is NOT an admin, we add a check to ensure they only see their own incidents.
        const isOwner = user.role === 'admin' || (incident.reportedBy && incident.reportedBy.ticketNo === user.ticketNo);

        return (
          isOwner &&
          (criteria.incidentId ? incident.id.toString().includes(criteria.incidentId) : true) &&
          (user.role === 'admin' && criteria.requestor ? (incident.reportedBy?.name.toLowerCase().includes(criteria.requestor.toLowerCase()) || incident.reportedBy?.ticketNo.includes(criteria.requestor)) : true) &&
          (criteria.status !== 'Any' ? incident.status === criteria.status : true) &&
          (criteria.priority !== 'Any' ? incident.priority === criteria.priority : true)
        )
      });
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [incidents, user]);

  React.useEffect(() => {
    // This handles the initial search when clicking cards on the dashboard
    const initialStatus = searchParams.get('status');
    const initialUser = searchParams.get('user');

    if (initialStatus) {
      const defaultCriteria = { status: initialStatus, priority: 'Any', incidentId: '', requestor: '' };
      
      if (initialStatus === 'AllOpen') {
          const openResults = incidents.filter(i => {
              const isOwner = !initialUser || (i.reportedBy && i.reportedBy.ticketNo === initialUser);
              return isOwner && (i.status === 'New' || i.status === 'Processed');
          });
          setSearchResults(openResults);
          setHasSearched(true);
          setShowUnfilteredMessage(false);
      } else {
        performSearch(defaultCriteria);
      }
    }
  }, [searchParams, incidents, performSearch]);

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
                    Showing all your incidents. Use the filters above to refine your search.
                </Alert>
            )}
            <IncidentDataGrid rows={searchResults} loading={loading} />
         </Paper>
      )}
    </Stack>
  );
}