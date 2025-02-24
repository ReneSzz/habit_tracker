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
import Link from "next/link";



const Theme = createTheme({
  palette: {
    mode: 'light',
  },
});
// Add a new document







export default function Home() {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const addComponent = () => {
    setComponents((prev) => [...prev, <HabitCard key={prev.length} />]);
  };
  const habit = {title: "Habit Test"}

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
    <ThemeProvider theme={Theme}> 
    <AppBar sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}position="static">
    <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
    <Link  href="/"> 
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Habit Tracker
      </Typography>
      </Link>
      <Link href="/signup" > 
      <Button> Sign up </Button>
      </Link>
    </Toolbar>
  </AppBar>
  
  <Container sx={{bgcolor: "black", height: "93vh", display: "flex",   flexWrap: "wrap", gap:2, alignContent: "flex-start", justifyContent: "Center" }}>

  {components.map((item, index) => (
          <HabitCard key={index}/>
        ))}
    

  </Container>
  </ThemeProvider>
  </>
  
  );
}
