import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, deleteCar } from "../utils/api"; // Import delete API
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Delete, Edit } from "@mui/icons-material";

const CarDetails = () => {
  const { id } = useParams(); // Get car ID from URL
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State for delete confirmation

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await getCarById(id);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteCar(id); // Call delete API
      navigate("/dashboard"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!car) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" color="error">
          Car not found!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Image slider settings for horizontal scrolling
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Box p={4} maxWidth={800} mx="auto">
      {/* Image Carousel (Horizontal sliding) */}
      {car.images.length > 0 && (
        <Slider {...sliderSettings}>
          {car.images.map((image, index) => (
            <Box key={index} sx={{ textAlign: "center" }}>
              <img
                src={image}
                alt={`Car ${index}`}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          ))}
        </Slider>
      )}

      {/* Car Details */}
      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {car.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" mt={1}>
            {car.description}
          </Typography>

          {/* Tags */}
          <Box mt={2}>
            {car.tags.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>

          {/* Buttons */}
          <Box mt={3} display="flex" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/edit-car/${car._id}`)}
              startIcon={<Edit />}
            >
              Edit
            </Button>

            {/* Delete Button (Trash Icon) */}
            <IconButton
              color="error"
              sx={{ ml: 2 }}
              onClick={() => setOpenDialog(true)}
            >
              <Delete />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this car? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarDetails;
