'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { isSystemIncident } from '@/lib/incident-helpers';
import { startOfDay, endOfDay, isWithinInterval, parse, isValid, subDays, parseISO } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { IncidentContext } from '@/context/IncidentContext';
import { UserContext } from '@/context/UserContext';

export default function SearchPage() {
  const { incidents } = React.useContext(IncidentContext);
  const { user } = React.useContext(UserContext);
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const [criteria, setCriteria] = React.useState({
    incidentId: '', requestor: '', status: 'Any', priority: 'Any', incidentType: 'Any', category: 'Any',
    dateRange: { start: subDays(new Date(), 30), end: new Date() }
  });
  
  const performSearch = React.useCallback((searchCriteria) => {
    if (!user || !incidents || incidents.length === 0) return;

    setLoading(true);
    setHasSearched(true); 
    
    setTimeout(() => {
        const dateFiltered = incidents.filter(incident => {
            if (!searchCriteria.dateRange.start || !searchCriteria.dateRange.end) return true;
            const reportedDate = parse(incident.reportedOn, 'dd MMM yy, hh:mm a', new Date());
            if (!isValid(reportedDate)) return false;
            return isWithinInterval(reportedDate, {
                start: startOfDay(searchCriteria.dateRange.start),
                end: endOfDay(searchCriteria.dateRange.end)
            });
        });

      let results = dateFiltered.filter(incident => {
        const isSys = isSystemIncident(incident);

        if (user.role === 'user' && incident.requestor !== user.name) return false;
        if (user.role === 'admin' && isSys) return false;
        
        const category = user.role === 'sys_admin' ? searchCriteria.category : 'general';

        if (category?.toLowerCase() === 'system' && !isSys) return false;
        if (category?.toLowerCase() === 'general' && isSys) return false;
        
        if (searchCriteria.status === 'open') {
            if (incident.status !== 'New' && incident.status !== 'Processed') return false;
        } else if (searchCriteria.status !== 'Any') {
            if (incident.status !== searchCriteria.status) return false;
        }
        
        const idMatch = searchCriteria.incidentId ? incident.id.toString().includes(searchCriteria.incidentId) : true;
        const priorityMatch = searchCriteria.priority !== 'Any' ? incident.priority === searchCriteria.priority : true;
        const typeMatch = searchCriteria.incidentType !== 'Any' ? incident.incidentType === searchCriteria.incidentType : true;
        
        let requestorMatch = true;
        if ((user.role === 'admin' || user.role === 'sys_admin') && searchCriteria.requestor) {
            const searchTerm = searchCriteria.requestor.toLowerCase();
            const requestorName = incident.requestor || '';
            requestorMatch = requestorName.toLowerCase().includes(searchTerm);
        }

        return idMatch && requestorMatch && priorityMatch && typeMatch;
      });
      setSearchResults(results);
      setLoading(false);
    }, 500);
  }, [incidents, user]);

  React.useEffect(() => {
    if (!user || incidents.length === 0) return;

    const urlCategory = searchParams.get('category');
    const urlStatus = searchParams.get('status');
    const urlPriority = searchParams.get('priority');
    const urlStartDate = searchParams.get('startDate');
    const urlEndDate = searchParams.get('endDate');

    // Only act if navigating from a link
    if (urlCategory || urlStatus || urlPriority) {
        let dateRangeFromUrl = { start: null, end: null }; // Default to 'All Time' for links
        if (urlStartDate && urlEndDate) {
            dateRangeFromUrl = { start: parseISO(urlStartDate), end: parseISO(urlEndDate) };
        }

        // Build a single, correct criteria object directly from the URL params
        const criteriaFromLink = {
            incidentId: '',
            requestor: '',
            incidentType: 'Any',
            status: urlStatus || 'Any',
            priority: urlPriority || 'Any',
            category: urlCategory || (user.role === 'sys_admin' ? 'Any' : 'general'),
            dateRange: dateRangeFromUrl
        };

        // Sync the form's visual state with the criteria from the link
        const formCriteria = {
            ...criteriaFromLink,
            category: criteriaFromLink.category === 'system' ? 'System' : criteriaFromLink.category === 'general' ? 'General' : 'Any',
        };
        setCriteria(formCriteria);
        
        // Perform the search with the exact criteria from the link
        performSearch(criteriaFromLink);
    }
  }, [user, incidents, searchParams]);

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
        <IncidentSearchForm 
            criteria={criteria}
            onCriteriaChange={setCriteria}
            onSearch={performSearch} 
            isLoading={loading} 
        />
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