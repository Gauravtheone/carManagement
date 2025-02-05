import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCars, searchCars } from "../utils/api";
import { Grid, Button, TextField, Typography, Box } from "@mui/material";
import CarCard from "../components/CarCard"; // Import CarCard Component

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await getCars();
        setCars(response.data);
        setFilteredCars(response.data);
        console.log(response)
      } catch (error) {
        console.error("Error fetching cars", error);
      }
    };

    fetchCars();
  }, []);



  return (
    <Box p={4} sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email}!
      </Typography>

      {/* Add Car & Search Section */}
      <Box display="flex" gap={2} my={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/add-car")}>
          Add Car
        </Button>
      

        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
         Go To Home
        </Button>



      </Box>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <Typography>No cars found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={car._id}>
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 3 }}
        onClick={() => {
          localStorage.removeItem("token"); 
          localStorage.removeItem("user"); 
          setUser(null);
          navigate("/login");
        }}
      >
        Logo ut
      </Button>
    </Box>
  );
};

export default Dashboard;
