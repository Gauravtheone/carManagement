import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const AuthForm = ({ title, onSubmit, isSignup }) => {
  const [formData, setFormData] = useState({ email: "", password: "", name: isSignup ? "" : undefined });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={6} sx={{ p: 4, width: 350, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isSignup && (
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            {title}
          </Button>
        </form>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate(isSignup ? "/login" : "/signup")}
          sx={{ mt: 2 }}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
        </Button>
        {/* Add "Go Back to Home" Button */}
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 1 }}
        >
          Go Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthForm;