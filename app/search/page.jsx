// File: app/search/page.jsx
// This is the main page for the Search & Archive route.
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IncidentSearchForm from '@/components/IncidentSearchForm'; // Importing our new component

export default function SearchPage() {
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = (searchCriteria) => {
    // In a real application, you would make an API call here.
    // For now, we'll just log the criteria to the console.
    console.log("Searching with criteria:", searchCriteria);
    
    // We will later update this to set real search results.
    // setSearchResults(apiResponse);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Search & Archive
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <IncidentSearchForm onSearch={handleSearch} />
      </Paper>

      {/* This is where the results will be displayed later */}
      <Box mt={4}>
        <Typography variant="h5">Search Results</Typography>
        {/* We will add the IncidentDataGrid component here later */}
      </Box>
    </Box>
  );
}