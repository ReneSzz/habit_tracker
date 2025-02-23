"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent } from '@mui/material';
import HabitCard from "./card";
import {app, db} from './lib/firebaseConfig'
import { getFirestore, Firestore, addDoc, collection } from "firebase/firestore";
import { JSX } from "@emotion/react/jsx-runtime";
import firebase from "firebase/compat/app";



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
// Add a new document







export default function Home() {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const addComponent = () => {
    setComponents((prev) => [...prev, <HabitCard key={prev.length} />]);
  };
  const habit = {title: "Habit Test"}
  console.log(db)
async function addHabit(db: Firestore, habitData: object) {

  try {

    const docRef = await addDoc(collection(db, "habit"), habitData);

    console.log("Document written with ID: ", docRef.id);

  } catch (e: any) {

    console.error("Error adding document:", e.message, e.code);

  }

}
 
  return (
    <>
    <ThemeProvider theme={darkTheme}> 
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Habit Tracker
      </Typography>
      <Button
  onClick={async () => {
    try {
      await addHabit(db, habit);
      console.log("Habit added successfully");
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  }}
>
  Add Habit
</Button>
    </Toolbar>
  </AppBar>
  
  <Container sx={{bgcolor: "white", height: "93vh", display: "flex",   flexWrap: "wrap", gap:2, alignContent: "flex-start", justifyContent: "Center" }}>

  {components.map((item, index) => (
          <HabitCard key={index}/>
        ))}
    

  </Container>
  </ThemeProvider>
  </>
  
  );
}
