"use client";
import { useState, useEffect, JSX } from "react";
import {  LinearProgress,Menu , AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Modal, Box, TextField, Select, Card, IconButton  } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import { auth, db } from "./lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./lib/PrivateRoute";
import { User } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy, updateDoc, getDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert';


const Theme = createTheme({
  palette: {
    mode: "light",
  },
});

interface Habit {
  id: string;
  title: string;
  checked: boolean; // Ensure checked is included
  // Add other fields if needed
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: 'column',
  gap: '10px'
}

export default function Home() {
 const [user, setUser] = useState<User | null>(null);
 const [open, setOpen] = useState(false);
 const [habitTitle, setHabitTitle] = useState('')
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
const [value, setValue] = useState("1");
const [habits, setHabits] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
const [progress, setProgress] = useState(0);

const increaseProgress = async (habitId: string) => {
  if (!user || !user.uid) return;

  try {
    const habitRef = doc(db, "users", user.uid, "habits", habitId);
    const habitSnap = await getDoc(habitRef);

    if (habitSnap.exists()) {
      const habitData = habitSnap.data();
      const checked = habitData?.checked;

      // Only update if it's not already checked
      if (!checked) {
        // Update Firestore: Mark the habit as checked
        await updateDoc(habitRef, { checked: true });

        // Update local state
        const updatedHabits = habits.map((habit) =>
          habit.id === habitId ? { ...habit, checked: true } : habit
        );
        setHabits(updatedHabits);

        // Recalculate progress
        const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
        const totalHabits = updatedHabits.length;
        const newProgress = totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0; // Round to nearest whole number
        setProgress(newProgress);

        console.log(`Updated progress: ${newProgress}%`);
      } else {
        console.log("Habit already checked");
      }
    } else {
      console.log("Habit not found in Firestore");
    }
  } catch (error) {
    console.error("Error increasing progress and marking habit as checked: ", error);
  }
};

const removeProgress = async () => {
  if (!user || !user.uid || !selectedHabit) return; // Ensure selectedHabit is valid

  try {
    const habitRef = doc(db, "users", user.uid, "habits", selectedHabit);
    const habitSnap = await getDoc(habitRef);

    if (habitSnap.exists()) {
      const habitData = habitSnap.data();
      const checked = habitData?.checked;

      // If the habit is unchecked or doesn't exist, return early
      if (checked === undefined || !checked) {
        console.log("Habit is already unchecked or checked doesn't exist");
        return;
      }

      // Update the 'checked' field to false in Firestore
      await updateDoc(habitRef, { checked: false });

      // Update the local state immediately
      const updatedHabits = habits.map((habit) =>
        habit.id === selectedHabit ? { ...habit, checked: false } : habit
      );
      setHabits(updatedHabits);

      // Recalculate progress
      const checkedHabits = updatedHabits.filter((habit) => habit.checked).length;
      const totalHabits = updatedHabits.length;
      const newProgress = totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0; // Round to nearest whole number
      setProgress(newProgress);

      console.log("Progress removed and habit unchecked");
    } else {
      console.log("Habit not found in Firestore");
    }
  } catch (error) {
    console.error("Error removing progress: ", error);
  } finally {
    handleMenuClose(); // Close the menu after action is completed
  }
};





  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, habitId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedHabit(habitId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHabit(null);
  };

  const deleteHabit = async () => {
    if (!user || !user.uid) return;
    if (!selectedHabit) return;
    try {
      const habitDoc = doc(db, 'users', user?.uid, 'habits', selectedHabit);
      await deleteDoc(habitDoc);
      handleMenuClose();
      fetchHabits(); // Refresh habits after deletio
    } catch (error) {
      console.error("Error deleting habit: ", error);
    }
  };
  
  const fetchHabits = async () => {
    if (!user || !user.uid) return;
  
    try {
      // Query to order habits by 'createdAt' field in ascending order
      const habitsRef = collection(db, "users", user.uid, "habits");
      const habitQuery = query(habitsRef, orderBy("createdAt", "desc")); // Ascending order
  
      const habitSnapshot = await getDocs(habitQuery);
      const habitList = habitSnapshot.docs.map((doc) => ({
        ...doc.data() as Habit,
        id: doc.id,
      }));
  
      setHabits(habitList);
      const checkedHabits = habitList.filter((habit) => habit.checked).length;
      const totalHabits = habitList.length;
  
      // Calculate the progress percentage and round it
      const calculatedProgress = totalHabits > 0 ? Math.round((checkedHabits / totalHabits) * 100) : 0;
      setProgress(calculatedProgress);
    } catch (error) {
      console.error("Error fetching habits: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHabits(); // Fetch habits when component mounts or user changes
  }, [user?.uid]);

  const addHabitToFirestore = async () => {
    if (!habitTitle.trim() || !user || !user.uid) return;
    
    try {
      await addDoc(collection(db, 'users', user?.uid, "habits"), {
        title: habitTitle,
        createdAt: new Date(),
        userId: user?.uid,
        checked: false
      });
      console.log("Habit added successfully!");
      fetchHabits()
      setHabitTitle(""); // Clear input after adding
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Extract input value safely

    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setValue(inputValue); // Update state only if the input is valid
      console.log(value)
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
                <FormControl>
                  <TextField
                    label="Times per day"
                    type="text" // Using text to allow full control over input validation
                    value={value}
                    onChange={handleChange}
                    sx={{ width: '245px' }}
                  />
                </FormControl>
                <Button variant="outlined" onClick={handleAdd}> Add </Button>
              </Box>
            </Modal>
  
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
                        height: '75px',
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
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: 'clip',
                          flex: 1
                        }}
                      >
                        {habit.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                        <Button onClick={() => increaseProgress(habit.id)} sx={{}}>
                          ✔
                        </Button>
  
                        <IconButton onClick={(event) => handleMenuOpen(event, habit.id)}>
                          <MoreVertIcon />
                        </IconButton>
  
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
  
              {/* {components.map((_, index) => (
                <HabitCard key={index} />
              ))} */}
  
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