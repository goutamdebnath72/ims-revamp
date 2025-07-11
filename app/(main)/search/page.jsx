'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { isSystemIncident } from '@/lib/incident-helpers';
import { startOfDay, endOfDay, isWithinInterval, parse, isValid, parseISO, getHours, format } from 'date-fns';
import { Box, Typography, Paper, Stack, useScrollTrigger, Alert } from '@mui/material';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { IncidentContext } from '@/context/IncidentContext';
import { useSession } from 'next-auth/react';

export default function SearchPage() {
  const { data: session } = useSession();
  const { incidents } = React.useContext(IncidentContext);
  const searchParams = useSearchParams();

  const user = session?.user;

  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [criteria, setCriteria] = React.useState({
    incidentId: '',
    requestor: '',
    status: 'Any',
    priority: 'Any',
    incidentType: 'Any',
    category: 'Any',
    shift: 'Any',
    department: 'Any',
    dateRange: { start: null, end: null }
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

        const shiftMatch = searchCriteria.shift && searchCriteria.shift !== 'Any' && searchCriteria.shift !== 'All' ?
        (() => {
          const parsedDate = parse(incident.reportedOn, 'dd MMM yy, hh:mm a', new Date());
          if (!isValid(parsedDate)) return false;
          const hour = getHours(parsedDate);
          if (searchCriteria.shift === 'A') return hour >= 6 && hour < 14;
          if (searchCriteria.shift === 'B') return hour >= 14 && hour < 22;
          if (searchCriteria.shift === 'C') return hour >= 22 || hour < 6;
          return false;
        })() : true;

        const departmentMatch = searchCriteria.department !== 'Any' ? incident.department === searchCriteria.department : true;

        return idMatch && requestorMatch && priorityMatch && typeMatch && shiftMatch && departmentMatch;
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
    const urlShift = searchParams.get('shift');
    const urlStartDate = searchParams.get('startDate');
    const urlEndDate = searchParams.get('endDate');

    if (urlCategory || urlStatus || urlPriority || urlShift) {
      let dateRangeFromUrl = { start: null, end: null };

      if (urlStartDate && urlEndDate) {
        dateRangeFromUrl = {
          start: parseISO(urlStartDate),
          end: parseISO(urlEndDate)
        };
      }

      const criteriaFromLink = {
        incidentId: '',
        requestor: '',
        incidentType: 'Any',
        status: urlStatus || 'Any',
        priority: urlPriority || 'Any',
        shift: urlShift || 'Any',
        department: 'Any',
        category: urlCategory || (user.role === 'sys_admin' ? 'Any' : 'general'),
        dateRange: dateRangeFromUrl
      };

      const formCriteria = {
        ...criteriaFromLink,
        category: criteriaFromLink.category === 'system' ? 'System' :
                  criteriaFromLink.category === 'general' ? 'General' : 'Any'
      };

      setCriteria(formCriteria);
      performSearch(criteriaFromLink);
    }
  }, [user, incidents, searchParams, performSearch]);

  const isScrolled = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const getHeading = () => {
    const category = searchParams.get('category');
    if (user?.role === 'sys_admin' && category === 'system') {
      return 'Search & Archive (SYS)';
    }
    return 'Search & Archive';
  };

  const getFilterContextText = () => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const shiftParam = searchParams.get('shift');

    if (!startDateParam && !shiftParam) return null;

    let dateText = '';
    if (startDateParam && endDateParam) {
      const start = parseISO(startDateParam);
      const end = parseISO(endDateParam);
      if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
        dateText = `Date: ${format(start, 'do MMM, yyyy')}`;
      } else {
        dateText = `Date Range: ${format(start, 'do MMM')} - ${format(end, 'do MMM, yyyy')}`;
      }
    }

    const shiftText = shiftParam ? `Shift: ${shiftParam}` : '';
    return [dateText, shiftText].filter(Boolean).join('  |  ');
  };

  const filterContextText = getFilterContextText();

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
        <Paper elevation={2} sx={{ p: 2 }}>
          {filterContextText && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Showing results based on dashboard selection — {filterContextText}
            </Alert>
          )}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Search Results
          </Typography>
          <IncidentDataGrid rows={searchResults} loading={loading} />
        </Paper>
      )}
    </Stack>
  );
}