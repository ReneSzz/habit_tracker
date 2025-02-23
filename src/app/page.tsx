"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent } from '@mui/material';
import HabitCard from "./card";
import { JSX } from "@emotion/react/jsx-runtime";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



export default function Home() {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const addComponent = () => {
    setComponents((prev) => [...prev, <HabitCard key={prev.length} />]);
  };
  return (
    <>
    <ThemeProvider theme={darkTheme}> 
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Habit Tracker
      </Typography>
      <Button onClick={() => addComponent()}>Login</Button>
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
