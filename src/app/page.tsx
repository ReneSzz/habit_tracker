"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  return (
    <>
    <ThemeProvider theme={darkTheme}> 
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Habit Tracker
      </Typography>
      <Button>Login</Button>
    </Toolbar>
  </AppBar>
  
  <Container sx={{bgcolor: "white", height: "93vh", display: "flex",   flexWrap: "wrap", gap:2, alignContent: "flex-start", justifyContent: "Center" }}>

    <Card variant="outlined" sx={{width: 300, height: 150, mt: 1.5}}> 
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 18 }}>
        Habit
      </Typography>
      <Typography variant="h5" component="div">
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
      <Typography variant="body2">
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    </Card> 
    
    

  </Container>
  </ThemeProvider>
  </>
  
  );
}
