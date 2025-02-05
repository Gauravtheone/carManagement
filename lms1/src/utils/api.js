import axios from "axios";

// Set default base URL
const API = axios.create({
  baseURL: "https://carmanagement-zui1.onrender.com/api",
  withCredentials: true, // Important for sending cookies
});

// Login
// Add a request interceptor to include the token in headers
API.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Functions

export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (data) => API.post("/auth/signup", data);
export const logout = () => API.post("/auth/logout");
export const getCarById = (id) => API.get(`/cars/${id}`);
export const getCars = () => API.get("/cars");
export const searchCars = (keyword) => API.get(`/cars/search?keyword=${keyword}`);

export const uploadCarImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post("/cars/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const createCar = (carData) => API.post("/cars", carData);
export const updateCar = (id, carData) => API.put(`/cars/${id}`, carData);
export const deleteCar = (id) => API.delete(`/cars/${id}`);
