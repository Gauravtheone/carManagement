import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCar } from "../utils/api"; // Import API function
import axios from "axios";
import { TextField, Button, CircularProgress, Grid, Typography, Box, Card, CardMedia } from "@mui/material";

const AddCar = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [imageUrls, setImageUrls] = useState([]); // Store uploaded image URLs
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Track image upload status
  const navigate = useNavigate();

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Upload image one by one
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

      if (!response.data.imageUrl) {
        throw new Error("Image upload failed!");
      }

      setImageUrls((prev) => [...prev, response.data.imageUrl]);
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

    const formDataToSubmit = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags,
      images: imageUrls, // Send uploaded image URLs from frontend
    };

    try {
      await createCar(formDataToSubmit); // Send data to backend
      navigate("/dashboard"); // Redirect after success
    } catch (error) {
      console.error("Error adding car:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} sx={{ maxWidth: 600, margin: "auto", backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add a New Car
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Car Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Car Title"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Car Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Car Description"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
            />
          </Grid>

          {/* Car Tags */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Car Tags (comma separated)"
              variant="outlined"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button variant="contained" component="span" color="secondary" fullWidth>
                Upload Image
              </Button>
            </label>
            {uploading && <Typography color="textSecondary">Uploading image...</Typography>}
          </Grid>

          {/* Display Uploaded Images */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {imageUrls.map((url, index) => (
                <Grid item key={index} xs={4}>
                  <Card>
                    <CardMedia component="img" height="100" image={url} alt={`Uploaded ${index}`} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Submitting..." : "Add Car"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddCar;
