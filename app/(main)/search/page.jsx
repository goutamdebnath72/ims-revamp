'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { isSystemIncident } from '@/lib/incident-helpers';
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
  const { user } = React.useContext(UserContext);
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  
  const performSearch = React.useCallback((criteria) => {
    if (!user) return;

    setLoading(true);
    setHasSearched(true); 
    
    const category = searchParams.get('category') || 'general';

    setTimeout(() => {
      let results = incidents.filter(incident => {
        const isSys = isSystemIncident(incident);

        if (category === 'system' && !isSys) return false;
        if (user.role === 'admin' && isSys) return false;

        const isOwner = user.role === 'sys_admin' || user.role === 'admin' || (incident.reportedBy && incident.reportedBy.ticketNo === user.ticketNo);
        if (!isOwner) return false;

        const idMatch = criteria.incidentId ? incident.id.toString().includes(criteria.incidentId) : true;
        
        let requestorMatch = true;
        if ((user.role === 'admin' || user.role === 'sys_admin') && criteria.requestor) {
            const searchTerm = criteria.requestor.toLowerCase();
            const reportedBy = incident.reportedBy;
            requestorMatch = (
              (reportedBy?.name?.toLowerCase().includes(searchTerm)) ||
              (reportedBy?.ticketNo?.includes(searchTerm)) ||
              (reportedBy?.sailPNo?.includes(searchTerm)) ||
              (reportedBy?.contactNumber?.includes(searchTerm))
            );
        }
        
        const statusMatch = criteria.status !== 'Any' ? incident.status === criteria.status : true;
        const priorityMatch = criteria.priority !== 'Any' ? incident.priority === criteria.priority : true;
        // --- NEW FILTER LOGIC ---
        const typeMatch = criteria.incidentType !== 'Any' ? incident.incidentType === criteria.incidentType : true;

        return idMatch && requestorMatch && statusMatch && priorityMatch && typeMatch;
      });
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [incidents, user, searchParams]);

  React.useEffect(() => {
    const initialStatus = searchParams.get('status');
    const initialUser = searchParams.get('user');
    const initialPriority = searchParams.get('priority');

    if (initialStatus || initialUser || initialPriority) {
      const defaultCriteria = { 
        status: initialStatus === 'open' || initialStatus === 'AllOpen' ? 'Any' : (initialStatus || 'Any'), 
        priority: initialPriority || 'Any',
        incidentId: '', 
        requestor: '',
        incidentType: 'Any', // Include in default criteria
      };
      
      if (initialStatus === 'open' || initialStatus === 'AllOpen') {
        const openResults = incidents.filter(i => {
          const isSys = isSystemIncident(i);
          if (user?.role === 'admin' && isSys) return false;
          if (user?.role === 'user' && i.reportedBy?.ticketNo !== user.ticketNo) return false;
          return (i.status === 'New' || i.status === 'Processed');
        });
        setSearchResults(openResults);
        setHasSearched(true);
      } else {
        performSearch(defaultCriteria);
      }
    }
  }, [searchParams, incidents, performSearch, user]);

  const isScrolled = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  
  const getHeading = () => {
    const category = searchParams.get('category');
    if (user?.role === 'sys_admin' && category === 'system') {
      return 'Search & Archive (SYS)';
    }
    return 'Search & Archive';
  };

  return (
    <Stack spacing={2}>
      <Paper elevation={isScrolled ? 4 : 2} sx={{ p: 2, position: 'sticky', top: 64, zIndex: 10, bgcolor: 'background.default' }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'left' }}>
            {getHeading()}
        </Typography>
        <IncidentSearchForm onSearch={performSearch} isLoading={loading} />
      </Paper>

      {hasSearched && (
         <Paper elevation={2} sx={{p: 2}}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Search Results
            </Typography>
            <IncidentDataGrid rows={searchResults} loading={loading} />
         </Paper>
      )}
    </Stack>
  );
}