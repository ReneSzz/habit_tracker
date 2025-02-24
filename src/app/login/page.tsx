"use client";
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider, Card, CardContent, TextField } from '@mui/material';
import Link from 'next/link';
import {auth} from '../lib/firebaseConfig'
import { connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {useRouter} from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { errorMonitor } from 'events';




const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    let isThrottled = false;

    const handleSignIn = async () => {
        if (email && password) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;
            console.log("User logged in", loggedInUser)

            router.push('/dashboard'); // Redirect after successful sign-in
          } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unkown error has occured')
            }
          }
                        
      };
    }
    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }} position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/" passHref>
              <Typography variant="h6">Habit Tracker</Typography>
            </Link>
            <Button>Sign Up</Button>
          </Toolbar>
        </AppBar>
  
        <Container sx={{ height: '93vh', display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center',}}>
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
              Log in
            </Typography>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              id="standard-basic"
              label="Email"
              variant="standard"
              sx={{width: '355px'}}
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              id="standard-basic"
              label="Password"
              variant="standard"
              type="password"
              sx={{width: '355px'}}
            />
            <Button variant="outlined" sx={{ fontWeight: 'bold', width: "200px" }} onClick={handleSignIn}>
              log in
            </Button>
            <Typography sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
              Don't have an account? <a href="/signup">Sign up</a>
            </Typography>
          </Card>
        </Container>
      </ThemeProvider>
    );
  }