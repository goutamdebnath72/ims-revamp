'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Image from 'next/image';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login } = React.useContext(UserContext);
  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');
    
    const result = login(userId, password);
    
    if (!result.success) {
      setError(result.message);
    }
    // On success, the context handles the redirection to '/'
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to top, #f3f4f6, #ffffff)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4, pt: 3, width: '100%', maxWidth: '440px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Image
            src="/sail-logo.png" alt="SAIL Logo" width={120} height={0} priority
            style={{ height: 'auto', width: '120px' }}
          />
        </Box>
        <Typography component="h1" variant="h5">IMS Login</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Incident Management System - DSP
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <Stack spacing={1}>
            <TextField
              margin="normal" required fullWidth id="userId" label="User ID / Ticket No." name="userId"
              autoComplete="username" autoFocus value={userId} onChange={(e) => setUserId(e.target.value)}
              error={!!error}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Password" type="password"
              id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
              error={!!error}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}