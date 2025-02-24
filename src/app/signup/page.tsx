"use client";
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent, TextField } from '@mui/material';
import Link from 'next/link';

const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

export default function signUp(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
       <ThemeProvider theme={darkTheme}>
    <AppBar sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}position="static">
    <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
    <Link href="/" passHref> 
      <Typography variant="h6" >
        Habit Tracker
      </Typography>
      </Link>
      <Button>Sign Up</Button>
    </Toolbar>
  </AppBar>

  <Container sx={{ height: "93vh", display: "flex", flexWrap: "wrap", gap:2, justifyContent: "Center" }}>
  <Card variant="outlined" sx={{ marginTop: "50px",display: "flex", flexDirection: 'column', boxShadow: 1, padding: '20px', width: "400px", height: "500px", justifyContent: "space-around"}}>
  <Typography sx={{fontWeight: "bold"}} variant="h5" align="center" gutterBottom>  Create Account </Typography>
  <TextField id="standard-basic" label="Email" variant="standard" />
  <TextField id="standard-basic" label="Password" variant="standard" />
  <Button sx={{fontWeight: "bold"}} > Create account </Button>
  <Typography sx={{fontWeight: "bold"}}  align="center" gutterBottom> Already have an account? <a href="/">Log in</a></Typography>
  </Card>

  </Container>

  </ThemeProvider>
  
    )
}