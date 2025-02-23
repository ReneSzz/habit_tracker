import { Card, CardContent, Typography } from "@mui/material";

const HabitCard = () => {
  return (
    <Card variant="outlined" sx={{ width: 300, height: 150, mt: 1.5 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          
        </Typography>
        <Typography variant="h5" component="div">
          {/* You can put some additional text here if needed */}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          
        </Typography>
        <Typography variant="body2"></Typography>
      </CardContent>
    </Card>
  );
};

export default HabitCard;