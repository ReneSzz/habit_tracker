"use client";
import { useState, useEffect, JSX } from "react";
import { AppBar, Toolbar, Typography, Button, Container, createTheme, ThemeProvider } from "@mui/material";
import HabitCard from "./card";
import Link from "next/link";
import { auth } from "./lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./lib/PrivateRoute";
import { User } from "firebase/auth";

const Theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function Home() {
 const [components, setComponents] = useState<JSX.Element[]>([]);
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Track auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <>
      <AuthProvider>
        <PrivateRoute>
          <ThemeProvider theme={Theme}>
            <AppBar sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }} position="static">
              <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link href="/">
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Habit Tracker
                  </Typography>
                </Link>

                {user ? (
                  <Button onClick={handleSignOut}>Sign Out</Button>
                ) : (
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                )}
              </Toolbar>
            </AppBar>

            <Container
              sx={{
                bgcolor: "black",
                height: "93vh",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignContent: "flex-start",
                justifyContent: "center",
              }}
            >
              {components.map((_, index) => (
                <HabitCard key={index} />
              ))}
            </Container>
          </ThemeProvider>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}
