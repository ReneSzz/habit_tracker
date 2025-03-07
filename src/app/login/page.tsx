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
} from "@mui/material";
import Link from "next/link";
import { auth } from "../lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const darkTheme = createTheme({
  palette: {
    mode: "light",
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
      <AppBar
        sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}
        position="static"
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href="/" passHref>
            <Typography variant="h6">Habit Tracker</Typography>
          </Link>
          <Link href="/signup" passHref>
          <Button>Sign Up</Button>
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
            sx={{ fontWeight: "bold" }}
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
          <Typography sx={{ fontWeight: "bold" }} align="center" gutterBottom>
            Don't have an account? <Link href="/signup">Sign up</Link>
          </Typography>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
