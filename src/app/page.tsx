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


// Theme configuration
const Theme = createTheme({
  palette: {
    mode: "light",
  },
});

// Habit interface
interface Habit {
  id: string;
  title: string;
  checked: boolean;
  lastChecked: string;
}

// Modal styling
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

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
          habit.id === selectedHabit ? { ...habit, checked: false} : habit
        );
        setHabits(updatedHabits);

        // Recalculate progress
        const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
        const totalHabits = updatedHabits.length;
        setProgress(totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0);
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
      const habitList = habitSnapshot.docs.map((doc) => ({
        ...doc.data() as Habit,
        id: doc.id,
      }));

      const currentDate = new Date().toISOString().split("T")[0];

      const updatedHabits = habitList.map((habit) => {
        if (habit.lastChecked !== currentDate) {
          return { ...habit, checked: false };
        }
        return habit;
      });

      setHabits(updatedHabits);

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
          <ThemeProvider theme={Theme}>
            <AppBar sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }} position="static">
              <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link href="/">
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Habit Tracker
                  </Typography>
                </Link>
  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '800px', height: 10, borderRadius: 5 }}
                  />
                  <Typography>{progress}%</Typography>
                </Box>
  
                {user ? (
                  <Button onClick={handleSignOut}>Sign Out</Button>
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
              sx={{
                height: "86vh",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                paddingTop: '30px',
                alignItems: 'flex-start'
              }}
            >
              <Container sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {habits.length === 0 ? (
                  <p>No habits found</p>
                ) : (
                  habits.map((habit) => (
                    <Card
                      sx={{
                        padding: '20px',
                        width: '260px',
                        minHeight: '75px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        backgroundColor: habit.checked ? '#a2d5f8 ' : 'lightcoral',
                      }}
                      key={habit.id}
                    >
                      <Typography
                        gutterBottom
                        sx={{
                          color: 'text.secondary',
                          fontSize: 14,
                          wordBreak: "break-word", 
                          overflowWrap: "break-word",
                          flex: 1
                        }}
                      >
                        {habit.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                        <Button onClick={() => increaseProgress(habit.id)} sx={{}}>
                          ✔
                        </Button>
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
                      
                    </Card>
                  ))
                )}
              </Container>
          
               </Container>
  
            </Container>
  
            <Container sx={{ display: 'flex', alignItems: "center", justifyContent: "center", gap: '10px' }}>
              <Typography variant="h6"> Add habit </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#FF4151' }} onClick={handleOpen}> + </Button>
            </Container>
          </ThemeProvider>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}