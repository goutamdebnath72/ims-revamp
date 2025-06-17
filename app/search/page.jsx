// File: app/search/page.jsx
// This final version uses a custom scroll listener for instantaneous performance.
'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IncidentSearchForm from '@/components/IncidentSearchForm';
import IncidentDataGrid from '@/components/IncidentDataGrid';
import { mockIncidents } from '@/lib/mock-data';
import { LayoutContext } from '@/components/LayoutContext'; // Import our context

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Consume the context to get the AppBar height
  const { appBarHeight } = useContext(LayoutContext);

  // This is our new, high-performance scroll listener.
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if scrolled more than 10px, false otherwise.
      setIsScrolled(window.scrollY > 10);
    };
    // Add the listener when the component mounts
    window.addEventListener('scroll', handleScroll);
    // Remove the listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The empty array ensures this effect runs only once.

  const handleSearch = useCallback((criteria) => {
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
      {/* This header is now positioned correctly and animates instantly */}
      <Paper 
        elevation={isScrolled ? 4 : 2} 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          top: `${appBarHeight}px`, // Position it perfectly below the main AppBar
          zIndex: 10, 
          backgroundColor: 'background.default',
          transition: 'box-shadow 150ms ease-out', // Fast, smooth shadow transition
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
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