"use client";

import { useState, useEffect, JSX } from "react";
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
  Modal,
  Box,
  TextField,
  Select,
  Card,
  IconButton,
  CssBaseline,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { auth, db } from "./lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./lib/PrivateRoute";
import { User } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  getDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Stack from '@mui/material/Stack';


// Theme configuration
const Theme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',},
  palette: {
    mode: "dark",
    primary: {
      main: "#FF4151",
    },
    background: {
      default: "#0f0f0f",
      paper: "#141414ff",
    },
  },
components: {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
    },
  },
},
});

// Habit interface
interface Habit {
  id: string;
  title: string;
  checked: boolean;
  lastChecked: string;
  streak: number;
  weeklyRate: number;
}

// Modal styling
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
function calculateStreak(completions: string[]): number {
  if (completions.length === 0) return 0;

  const sorted = [...new Set(completions)].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // streak is dead if nothing completed today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateWeeklyRate(completions: string[]): number {
  const today = new Date();
  const days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  const completionSet = new Set(completions);
  const completed = days.filter((d) => completionSet.has(d)).length;
  return Math.round((completed / 7) * 100);
}

export default function Home() {
  // State variables
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [value, setValue] = useState("1");
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);

  // Modal open/close handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  // Handles opening the menu for a specific habit
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, habitId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedHabit(habitId);
  };

  // Closes the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHabit(null);
  };

  // Function to increase habit progress
  const increaseProgress = async (habitId: string) => {
    if (!user || !user.uid) return;

    try {
      const habitRef = doc(db, "users", user.uid, "habits", habitId);
      const habitSnap = await getDoc(habitRef);

      if (habitSnap.exists()) {
        const habitData = habitSnap.data();
        const checked = habitData?.checked;
        const currentDate = new Date().toISOString().split("T")[0];

        if (!checked) {
          await updateDoc(habitRef, { checked: true, lastChecked: currentDate });

          const updatedHabits = habits.map((habit) =>
            habit.id === habitId ? { ...habit, checked: true, lastChecked: currentDate } : habit
          );
          setHabits(updatedHabits);

          // Recalculate progress
          const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
          const totalHabits = updatedHabits.length;
          setProgress(totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0);
          setTotalHabits(totalHabits);
          setCompletedToday(checkedHabits);
          const completionRef = doc(
  db, "users", user.uid, "habits", habitId, "completions", currentDate
);
await setDoc(completionRef, { completedAt: currentDate });

await fetchHabits();
        }
      }
    } catch (error) {
      console.error("Error increasing progress:", error);
    }
  };

  // Function to remove progress from a habit
  const removeProgress = async () => {
    if (!user || !user.uid || !selectedHabit) return;

    try {
      const habitRef = doc(db, "users", user.uid, "habits", selectedHabit);
      const habitSnap = await getDoc(habitRef);

      if (habitSnap.exists()) {
        await updateDoc(habitRef, { checked: false });
const updatedHabits = habits.map((habit) =>
  habit.id === selectedHabit ? { ...habit, checked: false } : habit
);
setHabits(updatedHabits);
// Recalculate progress
const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
const totalHabits = updatedHabits.length;
setProgress(totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0);
setTotalHabits(totalHabits);
setCompletedToday(checkedHabits);
// Delete today's completion document
const currentDate = new Date().toISOString().split("T")[0];
const completionRef = doc(
  db, "users", user.uid, "habits", selectedHabit, "completions", currentDate
);
await deleteDoc(completionRef);
await fetchHabits();
        

        
      }
    } catch (error) {
      console.error("Error removing progress:", error);
    } finally {
      handleMenuClose();
    }
  };

  // Deletes a habit from Firestore
  const deleteHabit = async () => {
    if (!user || !user.uid || !selectedHabit) return;

    try {
      const habitDoc = doc(db, "users", user.uid, "habits", selectedHabit);
      await deleteDoc(habitDoc);
      handleMenuClose();
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Fetch habits from Firestore
  const fetchHabits = async () => {
    if (!user || !user.uid) return;

    try {
      const habitsRef = collection(db, "users", user.uid, "habits");
      const habitQuery = query(habitsRef, orderBy("createdAt", "desc"));

      const habitSnapshot = await getDocs(habitQuery);
      
      const habitList = await Promise.all(
  habitSnapshot.docs.map(async (habitDoc) => {
    const data = habitDoc.data() as Habit;

    const completionsRef = collection(
      db, "users", user.uid, "habits", habitDoc.id, "completions"
    );
    const completionsSnap = await getDocs(completionsRef);
    const completions = completionsSnap.docs.map((d) => d.id);

    return {
      ...data,
      id: habitDoc.id,
      streak: calculateStreak(completions),
      weeklyRate: calculateWeeklyRate(completions),
    };
  })
);

      const currentDate = new Date().toISOString().split("T")[0];

      const updatedHabits = habitList.map((habit) => {
        if (habit.lastChecked !== currentDate) {
          return { ...habit, checked: false };
        }
        return habit;
      });

      const sortedHabits = [...updatedHabits].sort((a, b) => b.streak - a.streak);
      setHabits(sortedHabits);
      const best = Math.max(...updatedHabits.map((h) => h.streak), 0);
      setBestStreak(best);
      const avgWeekly = updatedHabits.length > 0
  ? Math.round(
      updatedHabits.reduce((sum, h) => sum + h.weeklyRate, 0) / updatedHabits.length
    )
  : 0;
setWeeklyRate(avgWeekly);

      // Update Firestore
      const batch = writeBatch(db);
      updatedHabits.forEach((habit) => {
        const habitRef = doc(db, "users", user.uid, "habits", habit.id);
        batch.update(habitRef, { checked: habit.checked, lastChecked: habit.lastChecked });
      });
      await batch.commit();

      const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
      const totalHabits = updatedHabits.length;
      setProgress(totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0);
      setTotalHabits(totalHabits);
      setCompletedToday(checkedHabits);
     
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user?.uid]);

  // Adds a new habit to Firestore
  const addHabitToFirestore = async () => {
    if (!habitTitle.trim() || !user || !user.uid) return;

    try {
      await addDoc(collection(db, "users", user.uid, "habits"), {
        title: habitTitle,
        createdAt: new Date(),
        userId: user.uid,
        checked: false,
        lastChecked: "",
      });
      fetchHabits();
      setHabitTitle("");
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHabitTitle(event.target.value); // Directly store the input value
    console.log(habitTitle)
  };

  const handleAdd = () => {
    addHabitToFirestore()

    setValue('')
    setHabitTitle('')
    setOpen(false)
  }
  useEffect(() => {
    // Track auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <>
      <AuthProvider>
        <PrivateRoute>
          <ThemeProvider theme={Theme}>  <CssBaseline />
           <AppBar sx={{ backgroundColor: "background.paper", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} position="static">
              <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link href="/">
                  <Typography  sx={{ flexGrow: 1, color: '#e1e1e1ff', fontWeight: 'bold' }}>
                    Habit Tracker
                  </Typography>
                </Link>
  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
  width: '320px',
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.1)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#FF4151',
    borderRadius: 2,
  },
}}
                  />
                   </Stack>
                  <Typography>{progress}%</Typography>
                </Box>
  
                {user ? (
                  <Button onClick={handleSignOut} sx={{color: '#e1e1e1ff',borderRadius: '10px', textTransform: 'none', fontWeight: 'bold',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer',
      transition: 'border-color 0.15s',
      '&:hover': { borderColor: 'rgba(255,65,81,0.4)' },}}>Sign Out</Button>
                ) : (
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                )}
              </Toolbar>
            </AppBar>
  
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Create a new habit
                </Typography>
                <TextField
                  id="standard-basic"
                  label="Habit"
                  variant="standard"
                  value={habitTitle}
                  onChange={handleTitle}
                  sx={{ width: '245px' }}
                />
                <Button variant="outlined" onClick={handleAdd}> Add </Button>
              </Box>
            </Modal>
            <Container>
                    
                      <Container
              maxWidth="sm"
              sx={{
                minHeight: "86vh",
                paddingTop: '30px',
              }}
            > 
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
  <Box sx={{ backgroundColor: '#141414', borderRadius: '10px', padding: '14px 16px' }}>
    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
      Today
    </Typography>
    <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>
      {completedToday}/{totalHabits}
    </Typography>
    
    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', mt: 0.25 }}>
      habits done
    </Typography>
  </Box>

  <Box sx={{ backgroundColor: '#141414', borderRadius: '10px', padding: '14px 16px' }}>
     <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
      Best Streak
    </Typography>
    <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>
  {bestStreak}
</Typography>
<Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', mt: 0.25 }}>
  days in a row
</Typography>
  </Box>

  <Box sx={{ backgroundColor: '#141414', borderRadius: '10px', padding: '14px 16px' }}>
     <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
      This Week
    </Typography>
    <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff' }}>
  {weeklyRate}%
</Typography>
<Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', mt: 0.25 }}>
  completion rate
</Typography>
  </Box>
</Box>
              <Container maxWidth="sm" disableGutters sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {habits.length === 0 ? (
                  <p>No habits found</p>
                ) : (
                  habits.map((habit) => (
                    <Box
  key={habit.id}
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: habit.checked ? 'rgba(255,255,255,0.03)' : 'transparent',
    transition: 'background 0.15s',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
  }}
>
                      <Typography
  sx={{
    flex: 1,
    fontSize: 15,
    color: habit.checked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
    textDecoration: habit.checked ? 'line-through' : 'none',
    textDecorationColor: 'rgba(255,255,255,0.15)',
    wordBreak: 'break-word',
  }}
>
                        {habit.title}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: habit.streak >= 7
                          ? 'rgba(255,65,81,0.12)'
                          : habit.streak > 0
                          ? 'rgba(255,165,0,0.12)'
                          : 'rgba(255,255,255,0.06)',
                        color: habit.streak >= 7
                          ? '#FF4151'
                          : habit.streak > 0
                          ? '#FFA500'
                          : 'rgba(255,255,255,0.4)',
                        fontSize: 12,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.7 }}/>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'inherit' }}>
                          {habit.streak ?? 0} day{habit.streak !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                        <Box
  onClick={() => increaseProgress(habit.id)}
  sx={{
    width: 22,
    height: 22,
    borderRadius: '6px',
    border: habit.checked ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
    backgroundColor: habit.checked ? '#FF4151' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  }}
>
  {habit.checked && (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )}
</Box>
                        <Tooltip title={`Last completed: ${habit.lastChecked}`}>
                        <IconButton onClick={(event) => handleMenuOpen(event, habit.id)}>
                          <MoreVertIcon />
                        </IconButton>
                        </Tooltip>
                        
                        
  
                        {/* Dropdown Menu */}
                       
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => removeProgress()}>
                            Undo
                          </MenuItem>
                          
                          <MenuItem onClick={() => deleteHabit()}>
                          Delete
                          </MenuItem>
                          
                        </Menu>
                       
                      </Box>
                      
                    </Box>
                  ))
                )}
              </Container>
          
               </Container>
  
            </Container>
  
            <Container maxWidth="md">
  <Box
    onClick={handleOpen}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px dashed rgba(255,255,255,0.1)',
      cursor: 'pointer',
      transition: 'border-color 0.15s',
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
</Container>
          </ThemeProvider>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}