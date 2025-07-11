'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { IncidentContext } from '@/context/IncidentContext';
import RecentIncidentsCard from './RecentIncidentsCard';
import { Box, Button, Typography, Stack, Card, CardActionArea, CardContent } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CountUp from 'react-countup';

export default function StandardUserDashboard() {
  const { data: session } = useSession();
  const { incidents } = React.useContext(IncidentContext);

  const user = session?.user;

  const myIncidents = React.useMemo(() => {
    if (!user || !incidents) return [];
    return incidents.filter(i =>
      i.reportedBy && i.reportedBy.ticketNo === user.ticketNo
    );
  }, [user, incidents]);

  const myNewIncidents = myIncidents.filter(i => i.status === 'New').length;
  const myProcessedIncidents = myIncidents.filter(i => i.status === 'Processed').length;
  const myOpenIncidents = myNewIncidents + myProcessedIncidents;
  const myResolvedIncidents = myIncidents.filter(i => i.status === 'Resolved').length;
  const myClosedIncidents = myIncidents.filter(i => i.status === 'Closed').length;

  const statCardsData = [
    { title: 'Your Open Incidents', value: myOpenIncidents, color: 'secondary', filterStatus: 'AllOpen' },
    { title: 'Your Resolved', value: myResolvedIncidents, color: 'success', filterStatus: 'Resolved' },
    { title: 'Your Closed', value: myClosedIncidents, color: 'default', filterStatus: 'Closed' },
  ];

  const getNumberVariant = (value) => value.toString().length > 3 ? 'h4' : 'h3';

  if (!user) return null;

  return (
    <Stack spacing={3}>
      {/* --- HEADER --- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Button
          component={Link}
          href="/raise"
          variant="contained"
          startIcon={<PostAddIcon />}
        >
          Raise New Incident
        </Button>
      </Stack>

      {/* --- STATISTIC CARDS --- */}
      <Stack direction="row" spacing={3}>
        {statCardsData.map((card, index) => (
          <Box key={index} sx={{ flex: 1, textDecoration: 'none' }}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardActionArea
                component={Link}
                href={`/search?user=${user.ticketNo}&status=${card.filterStatus}`}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant={getNumberVariant(card.value)} component="div" color={`${card.color}.main`}>
                    <CountUp end={card.value} duration={1.5} separator="," />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Stack>

      {/* --- RECENT ACTIVITY LIST --- */}
      <Typography variant="h5" sx={{ pt: 2 }}>
        Your Recent Activity
      </Typography>
      <RecentIncidentsCard incidents={myIncidents} />
    </Stack>
  );
}