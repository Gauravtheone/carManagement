import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Box, Typography } from "@mui/material";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
      p={3}
    >
      <Typography variant="h3" gutterBottom>
        Car Management System
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ padding: "10px 20px" }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/signup")}
          sx={{ padding: "10px 20px" }}
        >
          Signup
        </Button>
      </Box>
    </Box>
  );
};

export default Home;