"use client";
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent, TextField } from '@mui/material';
import Link from 'next/link';
import {auth} from '../lib/firebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useRouter} from 'next/navigation';


const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSignUp();
      }
    };

    const handleSignUp = async () => {
      if (email && password) {
        try {
          // Firebase authentication
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User signed up');
  
          // Redirect to dashboard after successful sign-up
          router.push('/login'); // Next.js redirect
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
        }
      } else {
        setError('Fill both fields');
      }
    };
  
    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }} position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/" passHref>
              <Typography variant="h6">Habit Tracker</Typography>
            </Link>
            <Link href="/signup" passHref>
          <Button>Sign Up</Button>
          </Link>
          </Toolbar>
        </AppBar>
  
        <Container sx={{ height: '93vh', display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          <Card
            variant="outlined"
            sx={{
              marginTop: '50px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 1,
              padding: '20px',
              width: '400px',
              height: '500px',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }} variant="h5" align="center" gutterBottom>
              Create Account
            </Typography>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              id="standard-basic"
              label="Email"
              variant="standard"
              sx={{width: '355px'}}
              onKeyDown={handleKeyDown}
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              sx={{width: '355px'}}
              onKeyDown={handleKeyDown}
            />
            <Button variant="outlined" sx={{ fontWeight: 'bold',width: "250px" }} onClick={handleSignUp}>
              Create account
            </Button>
            {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
            <Typography sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
              Already have an account? <a href="/login">Log in</a>
            </Typography>
          </Card>
        </Container>
      </ThemeProvider>
    );
  }