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
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert';


const Theme = createTheme({
  palette: {
    mode: "light",
  },
});


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
 const [components, setComponents] = useState<JSX.Element[]>([]);
 const [user, setUser] = useState<User | null>(null);
 const [open, setOpen] = useState(false);
 const [habitTitle, setHabitTitle] = useState('')
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = useState("");
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [progress, setProgress] = useState(30);

  const increaseProgress = () => {
    setProgress((prev) => Math.min(prev + 10, 100)); // Increment but max 100
  };
  const removeProgress = () => {
    setProgress((prev) => Math.max(prev - 10, 0)); // Increment but max 100
    handleMenuClose()
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
      const habitsRef = collection(db, "users", user.uid, "habits");
      const q = query(habitsRef, orderBy("createdAt", "desc")); // Order by 'createdAt' field (newest first)
      const habitSnapshot = await getDocs(q);
      const habitList = habitSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHabits(habitList);
    } catch (error) {
      console.error("Error fetching habits: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHabits(); // Fetch habits when component mounts
  }, [user?.uid]);

  const addHabitToFirestore = async () => {
    if (!habitTitle.trim() || !user || !user.uid) return;
    
    try {
      await addDoc(collection(db, 'users', user?.uid, "habits"), {
        title: habitTitle,
        createdAt: new Date(),
        userId: user?.uid
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
               <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}> 
                <LinearProgress variant="determinate" value={progress} sx={{ width: '800px', height: 10, borderRadius: 5 }} />
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
              <Box sx={style }>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                   Create a new habit
                  </Typography>
                <TextField               
                              id="standard-basic"
                              label="Habit"
                              variant="standard"
                              value={habitTitle}
                              onChange={handleTitle}
                              sx={{width: '245px'}}
                            />

                            <FormControl> 


                            <TextField
                              label="Times per day"
                              type="text" // Using text to allow full control over input validation
                              value={value}
                              onChange={handleChange}
                              sx={{width: '245px'}}
                            />                        
                
                </FormControl>
                <Button variant="outlined"  onClick={handleAdd}> Add </Button>
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
              <Container sx={{display: "flex",
                flexWrap: "wrap",
                gap: 2,
                
            }}>
      {habits.length === 0 ? (
        <p>No habits found</p>
      ) : (
        
        habits.map((habit) => (
          <Card sx={{padding: '20px',width: '300px', height: '75px', display:'flex', alignItems: 'center', justifyContent: "space-between"}}key={habit.id}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14,whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: 'clip', 
      flex: 1 }}>
            {habit.title}
      </Typography>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "center"}}> 
      <Button onClick={increaseProgress} sx={{}}>
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
              <MenuItem onClick={() => deleteHabit()}>
                <DeleteIcon sx={{ marginRight: 1 }} /> Delete
              </MenuItem>
              <MenuItem onClick={() => removeProgress()}>
                 Undo
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
            <Container sx={{display: 'flex', alignItems: "center", justifyContent: "center",gap:'10px'}}> 
              <Typography variant="h6"> Add habit  </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#FF4151'}} onClick={handleOpen}> + </Button>
              </Container>
          </ThemeProvider>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}
