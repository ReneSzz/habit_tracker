"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  TextField,
  CssBaseline,
  
} from "@mui/material";
import Link from "next/link";
import { auth } from "../lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const darkTheme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',},
  palette: {
    mode: "dark",
    primary: {
      main: "#FF4151",
    },
    background: {
      default: "#0f0f0f",
      paper: "#1a1a1a",
    },
  },
components: {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
    },
  },
},
});

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User logged in", userCredential.user);

        // ✅ Redirect to home page after successful login
        router.push("/");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error has occurred");
        }
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
       <AppBar sx={{ backgroundColor: "background.paper", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href="/" passHref>
            <Typography variant="h6" sx={{color: '#e1e1e1ff', fontWeight: 'bold'}}>Habit Tracker</Typography>
          </Link>
          <Link href="/signup" passHref>
          <Button sx={{color: '#e1e1e1ff',borderRadius: '10px', textTransform: 'none', fontWeight: 'bold',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer',
      transition: 'border-color 0.15s',
      '&:hover': { borderColor: 'rgba(255,65,81,0.4)' },}}>Sign Up</Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          height: "93vh",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            boxShadow: 1,
            padding: "20px",
            width: "400px",
            height: "500px",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{fontWeight: 500, fontSize: 22  }}
            variant="h5"
            align="center"
            gutterBottom
          >
            Log in
          </Typography>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="standard"
            sx={{ width: "355px" }}
            onKeyDown={handleKeyDown}
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="standard"
            type="password"
            sx={{ width: "355px" }}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="outlined"
            sx={{ fontWeight: "bold", width: "200px" }}
            onClick={handleSignIn}
          >
            Log in
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }} align="center" gutterBottom>
            Don't have an account? <Link href="/signup" className="accent-link" >Sign up</Link>
          </Typography>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
