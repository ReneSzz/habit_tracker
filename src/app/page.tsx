'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  LinearProgress,
  Menu,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  createTheme,
  ThemeProvider,
  Box,
  IconButton,
  CssBaseline,
  MenuItem,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { auth } from './lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthProvider } from './context/auth';
import PrivateRoute from './lib/PrivateRoute';
import { User } from 'firebase/auth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHabits } from './hooks/useHabits';
import HeatMap from './components/HeatMap';
import AddHabitModal from './components/AddHabitModal';

const Theme = createTheme({
  typography: { fontFamily: '"Inter", sans-serif' },
  palette: {
    mode: 'dark',
    primary: { main: '#FF4151' },
    background: { default: '#0f0f0f', paper: '#141414' },
  },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const {
    habits,
    progress,
    totalHabits,
    completedToday,
    bestStreak,
    overallBestStreak,
    weeklyRate,
    completionMap,
    increaseProgress,
    removeProgress,
    deleteHabit,
    addHabit,
  } = useHabits(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, habitId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedHabit(habitId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHabit(null);
  };

  const handleAdd = () => {
    addHabit(habitTitle);
    setHabitTitle('');
    setOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <AuthProvider>
      <PrivateRoute>
        <ThemeProvider theme={Theme}>
          <CssBaseline />

          <AppBar sx={{ backgroundColor: 'background.paper', boxShadow: '0 1px 0 rgba(255,255,255,0.08)' }} position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href="/">
                <Typography sx={{ color: '#e1e1e1', fontWeight: 'bold' }}>
                  Habit Tracker
                </Typography>
              </Link>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                  
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      width: '320px', height: 4, borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#FF4151', borderRadius: 2 },
                    }}
                  />
                </Stack>
                <Typography sx={{ color: '#e1e1e1', fontWeight: 'bold', textWrap: 'nowrap'}}>{progress}% Completed</Typography>
              </Box>

              {user ? (
                <Button
                  onClick={handleSignOut}
                  sx={{
                    color: '#e1e1e1',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { borderColor: 'rgba(255,65,81,0.4)' },
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              )}
            </Toolbar>
          </AppBar>

          <AddHabitModal
            open={open}
            onClose={() => setOpen(false)}
            habitTitle={habitTitle}
            setHabitTitle={setHabitTitle}
            onAdd={handleAdd}
          />

         <Box sx={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
 {/* sidebar */}
  <Box sx={{
  width: '420px',
  flexShrink: 0,
  borderLeft: '0.5px solid rgba(255,255,255,0.06)',
  padding: '24px',
  overflowY: 'auto',
}}>
    <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
      Completion history
    </Typography>
    <HeatMap completionMap={completionMap} totalHabits={totalHabits} />
  </Box>
  {/* main scrollable column */}
 <Box sx={{ flex: 1, overflowY: 'auto',marginRight: '400px', padding: '24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Box sx={{ width: '100%', maxWidth: '520px' }}>

      {/* stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
        {[
          { label: 'Today', value: `${completedToday}/${totalHabits}`, sub: 'habits done' },
          { label: 'Best streak', value: Math.max(bestStreak, overallBestStreak), sub: 'days in a row' },
          { label: 'This week', value: `${weeklyRate}%`, sub: 'completion rate' },
        ].map(({ label, value, sub }) => (
          <Box key={label} sx={{ backgroundColor: '#141414', borderRadius: '10px', padding: '14px 16px' }}>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', mt: 0.25 }}>
              {sub}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* habit list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', mb: 2 }}>
        {habits.length === 0 ? (
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '16px' }}>
            No habits yet — add one below
          </Typography>
        ) : (
          habits.map((habit) => (
            <Box
              key={habit.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                padding: '14px 16px', borderRadius: '10px',
                backgroundColor: habit.checked ? 'rgba(255,255,255,0.03)' : 'transparent',
                transition: 'background 0.15s',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
              }}
            >
              <Typography sx={{
                flex: 1, fontSize: 15,
                color: habit.checked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
                textDecoration: habit.checked ? 'line-through' : 'none',
                textDecorationColor: 'rgba(255,255,255,0.15)',
                wordBreak: 'break-word',
              }}>
                {habit.title}
              </Typography>

              <Box sx={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '20px',
                backgroundColor:
                  habit.streak >= 7 ? 'rgba(255,65,81,0.12)'
                  : habit.streak > 0 ? 'rgba(255,165,0,0.12)'
                  : 'rgba(255,255,255,0.06)',
                color:
                  habit.streak >= 7 ? '#FF4151'
                  : habit.streak > 0 ? '#FFA500'
                  : 'rgba(255,255,255,0.4)',
                fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.7 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'inherit' }}>
  {habit.streak ?? 0} day{habit.streak !== 1 ? 's' : ''}
</Typography>
{habit.bestStreak > 0 && habit.streak < habit.bestStreak && (
  <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', ml: 0.5 }}>
    best: {habit.bestStreak}
  </Typography>
)}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                  onClick={() => increaseProgress(habit.id)}
                  sx={{
                    width: 22, height: 22, borderRadius: '6px',
                    border: habit.checked ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                    backgroundColor: habit.checked ? '#FF4151' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                  }}
                >
                  {habit.checked && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Box>

                <Tooltip title={`Last completed: ${habit.lastChecked || 'never'}`}>
                  <IconButton onClick={(e) => handleMenuOpen(e, habit.id)}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => selectedHabit && removeProgress(selectedHabit, handleMenuClose)}>
                    Undo
                  </MenuItem>
                  <MenuItem onClick={() => selectedHabit && deleteHabit(selectedHabit, handleMenuClose)}>
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* add habit trigger */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          padding: '12px 16px', borderRadius: '10px',
          border: '1px dashed rgba(255,255,255,0.1)',
          cursor: 'pointer', transition: 'border-color 0.15s',
          '&:hover': { borderColor: 'rgba(255,65,81,0.4)' },
        }}
      >
        <Box sx={{ width: 22, height: 22, borderRadius: '6px', backgroundColor: 'rgba(255,65,81,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4151', fontSize: 18 }}>
          +
        </Box>
        <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>
          Add a new habit
        </Typography>
      </Box>

    </Box>
  </Box>

 

</Box>


        </ThemeProvider>
      </PrivateRoute>
    </AuthProvider>
  );
}
