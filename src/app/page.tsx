import Image from "next/image";
import styles from "./page.module.css";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';


export default function Home() {
  return (
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Habit Tracker
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
  );
}
