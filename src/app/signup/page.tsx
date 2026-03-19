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
  TextField,
  CssBaseline,
} from "@mui/material";
import Link from "next/link";
import { auth } from "../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const darkTheme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
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
          textTransform: "none",
        },
      },
    },
  },
});

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/login");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    } else {
      setError("Fill both fields");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar
        sx={{
          backgroundColor: "background.paper",
          boxShadow: "0 1px 0 rgba(255,255,255,0.08)",
        }}
        position="static"
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href="/" passHref>
            <Typography
              variant="h6"
              sx={{ color: "#e1e1e1", fontWeight: "bold" }}
            >
              Habit Tracker
            </Typography>
          </Link>
          <Link href="/signup" passHref>
            <Button sx={{ color: "#e1e1e1" }}>Sign Up</Button>
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
          <Typography sx={{ fontWeight: 500, fontSize: 22 }} align="center">
            Create account
          </Typography>

          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="standard"
            sx={{ width: "100%" }}
            onKeyDown={handleKeyDown}
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="standard"
            type="password"
            sx={{ width: "100%" }}
            onKeyDown={handleKeyDown}
          />

          <Button
            variant="outlined"
            onClick={handleSignUp}
            sx={{
              width: "100%",
              borderColor: "#FF4151",
              color: "#FF4151",
              "&:hover": {
                borderColor: "#ff6370",
                backgroundColor: "rgba(255,65,81,0.08)",
              },
            }}
          >
            Create account
          </Button>

          {error && (
            <Typography color="error" align="center" sx={{ fontSize: 13 }}>
              {error}
            </Typography>
          )}

          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }} align="center">
            Already have an account?{" "}
            <Link href="/login" className="accent-link">
              Log in
            </Link>
          </Typography>
        </Card>
      </Container>
    </ThemeProvider>
  );
}