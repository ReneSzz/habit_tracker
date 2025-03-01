"use client";
import { useState, useEffect, JSX } from "react";
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Modal, Box, TextField, Select  } from "@mui/material";
import HabitCard from "./card";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import { auth, db } from "./lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./lib/PrivateRoute";
import { User } from "firebase/auth";
import { getApp } from "firebase/app";
import { wrap } from "module";
import { collection, addDoc, getDocs, query, where  } from "firebase/firestore";

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
  
  const fetchHabits = async () => {
    if (!user || !user.uid) return;
    try {
      const habitsRef = collection(db, 'users', user?.uid, 'habits');
      const habitSnapshot = await getDocs(habitsRef);
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
                height: "93vh",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <div>
      <h2>Habits for User {user?.uid}</h2>
      {habits.length === 0 ? (
        <p>No habits found</p>
      ) : (
        habits.map((habit) => (
          <div key={habit.id}>
            <h3>{habit.title}</h3>
            <p>{habit.createdAt.toDate().toLocaleString()}</p> {/* Assuming there's a createdAt field */}
          </div>
        ))
      )}
    </div>
              <Container sx={{display: 'flex', alignItems: "center", justifyContent: "center",gap:'10px'}}> 
              <Typography variant="h6"> Add habit  </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#FF4151'}} onClick={handleOpen}> + </Button>
              </Container>
              {/* {components.map((_, index) => (
                <HabitCard key={index} />
              ))} */}


            </Container>
          </ThemeProvider>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}
