"use client";
import { useState } from "react";
import {
  Typography,
  Button,
  createTheme,
  ThemeProvider,
  Box,
  CssBaseline,
} from "@mui/material";
import Link from "next/link";
import { auth } from "../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const darkTheme = createTheme({
  typography: { fontFamily: '"Inter", sans-serif' },
  palette: {
    mode: "dark",
    primary: { main: "#FF4151" },
    background: { default: "#0f0f0f", paper: "#141414" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") handleSignIn();
  };

  const handleSignIn = async () => {
    if (!email || !password) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error has occurred");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
            Habit Tracker
          </Typography>
        </Link>
        <Link href="/signup" style={{ textDecoration: 'none' }}>
          <Box sx={{
            fontSize: 13, color: 'rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: '8px', padding: '7px 16px', cursor: 'pointer',
            transition: 'all 0.15s',
            '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.3)' },
          }}>
            Sign up
          </Box>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        <Box sx={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px 64px',
          borderRight: '0.5px solid rgba(255,255,255,0.06)',
        }}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px', width: 'fit-content', mb: 4,
            }}>
              {[
                '#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)','rgba(255,255,255,0.04)','rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151',
                'rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)',
                'rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)',
                'rgba(255,255,255,0.04)','rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)','rgba(255,255,255,0.04)',
                'rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)',
                'rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151','rgba(255,65,81,0.5)',
                '#FF4151','rgba(255,65,81,0.5)','rgba(255,65,81,0.2)','rgba(255,255,255,0.04)','rgba(255,65,81,0.2)','rgba(255,65,81,0.5)','#FF4151',
              ].map((bg, i) => (
                <Box key={i} sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: bg }} />
              ))}
            </Box>
          </Box>

          <Typography sx={{
            fontSize: 44, fontWeight: 600, color: '#fff',
            lineHeight: 1.15, letterSpacing: '-0.5px', mb: 2,
          }}>
            Build habits.<br />
            Keep streaks.<br />
            <Box component="span" sx={{ color: '#FF4151' }}>Stay consistent.</Box>
          </Typography>

          <Typography sx={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 380 }}>
            Track your daily habits, visualize your progress over time, and build the consistency that compounds into real change.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mt: 5 }}>
            {[
              { value: '21', label: 'days to build a habit' },
              { value: '66', label: 'days to make it automatic' },
              { value: '1%', label: 'better every day' },
            ].map(({ value, label }) => (
              <Box key={label}>
                <Typography sx={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                  {value}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', mt: 0.25 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{
          width: '440px', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px 48px',
        }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff', mb: 1 }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', mb: 4 }}>
            Log in to your account to continue
          </Typography>

          <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', mb: 1 }}>
            Email
          </Typography>
          <Box
            component="input"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="you@email.com"
            sx={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '12px 14px',
              color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'Inter, sans-serif', mb: 2.5,
              '&::placeholder': { color: 'rgba(255,255,255,0.2)' },
              '&:focus': { borderColor: 'rgba(255,65,81,0.5)', background: 'rgba(255,65,81,0.04)' },
            }}
          />

          <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', mb: 1 }}>
            Password
          </Typography>
          <Box
            component="input"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            sx={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '12px 14px',
              color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'Inter, sans-serif', mb: 3,
              '&::placeholder': { color: 'rgba(255,255,255,0.2)' },
              '&:focus': { borderColor: 'rgba(255,65,81,0.5)', background: 'rgba(255,65,81,0.04)' },
            }}
          />

          {error && (
            <Typography sx={{ fontSize: 13, color: '#FF4151', mb: 2, mt: -1 }}>
              {error}
            </Typography>
          )}

          <Button
            onClick={handleSignIn}
            fullWidth
            sx={{
              backgroundColor: '#FF4151', color: '#fff',
              borderRadius: '10px', padding: '12px',
              fontSize: 14, fontWeight: 500, mb: 3,
              '&:hover': { backgroundColor: '#e0303f' },
            }}
          >
            Log in
          </Button>

          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#FF4151', textDecoration: 'none' }}>
              Sign up
            </Link>
          </Typography>
        </Box>

      </Box>
    </ThemeProvider>
  );
}