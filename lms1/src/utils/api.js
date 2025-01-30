import axios from "axios";

// Set default base URL
const API = axios.create({
  baseURL: "https://carmanagement-zui1.onrender.com/api",
  withCredentials: true, // Important for sending cookies
});

// Login
export const getCarById = async (id) => {
  return await axios.get(`https://carmanagement-zui1.onrender.com/api/cars/${id}`, {
    withCredentials: true,
  });
};
export const login = (credentials) => API.post("/auth/login", credentials);

// Signup
export const signup = (data) => API.post("/auth/signup", data);

// Logout
export const logout = () => API.post("/auth/logout");

// Check Authentication (User info from cookie)
export const checkAuth = async (token) => {
  const response = await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in the Authorization header
    },
  });
  return response.data;
};

// Get All Cars
export const getCars = () => API.get("/cars");

// Upload a single image and get its URL
export const uploadCarImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post("/cars/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Create Car (now using image URLs instead of file uploads)
export const createCar = async (carData) => {
  try {
    const response = await API.post("/cars", carData);
    return response;
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
};

// Update Car
export const updateCar = (id, carData) => API.put(`/cars/${id}`, carData);

// Delete Car
export const deleteCar = (id) => API.delete(`/cars/${id}`);

// Search Cars
export const searchCars = (keyword) => API.get(`/cars/search?keyword=${keyword}`);
