import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../utils/api"; // Import API functions
import { Box, Button, TextField, CircularProgress, Snackbar, Typography, IconButton } from "@mui/material";
import { Delete, AddPhotoAlternate } from "@mui/icons-material";
import axios from "axios";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [imageUrls, setImageUrls] = useState([]); // Store image URLs
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await getCarById(id);
        setCar(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          tags: response.data.tags.join(", "),
        });
        setImageUrls(response.data.images || []);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCar();
  }, [id]);

  // Track state updates
  useEffect(() => {
    console.log("Updated imageUrls state:", imageUrls);
  }, [imageUrls]);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Image upload function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await axios.post(
        "https://carmanagement-zui1.onrender.com/api/cars/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      if (!response.data.imageUrl) {
        throw new Error("Image upload failed!");
      }

      setImageUrls((prevUrls) => {
        const updatedUrls = [...prevUrls, response.data.imageUrl];
        console.log("Updated imageUrls:", updatedUrls);
        return updatedUrls;
      });
      
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      images: imageUrls, // Include updated images
    };

    console.log("Submitting updated car data:", updatedData);

    try {
      await updateCar(id, updatedData);
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate(`/car/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating car:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  if (!car) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth={800} mx="auto">
      <Typography variant="h4" gutterBottom>Edit Car</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Car Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Car Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />
        <TextField
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Image Upload */}
        <Box
          sx={{
            border: "2px dashed #1976d2",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <AddPhotoAlternate sx={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="body2">Click to select images</Typography>
          </label>
        </Box>

        {/* Display selected images */}
        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
          {imageUrls.map((url, index) => (
            <Box key={index} position="relative" sx={{ width: 120, height: 120 }}>
              <img
                src={url}
                alt={`Uploaded image ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "white",
                  color: "red",
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Submit Button */}
        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ flex: 1, marginRight: 2 }}
          >
            {loading ? "Updating..." : "Update Car"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/car/${car._id}`)}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </form>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="Car updated successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default EditCar;
